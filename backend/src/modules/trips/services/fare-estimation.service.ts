import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare: number;
  tollCharges: number;
  discount: number;
  totalFare: number;
}

export interface RouteOption {
  id: string;
  name: string;
  distance_km: number;
  duration_minutes: number;
  trafficLevel: 'light' | 'moderate' | 'heavy';
  tolls: number;
  fare: FareBreakdown;
  isRecommended: boolean;
}

export interface VehicleType {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minFare: number;
  capacity: number;
  icon: string;
}

// Vehicle rate configuration
const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'mini',
    name: 'Mini',
    baseFare: 30,
    perKmRate: 8,
    perMinuteRate: 1,
    minFare: 50,
    capacity: 3,
    icon: '🚗',
  },
  {
    id: 'sedan',
    name: 'Sedan',
    baseFare: 50,
    perKmRate: 12,
    perMinuteRate: 1.5,
    minFare: 80,
    capacity: 4,
    icon: '🚙',
  },
  {
    id: 'suv',
    name: 'SUV',
    baseFare: 80,
    perKmRate: 16,
    perMinuteRate: 2,
    minFare: 120,
    capacity: 6,
    icon: '🚐',
  },
  {
    id: 'premium',
    name: 'Premium',
    baseFare: 100,
    perKmRate: 20,
    perMinuteRate: 2.5,
    minFare: 150,
    capacity: 4,
    icon: '✨',
  },
];

@Injectable()
export class FareEstimationService {
  private readonly logger = new Logger(FareEstimationService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Calculate fare for a given distance and duration
   */
  calculateFare(
    vehicleType: string,
    distanceKm: number,
    durationMinutes: number,
    surgeMultiplier: number = 1,
    discountPercentage: number = 0,
    tollCharges: number = 0,
  ): FareBreakdown {
    const vehicle =
      VEHICLE_TYPES.find((v) => v.id === vehicleType) || VEHICLE_TYPES[0];

    const baseFare = vehicle.baseFare;
    const distanceFare = distanceKm * vehicle.perKmRate;
    const timeFare = durationMinutes * vehicle.perMinuteRate;

    const subtotal = baseFare + distanceFare + timeFare + tollCharges;
    const surgeFare = subtotal * (surgeMultiplier - 1);
    const totalBeforeDiscount = subtotal + surgeFare;
    const discount = totalBeforeDiscount * (discountPercentage / 100);

    let totalFare = totalBeforeDiscount - discount;
    totalFare = Math.max(vehicle.minFare, totalFare);

    return {
      baseFare: Math.round(baseFare * 100) / 100,
      distanceFare: Math.round(distanceFare * 100) / 100,
      timeFare: Math.round(timeFare * 100) / 100,
      surgeFare: Math.round(surgeFare * 100) / 100,
      tollCharges: Math.round(tollCharges * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      totalFare: Math.round(totalFare * 100) / 100,
    };
  }

  /**
   * Get fare estimates for all vehicle types
   */
  getAllVehicleFares(
    distanceKm: number,
    durationMinutes: number,
    surgeMultiplier: number = 1,
    discountPercentage: number = 0,
    tollCharges: number = 0,
  ): { vehicle: VehicleType; fare: FareBreakdown }[] {
    return VEHICLE_TYPES.map((vehicle) => ({
      vehicle,
      fare: this.calculateFare(
        vehicle.id,
        distanceKm,
        durationMinutes,
        surgeMultiplier,
        discountPercentage,
        tollCharges,
      ),
    }));
  }

  /**
   * Get route options with fare estimates (mock implementation)
   * In production, this would integrate with Google Maps/Mapbox Directions API
   */
  async getRouteOptions(
    pickup: Coordinates,
    dropoff: Coordinates,
    vehicleType: string = 'sedan',
    discountPercentage: number = 0,
  ): Promise<RouteOption[]> {
    // Calculate straight-line distance (in production, use actual route distance)
    const straightLineDistance = this.haversineDistance(pickup, dropoff);

    // Simulate multiple routes with varying traffic conditions
    const routes: RouteOption[] = [
      {
        id: 'fastest',
        name: 'Fastest Route',
        distance_km: straightLineDistance * 1.2, // Add 20% for roads
        duration_minutes: Math.round(straightLineDistance * 2.5), // ~24 km/h avg
        trafficLevel: 'light',
        tolls: 0,
        fare: this.calculateFare(
          vehicleType,
          straightLineDistance * 1.2,
          Math.round(straightLineDistance * 2.5),
          1,
          discountPercentage,
          0,
        ),
        isRecommended: true,
      },
      {
        id: 'via_highway',
        name: 'Via Highway',
        distance_km: straightLineDistance * 1.5, // Longer but faster
        duration_minutes: Math.round(straightLineDistance * 2), // ~30 km/h avg
        trafficLevel: 'moderate',
        tolls: 25, // Toll charge
        fare: this.calculateFare(
          vehicleType,
          straightLineDistance * 1.5,
          Math.round(straightLineDistance * 2),
          1,
          discountPercentage,
          25,
        ),
        isRecommended: false,
      },
      {
        id: 'avoid_tolls',
        name: 'Avoid Tolls',
        distance_km: straightLineDistance * 1.3,
        duration_minutes: Math.round(straightLineDistance * 3.5), // Slower
        trafficLevel: 'heavy',
        tolls: 0,
        fare: this.calculateFare(
          vehicleType,
          straightLineDistance * 1.3,
          Math.round(straightLineDistance * 3.5),
          1,
          discountPercentage,
          0,
        ),
        isRecommended: false,
      },
    ];

    return routes;
  }

  /**
   * Get current surge multiplier for an area (mock implementation)
   * In production, this would use demand/supply data
   */
  getSurgeMultiplier(location: Coordinates): number {
    // Mock implementation - returns surge based on time of day
    const hour = new Date().getHours();

    // Peak hours: 8-10 AM and 5-8 PM
    if ((hour >= 8 && hour < 10) || (hour >= 17 && hour < 20)) {
      return 1.5; // 50% surge
    }

    // Late night: 11 PM - 5 AM
    if (hour >= 23 || hour < 5) {
      return 1.25; // 25% surge
    }

    return 1; // No surge
  }

  /**
   * Calculate ETA based on traffic (mock implementation)
   */
  getETAWithTraffic(
    distanceKm: number,
    trafficLevel: 'light' | 'moderate' | 'heavy',
  ): number {
    const baseSpeedKmh = 30; // Base speed in city

    const speedMultiplier = {
      light: 1.2,
      moderate: 1,
      heavy: 0.6,
    };

    const adjustedSpeed = baseSpeedKmh * speedMultiplier[trafficLevel];
    return Math.round((distanceKm / adjustedSpeed) * 60); // minutes
  }

  /**
   * Get available vehicle types
   */
  getVehicleTypes(): VehicleType[] {
    return VEHICLE_TYPES;
  }

  /**
   * Get estimated toll charges (placeholder for toll API integration)
   */
  async getTollCharges(
    pickup: Coordinates,
    dropoff: Coordinates,
  ): Promise<number> {
    // In production, integrate with a toll API like TollGuru
    // For now, return a mock estimate based on distance
    const distance = this.haversineDistance(pickup, dropoff);

    // Assume toll if distance > 15 km
    if (distance > 15) {
      return Math.round(distance * 1.5); // ~₹1.5 per km toll estimate
    }

    return 0;
  }

  /**
   * Calculate Haversine distance between two points (in km)
   */
  private haversineDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
