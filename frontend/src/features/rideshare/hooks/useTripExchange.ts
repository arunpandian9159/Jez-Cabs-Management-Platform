import { useState, useEffect, useCallback } from 'react';
import {
  rideshareService,
  CommunityTrip as APICommunityTrip,
} from '@/services';

export interface TripPoster {
  name: string;
  rating: number;
  trips: number;
}

export interface CommunityTripDisplay {
  id: string;
  type: string;
  poster: TripPoster;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  pricePerSeat: number;
  status: string;
  vehicleType: string;
  description: string;
}

export function useTripExchange() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<CommunityTripDisplay | null>(
    null
  );
  const [communityTrips, setCommunityTrips] = useState<CommunityTripDisplay[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunityTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trips = await rideshareService.getCommunityTrips();
      const formatted: CommunityTripDisplay[] = trips.map(
        (trip: APICommunityTrip) => ({
          id: trip.id,
          type: trip.type,
          poster: {
            name: trip.poster.name,
            rating: trip.poster.rating,
            trips: trip.poster.trips,
          },
          from: trip.from,
          to: trip.to,
          date: trip.date,
          time: trip.time,
          seats: trip.seats,
          pricePerSeat: trip.price_per_seat,
          status: trip.status,
          vehicleType: trip.vehicle_type,
          description: trip.description,
        })
      );
      setCommunityTrips(formatted);
    } catch (err) {
      console.error('Error fetching community trips:', err);
      setError('Unable to load community trips. Please try again later.');
      setCommunityTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityTrips();
  }, [fetchCommunityTrips]);

  const filteredTrips = communityTrips.filter((trip) => {
    const matchesSearch =
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.poster.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || trip.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalSeats = communityTrips.reduce((sum, t) => sum + t.seats, 0);
  const avgPricePerSeat =
    communityTrips.length > 0
      ? Math.round(
          communityTrips.reduce((sum, t) => sum + t.pricePerSeat, 0) /
            communityTrips.length
        )
      : 0;

  return {
    activeTab,
    searchQuery,
    showFilters,
    selectedTrip,
    communityTrips,
    filteredTrips,
    isLoading,
    error,
    totalSeats,
    avgPricePerSeat,
    totalTrips: communityTrips.length,
    setActiveTab,
    setSearchQuery,
    setShowFilters: () => setShowFilters(!showFilters),
    setSelectedTrip,
  };
}
