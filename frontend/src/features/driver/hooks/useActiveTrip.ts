import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsService, type Trip } from '@/services/trips.service';

// Trip display type for UI
export interface CurrentTrip {
  id: string;
  status: 'heading_to_pickup' | 'at_pickup' | 'in_progress' | 'arriving';
  customer: {
    name: string;
    phone: string;
    rating: number;
    totalTrips: number;
  };
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  fare: number;
  distance: number;
  estimatedTime: number;
  paymentMethod: string;
  driverLocation: {
    lat: number;
    lng: number;
  };
}

export const tripStatuses = {
  heading_to_pickup: {
    label: 'Heading to Pickup',
    color: 'primary',
    action: 'Arrived at Pickup',
  },
  at_pickup: {
    label: 'At Pickup Location',
    color: 'warning',
    action: 'Start Trip',
  },
  in_progress: {
    label: 'Trip in Progress',
    color: 'success',
    action: 'Complete Trip',
  },
  arriving: {
    label: 'Arriving at Destination',
    color: 'accent',
    action: 'End Trip',
  },
} as const;

// Map API trip status to UI status
function mapTripStatus(apiStatus: Trip['status']): CurrentTrip['status'] {
  switch (apiStatus) {
    case 'accepted':
      return 'heading_to_pickup';
    case 'started':
      return 'in_progress';
    case 'pending':
    case 'completed':
    case 'cancelled':
    default:
      return 'in_progress';
  }
}

// Transform API trip to UI trip
function transformTrip(apiTrip: Trip): CurrentTrip {
  return {
    id: apiTrip.id,
    status: mapTripStatus(apiTrip.status),
    customer: {
      name: apiTrip.customer
        ? `${apiTrip.customer.first_name} ${apiTrip.customer.last_name}`
        : 'Customer',
      phone: apiTrip.customer?.phone || '',
      rating: 4.5,
      totalTrips: 0,
    },
    pickup: {
      address: apiTrip.pickup_address,
      lat: apiTrip.pickup_lat,
      lng: apiTrip.pickup_lng,
    },
    destination: {
      address: apiTrip.destination_address,
      lat: apiTrip.destination_lat,
      lng: apiTrip.destination_lng,
    },
    fare: apiTrip.estimated_fare,
    distance: apiTrip.distance_km,
    estimatedTime: apiTrip.estimated_duration_minutes,
    paymentMethod: 'Cash',
    driverLocation: {
      lat: apiTrip.pickup_lat,
      lng: apiTrip.pickup_lng,
    },
  };
}

// Helper to validate if trip has valid coordinates
function isValidTrip(tripData: CurrentTrip): boolean {
  return (
    typeof tripData.pickup?.lat === 'number' &&
    !isNaN(tripData.pickup.lat) &&
    typeof tripData.pickup?.lng === 'number' &&
    !isNaN(tripData.pickup.lng) &&
    typeof tripData.destination?.lat === 'number' &&
    !isNaN(tripData.destination.lat) &&
    typeof tripData.destination?.lng === 'number' &&
    !isNaN(tripData.destination.lng)
  );
}

export function useActiveTrip() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<CurrentTrip | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchActiveTrip = useCallback(async () => {
    try {
      setIsLoading(true);
      const trips = await tripsService.findAll({ status: 'started' });
      if (trips.length > 0) {
        const transformed = transformTrip(trips[0]);
        if (isValidTrip(transformed)) {
          setTrip(transformed);
        } else {
          setTrip(null);
        }
      } else {
        const acceptedTrips = await tripsService.findAll({
          status: 'accepted',
        });
        if (acceptedTrips.length > 0) {
          const transformed = transformTrip(acceptedTrips[0]);
          if (isValidTrip(transformed)) {
            setTrip(transformed);
          } else {
            setTrip(null);
          }
        } else {
          setTrip(null);
        }
      }
    } catch (error) {
      console.error('Error fetching active trip:', error);
      setTrip(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveTrip();
  }, [fetchActiveTrip]);

  const advanceStatus = async () => {
    if (!trip) return;
    const statusOrder: CurrentTrip['status'][] = [
      'heading_to_pickup',
      'at_pickup',
      'in_progress',
      'arriving',
    ];
    const currentIndex = statusOrder.indexOf(trip.status);

    try {
      setIsProcessing(true);

      if (trip.status === 'at_pickup') {
        await tripsService.start(trip.id, '0000');
        setTrip({ ...trip, status: 'in_progress' });
      } else if (trip.status === 'arriving' || trip.status === 'in_progress') {
        await tripsService.complete(trip.id, trip.fare);
        navigate('/driver/trip-complete');
      } else if (currentIndex < statusOrder.length - 1) {
        setTrip({ ...trip, status: statusOrder[currentIndex + 1] });
      }
    } catch (error) {
      console.error('Error advancing trip status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelTrip = async (reason: string) => {
    if (!trip) return;
    try {
      setIsProcessing(true);
      setCancelReason(reason);
      await tripsService.cancel(trip.id, reason);
      setShowCancelModal(false);
      navigate('/driver');
    } catch (error) {
      console.error('Error cancelling trip:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToDashboard = () => navigate('/driver');

  // Computed values
  const driverLat = trip?.driverLocation?.lat ?? trip?.pickup.lat ?? 0;
  const driverLng = trip?.driverLocation?.lng ?? trip?.pickup.lng ?? 0;
  const routeCoords: [number, number][] = trip
    ? [
        [driverLat, driverLng],
        [trip.pickup.lat, trip.pickup.lng],
        [trip.destination.lat, trip.destination.lng],
      ]
    : [];
  const statusConfig = trip ? tripStatuses[trip.status] : null;

  return {
    // State
    trip,
    showCancelModal,
    isLoading,
    isProcessing,
    cancelReason,
    // Computed
    driverLat,
    driverLng,
    routeCoords,
    statusConfig,
    // Actions
    setShowCancelModal,
    setCancelReason,
    advanceStatus,
    handleCancelTrip,
    goToDashboard,
  };
}
