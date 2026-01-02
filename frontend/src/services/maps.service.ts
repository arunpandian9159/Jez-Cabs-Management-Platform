import { apiClient } from '@/shared/api';

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
  radius: number;
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

export interface HeatMapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface DriverLocation {
  location: Coordinates;
  vehicleType: string;
}

export interface DriverDensity {
  total: number;
  available: number;
  byVehicleType: Record<string, number>;
}

export const mapsService = {
  /**
   * Get all active geofences
   */
  async getAllGeofences(): Promise<{ success: boolean; data: Geofence[] }> {
    return apiClient.get<{ success: boolean; data: Geofence[] }>(
      '/maps/geofences'
    );
  },

  /**
   * Get geofences near a location
   */
  async getNearbyGeofences(
    location: Coordinates,
    radiusKm?: number
  ): Promise<{ success: boolean; data: Geofence[] }> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });
    if (radiusKm) params.append('radius', radiusKm.toString());

    return apiClient.get<{ success: boolean; data: Geofence[] }>(
      `/maps/geofences/nearby?${params}`
    );
  },

  /**
   * Check if a location is within a geofence
   */
  async checkGeofence(location: Coordinates): Promise<{
    success: boolean;
    data: {
      isInsideGeofence: boolean;
      geofence: Geofence | null;
      pickupPoints: Geofence['pickupPoints'];
      surgeMultiplier: number;
    };
  }> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });

    return apiClient.get(`/maps/geofences/check?${params}`);
  },

  /**
   * Get nearby available drivers
   */
  async getNearbyDrivers(
    location: Coordinates,
    options?: { radiusKm?: number; vehicleType?: string }
  ): Promise<{
    success: boolean;
    data: {
      count: number;
      drivers: DriverLocation[];
    };
  }> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });
    if (options?.radiusKm) params.append('radius', options.radiusKm.toString());
    if (options?.vehicleType) params.append('vehicleType', options.vehicleType);

    return apiClient.get(`/maps/drivers/nearby?${params}`);
  },

  /**
   * Get heat map data for driver availability
   */
  async getHeatMap(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<{ success: boolean; data: HeatMapPoint[] }> {
    const params = new URLSearchParams({
      north: bounds.north.toString(),
      south: bounds.south.toString(),
      east: bounds.east.toString(),
      west: bounds.west.toString(),
    });

    return apiClient.get<{ success: boolean; data: HeatMapPoint[] }>(
      `/maps/heatmap?${params}`
    );
  },

  /**
   * Get driver density for an area
   */
  async getDriverDensity(
    location: Coordinates,
    radiusKm?: number
  ): Promise<{ success: boolean; data: DriverDensity }> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });
    if (radiusKm) params.append('radius', radiusKm.toString());

    return apiClient.get<{ success: boolean; data: DriverDensity }>(
      `/maps/density?${params}`
    );
  },
};

export default mapsService;
