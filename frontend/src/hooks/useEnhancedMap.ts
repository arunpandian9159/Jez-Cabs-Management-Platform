import { useState, useEffect, useCallback } from 'react';
import {
  mapsService,
  Geofence,
  HeatMapPoint,
  DriverLocation,
  DriverDensity,
  Coordinates,
} from '@/services/maps.service';

export interface UseEnhancedMapOptions {
  location?: Coordinates;
  autoFetchGeofences?: boolean;
  autoFetchNearbyDrivers?: boolean;
  driverRefreshInterval?: number; // ms
}

export function useEnhancedMap(options: UseEnhancedMapOptions = {}) {
  const {
    location,
    autoFetchGeofences = true,
    autoFetchNearbyDrivers = true,
    driverRefreshInterval = 10000, // 10 seconds
  } = options;

  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [nearbyDrivers, setNearbyDrivers] = useState<DriverLocation[]>([]);
  const [heatMapData, setHeatMapData] = useState<HeatMapPoint[]>([]);
  const [driverDensity, setDriverDensity] = useState<DriverDensity | null>(
    null
  );
  const [currentGeofence, setCurrentGeofence] = useState<{
    isInside: boolean;
    geofence: Geofence | null;
    pickupPoints: Geofence['pickupPoints'];
    surgeMultiplier: number;
  } | null>(null);
  const [isLoading, _setIsLoading] = useState(false);
  const [error, _setError] = useState<Error | null>(null);

  // Fetch all geofences
  const fetchGeofences = useCallback(async () => {
    try {
      const response = await mapsService.getAllGeofences();
      if (response.success) {
        setGeofences(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch geofences:', err);
    }
  }, []);

  // Check geofence for current location
  const checkGeofence = useCallback(async (loc: Coordinates) => {
    try {
      const response = await mapsService.checkGeofence(loc);
      if (response.success) {
        setCurrentGeofence({
          isInside: response.data.isInsideGeofence,
          geofence: response.data.geofence,
          pickupPoints: response.data.pickupPoints,
          surgeMultiplier: response.data.surgeMultiplier,
        });
      }
    } catch (err) {
      console.error('Failed to check geofence:', err);
    }
  }, []);

  // Fetch nearby drivers
  const fetchNearbyDrivers = useCallback(
    async (loc: Coordinates, vehicleType?: string) => {
      try {
        const response = await mapsService.getNearbyDrivers(loc, {
          radiusKm: 3,
          vehicleType,
        });
        if (response.success) {
          setNearbyDrivers(response.data.drivers);
        }
      } catch (err) {
        console.error('Failed to fetch nearby drivers:', err);
      }
    },
    []
  );

  // Fetch heat map data
  const fetchHeatMap = useCallback(
    async (bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }) => {
      try {
        const response = await mapsService.getHeatMap(bounds);
        if (response.success) {
          setHeatMapData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch heat map:', err);
      }
    },
    []
  );

  // Fetch driver density
  const fetchDriverDensity = useCallback(async (loc: Coordinates) => {
    try {
      const response = await mapsService.getDriverDensity(loc);
      if (response.success) {
        setDriverDensity(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch driver density:', err);
    }
  }, []);

  // Auto-fetch geofences on mount
  useEffect(() => {
    if (autoFetchGeofences) {
      fetchGeofences();
    }
  }, [autoFetchGeofences, fetchGeofences]);

  // Auto-fetch nearby drivers periodically
  useEffect(() => {
    if (!autoFetchNearbyDrivers || !location) return;

    // Initial fetch
    fetchNearbyDrivers(location);
    checkGeofence(location);

    // Periodic refresh
    const interval = setInterval(() => {
      fetchNearbyDrivers(location);
    }, driverRefreshInterval);

    return () => clearInterval(interval);
  }, [
    location,
    autoFetchNearbyDrivers,
    driverRefreshInterval,
    fetchNearbyDrivers,
    checkGeofence,
  ]);

  return {
    geofences,
    nearbyDrivers,
    heatMapData,
    driverDensity,
    currentGeofence,
    isLoading,
    error,
    fetchGeofences,
    fetchNearbyDrivers,
    fetchHeatMap,
    fetchDriverDensity,
    checkGeofence,
  };
}

export default useEnhancedMap;
