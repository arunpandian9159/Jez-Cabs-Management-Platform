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
    case 'in_progress':
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
      lat: Number(apiTrip.pickup_lat),
      lng: Number(apiTrip.pickup_lng),
    },
    destination: {
      address: apiTrip.dropoff_address,
      lat: Number(apiTrip.dropoff_lat),
      lng: Number(apiTrip.dropoff_lng),
    },
    fare: Number(apiTrip.estimated_fare) || 0,
    distance: Number(apiTrip.distance_km) || 0,
    estimatedTime: Number(apiTrip.estimated_duration_minutes) || 10,
    paymentMethod: 'Cash',
    driverLocation: {
      lat: Number(apiTrip.pickup_lat),
      lng: Number(apiTrip.pickup_lng),
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
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);

  const fetchActiveTrip = useCallback(async () => {
    try {
      setIsLoading(true);
      // First check for trips that are in progress
      const trips = await tripsService.findAll({ status: 'in_progress' });
      if (trips.length > 0) {
        const transformed = transformTrip(trips[0]);
        if (isValidTrip(transformed)) {
          setTrip(transformed);
        } else {
          setTrip(null);
        }
      } else {
        // Then check for accepted trips
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
  const statusConfig = trip ? tripStatuses[trip.status] : null;

  // Fetch route from OSRM when trip coordinates change
  useEffect(() => {
    if (!trip) {
      setRouteCoords([]);
      setRouteDistance(null);
      setRouteDuration(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        // OSRM expects coordinates in lng,lat format (opposite of Leaflet)
        const coordinates = [
          `${driverLng},${driverLat}`,
          `${trip.pickup.lng},${trip.pickup.lat}`,
          `${trip.destination.lng},${trip.destination.lat}`,
        ].join(';');

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch route');
        }

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          // OSRM returns coordinates as [lng, lat], but Leaflet expects [lat, lng]
          const routeGeometry = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRouteCoords(routeGeometry);

          // OSRM returns distance in meters and duration in seconds
          setRouteDistance(Math.round(route.distance / 1000 * 10) / 10); // Convert to km with 1 decimal
          setRouteDuration(Math.round(route.duration / 60)); // Convert to minutes
        } else {
          // Fallback to straight line if no route found
          setRouteCoords([
            [driverLat, driverLng],
            [trip.pickup.lat, trip.pickup.lng],
            [trip.destination.lat, trip.destination.lng],
          ]);
          setRouteDistance(null);
          setRouteDuration(null);
        }
      } catch (error) {
        console.error('Error fetching route from OSRM:', error);
        // Fallback to straight line on error
        setRouteCoords([
          [driverLat, driverLng],
          [trip.pickup.lat, trip.pickup.lng],
          [trip.destination.lat, trip.destination.lng],
        ]);
        setRouteDistance(null);
        setRouteDuration(null);
      }
    };

    fetchRoute();
  }, [trip, driverLat, driverLng]);

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
    routeDistance,
    routeDuration,
    statusConfig,
    // Actions
    setShowCancelModal,
    setCancelReason,
    advanceStatus,
    handleCancelTrip,
    goToDashboard,
  };
}
