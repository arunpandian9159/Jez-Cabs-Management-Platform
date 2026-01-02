import { Injectable, Logger } from '@nestjs/common';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Geofence {
  id: string;
  name: string;
  type:
    | 'airport'
    | 'railway_station'
    | 'bus_stand'
    | 'mall'
    | 'hospital'
    | 'custom';
  center: Coordinates;
  radius: number; // in meters
  surgeMultiplier?: number;
  pickupPoints?: {
    id: string;
    name: string;
    location: Coordinates;
    instructions?: string;
  }[];
  specialInstructions?: string;
  isActive: boolean;
}

export interface DriverLocation {
  driverId: string;
  location: Coordinates;
  vehicleType: string;
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface HeatMapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

// Pre-defined geofences for common locations
const PREDEFINED_GEOFENCES: Geofence[] = [
  {
    id: 'chennai_airport',
    name: 'Chennai International Airport',
    type: 'airport',
    center: { lat: 12.9941, lng: 80.1709 },
    radius: 2000,
    surgeMultiplier: 1.2,
    pickupPoints: [
      {
        id: 'terminal_1_arrivals',
        name: 'Terminal 1 - Arrivals',
        location: { lat: 12.9939, lng: 80.1707 },
        instructions: 'Exit arrivals, proceed to lane 3',
      },
      {
        id: 'terminal_2_arrivals',
        name: 'Terminal 2 - Arrivals',
        location: { lat: 12.9943, lng: 80.1711 },
        instructions: 'Exit arrivals, proceed to designated pickup zone',
      },
    ],
    specialInstructions: 'Airport pickup fee of ₹100 applies',
    isActive: true,
  },
  {
    id: 'chennai_central',
    name: 'Chennai Central Railway Station',
    type: 'railway_station',
    center: { lat: 13.0827, lng: 80.2707 },
    radius: 500,
    surgeMultiplier: 1.1,
    pickupPoints: [
      {
        id: 'main_entrance',
        name: 'Main Entrance',
        location: { lat: 13.0825, lng: 80.2705 },
        instructions: 'Wait at prepaid taxi stand',
      },
    ],
    isActive: true,
  },
  {
    id: 'cmbt',
    name: 'CMBT Bus Terminal',
    type: 'bus_stand',
    center: { lat: 13.0694, lng: 80.2027 },
    radius: 400,
    surgeMultiplier: 1.05,
    isActive: true,
  },
  {
    id: 'phoenix_mall',
    name: 'Phoenix MarketCity',
    type: 'mall',
    center: { lat: 12.9945, lng: 80.2153 },
    radius: 300,
    pickupPoints: [
      {
        id: 'main_gate',
        name: 'Main Gate',
        location: { lat: 12.9943, lng: 80.2151 },
      },
    ],
    isActive: true,
  },
];

@Injectable()
export class GeofenceService {
  private readonly logger = new Logger(GeofenceService.name);
  private geofences: Geofence[] = PREDEFINED_GEOFENCES;
  private driverLocations: Map<string, DriverLocation> = new Map();

  /**
   * Check if a location is within any geofence
   */
  getGeofenceForLocation(location: Coordinates): Geofence | null {
    for (const geofence of this.geofences) {
      if (!geofence.isActive) continue;

      const distance = this.calculateDistance(location, geofence.center);
      if (distance <= geofence.radius) {
        return geofence;
      }
    }
    return null;
  }

  /**
   * Get all active geofences
   */
  getAllGeofences(): Geofence[] {
    return this.geofences.filter((g) => g.isActive);
  }

  /**
   * Get geofences near a location
   */
  getNearbyGeofences(location: Coordinates, radiusKm: number = 5): Geofence[] {
    const radiusMeters = radiusKm * 1000;
    return this.geofences.filter((geofence) => {
      if (!geofence.isActive) return false;
      const distance = this.calculateDistance(location, geofence.center);
      return distance <= radiusMeters + geofence.radius;
    });
  }

  /**
   * Get pickup points for a geofence
   */
  getPickupPoints(geofenceId: string) {
    const geofence = this.geofences.find((g) => g.id === geofenceId);
    return geofence?.pickupPoints || [];
  }

  /**
   * Get surge multiplier for a location
   */
  getSurgeFromGeofence(location: Coordinates): number {
    const geofence = this.getGeofenceForLocation(location);
    return geofence?.surgeMultiplier || 1;
  }

  /**
   * Update driver location
   */
  updateDriverLocation(
    driverId: string,
    location: Coordinates,
    vehicleType: string,
    isAvailable: boolean,
  ): void {
    this.driverLocations.set(driverId, {
      driverId,
      location,
      vehicleType,
      isAvailable,
      lastUpdated: new Date(),
    });
  }

  /**
   * Get nearby available drivers
   */
  getNearbyDrivers(
    location: Coordinates,
    radiusKm: number = 3,
    vehicleType?: string,
  ): DriverLocation[] {
    const radiusMeters = radiusKm * 1000;
    const nearbyDrivers: DriverLocation[] = [];
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    for (const driver of this.driverLocations.values()) {
      // Skip stale locations
      if (Date.now() - driver.lastUpdated.getTime() > staleThreshold) continue;

      // Skip unavailable drivers
      if (!driver.isAvailable) continue;

      // Filter by vehicle type if specified
      if (vehicleType && driver.vehicleType !== vehicleType) continue;

      const distance = this.calculateDistance(location, driver.location);
      if (distance <= radiusMeters) {
        nearbyDrivers.push(driver);
      }
    }

    return nearbyDrivers;
  }

  /**
   * Generate heat map data for driver availability
   */
  generateHeatMapData(
    bounds: { north: number; south: number; east: number; west: number },
    gridSize: number = 20,
  ): HeatMapPoint[] {
    const points: HeatMapPoint[] = [];
    const latStep = (bounds.north - bounds.south) / gridSize;
    const lngStep = (bounds.east - bounds.west) / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = bounds.south + latStep * (i + 0.5);
        const lng = bounds.west + lngStep * (j + 0.5);

        // Count nearby drivers
        const nearbyDrivers = this.getNearbyDrivers({ lat, lng }, 1);
        const intensity = Math.min(1, nearbyDrivers.length / 5); // Max 5 drivers = full intensity

        if (intensity > 0) {
          points.push({ lat, lng, intensity });
        }
      }
    }

    return points;
  }

  /**
   * Get driver density for an area
   */
  getDriverDensity(
    location: Coordinates,
    radiusKm: number = 2,
  ): {
    total: number;
    available: number;
    byVehicleType: Record<string, number>;
  } {
    const nearbyDrivers = this.getNearbyDrivers(location, radiusKm);

    const byVehicleType: Record<string, number> = {};
    for (const driver of nearbyDrivers) {
      byVehicleType[driver.vehicleType] =
        (byVehicleType[driver.vehicleType] || 0) + 1;
    }

    return {
      total: this.driverLocations.size,
      available: nearbyDrivers.length,
      byVehicleType,
    };
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
