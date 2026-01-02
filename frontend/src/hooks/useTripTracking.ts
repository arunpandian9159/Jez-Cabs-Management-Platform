import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';

interface DriverLocation {
  driverId: string;
  tripId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

interface TripStatusUpdate {
  tripId: string;
  status: string;
  message?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: {
    make: string;
    model: string;
    color: string;
    registration: string;
  };
}

interface UseTripTrackingOptions {
  tripId: string;
  enabled?: boolean;
}

export function useTripTracking({
  tripId,
  enabled = true,
}: UseTripTrackingOptions) {
  const { isConnected, emit, on, off } = useSocket({ autoConnect: enabled });

  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    null
  );
  const [tripStatus, setTripStatus] = useState<TripStatusUpdate | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Join trip room
  const joinTrip = useCallback(() => {
    if (isConnected && tripId) {
      emit('trip:join', { tripId });
      setIsJoined(true);
    }
  }, [isConnected, tripId, emit]);

  // Leave trip room
  const leaveTrip = useCallback(() => {
    if (isConnected && tripId) {
      emit('trip:leave', { tripId });
      setIsJoined(false);
    }
  }, [isConnected, tripId, emit]);

  // Listen for updates when connected
  useEffect(() => {
    if (!isConnected || !enabled) return;

    // Join the trip room
    joinTrip();

    // Handle driver location updates
    const handleLocationUpdate = (data: DriverLocation) => {
      if (data.tripId === tripId) {
        setDriverLocation(data);
      }
    };

    // Handle trip status updates
    const handleStatusUpdate = (data: TripStatusUpdate) => {
      if (data.tripId === tripId) {
        setTripStatus(data);
      }
    };

    // Handle driver assigned
    const handleDriverAssigned = (data: {
      tripId: string;
      driver: DriverInfo;
    }) => {
      if (data.tripId === tripId) {
        setDriverInfo(data.driver);
      }
    };

    on('driver:location:update', handleLocationUpdate);
    on('trip:status:update', handleStatusUpdate);
    on('trip:driver:assigned', handleDriverAssigned);

    return () => {
      off('driver:location:update', handleLocationUpdate);
      off('trip:status:update', handleStatusUpdate);
      off('trip:driver:assigned', handleDriverAssigned);
      leaveTrip();
    };
  }, [isConnected, tripId, enabled, on, off, joinTrip, leaveTrip]);

  return {
    isConnected,
    isJoined,
    driverLocation,
    tripStatus,
    driverInfo,
    joinTrip,
    leaveTrip,
  };
}

export default useTripTracking;
