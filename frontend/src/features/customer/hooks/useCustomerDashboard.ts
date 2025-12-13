import { useState, useEffect, useCallback } from 'react';
import { tripsService, usersService } from '@/services';

export interface RecentTripDisplay {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  fare: number;
  status: string;
  driverName: string;
  driverRating: number;
  cabType: string;
  distance: string;
  duration?: string;
}

export interface DashboardStats {
  totalTrips: number;
  completedTrips: number;
  totalSpent: number;
  totalDistance: number;
}

export interface SavedAddressDisplay {
  id: string;
  label: string;
  address: string;
  icon: string;
  color: string;
}

const defaultAddresses: SavedAddressDisplay[] = [
  {
    id: '1',
    label: 'Home',
    address: 'Add your home address',
    icon: '🏠',
    color: 'bg-blue-100',
  },
  {
    id: '2',
    label: 'Work',
    address: 'Add your work address',
    icon: '💼',
    color: 'bg-green-100',
  },
];

export function useCustomerDashboard() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [recentTrips, setRecentTrips] = useState<RecentTripDisplay[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressDisplay[]>(
    []
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    completedTrips: 0,
    totalSpent: 0,
    totalDistance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const currentHour = new Date().getHours();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allTrips = await tripsService.findAll();
      const completedTrips = allTrips.filter((t) => t.status === 'completed');
      const totalSpent = completedTrips.reduce(
        (acc, t) =>
          acc + (Number(t.actual_fare) || Number(t.estimated_fare) || 0),
        0
      );
      const totalDistance = completedTrips.reduce(
        (acc, t) => acc + (Number(t.distance_km) || 0),
        0
      );
      setStats({
        totalTrips: allTrips.length,
        completedTrips: completedTrips.length,
        totalSpent,
        totalDistance,
      });

      const recentCompleted = completedTrips.slice(0, 3);
      const formattedTrips: RecentTripDisplay[] = recentCompleted.map(
        (trip) => ({
          id: trip.id,
          pickup: trip.pickup_address,
          destination: trip.destination_address,
          date: trip.created_at,
          fare: Number(trip.actual_fare) || Number(trip.estimated_fare) || 0,
          status: trip.status,
          driverName: trip.driver
            ? `${trip.driver.first_name} ${trip.driver.last_name}`
            : 'Driver',
          driverRating: trip.driver?.rating || 4.5,
          cabType: trip.cab?.cab_type || 'Sedan',
          distance: `${trip.distance_km} km`,
        })
      );
      setRecentTrips(formattedTrips);
    } catch (error) {
      console.warn('Could not fetch trips:', error);
      setRecentTrips([]);
    }

    try {
      const addresses = await usersService.getSavedAddresses();
      const formattedAddresses: SavedAddressDisplay[] = addresses.map(
        (addr) => ({
          id: addr.id,
          label: addr.label,
          address: addr.address,
          icon: addr.icon || '📍',
          color: 'bg-gray-100',
        })
      );
      setSavedAddresses(formattedAddresses);
    } catch (error) {
      console.warn('Could not fetch saved addresses:', error);
      setSavedAddresses(defaultAddresses);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return {
    hoveredAction,
    recentTrips,
    savedAddresses,
    stats,
    isLoading,
    setHoveredAction,
    getGreeting,
  };
}
