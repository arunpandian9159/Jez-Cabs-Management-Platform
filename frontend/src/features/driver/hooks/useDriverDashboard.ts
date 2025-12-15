import { useState, useEffect, useCallback } from 'react';
import { driverService, tripsService } from '@/services';
import type { VerificationStatusResponse } from '@/services/driver.service';

// Types for driver dashboard
export interface DriverStatsDisplay {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalTrips: number;
  rating: number;
  acceptanceRate: number;
  completionRate: number;
  onlineHours: number;
}

export interface TripRequestDisplay {
  id: string;
  pickup: string;
  destination: string;
  distance: number;
  estimatedFare: number;
  estimatedTime: number;
  customerName: string;
  customerRating: number;
  tripType: string;
  expiresIn: number;
}

export interface RecentTripDisplay {
  id: string;
  pickup: string;
  destination: string;
  fare: number;
  distance: number;
  time: string;
  rating: number | null;
  status: string;
}

export function useDriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [driverStats, setDriverStats] = useState<DriverStatsDisplay>({
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalTrips: 0,
    rating: 0,
    acceptanceRate: 0,
    completionRate: 0,
    onlineHours: 0,
  });
  const [pendingRequests, setPendingRequests] = useState<TripRequestDisplay[]>(
    []
  );
  const [recentTrips, setRecentTrips] = useState<RecentTripDisplay[]>([]);
  const [showTripRequest, setShowTripRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verification status
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatusResponse | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch driver profile to get online status
      const profile = await driverService.getProfile();

      // Check if onboarding is required
      if ('onboarding_required' in profile && profile.onboarding_required) {
        setOnboardingRequired(true);
        setIsLoading(false);
        return;
      }

      setIsOnline(profile.is_online || false);

      // Fetch verification status
      const verificationResponse = await driverService.getVerificationStatus();
      setVerificationStatus(verificationResponse);
      setIsVerified(verificationResponse.verified);

      // Only fetch full dashboard data if verified
      if (verificationResponse.verified) {
        // Fetch driver stats
        const stats = await driverService.getDashboardStats();
        setDriverStats(stats);

        // Fetch recent trips
        const trips = await tripsService.findAll({ limit: 3 });
        const formattedTrips: RecentTripDisplay[] = trips.map((trip) => ({
          id: trip.id,
          pickup: trip.pickup_address,
          destination: trip.destination_address,
          fare: trip.actual_fare || trip.estimated_fare,
          distance: trip.distance_km,
          time: new Date(trip.created_at).toLocaleString(),
          rating: trip.customer_rating || null,
          status: trip.status,
        }));
        setRecentTrips(formattedTrips);

        // Fetch pending trip requests
        const requests = await driverService.getTripRequests();
        setPendingRequests(requests);
        setShowTripRequest(requests.length > 0);
      }
    } catch (err: any) {
      console.error('Error fetching driver dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleOnline = async () => {
    // Don't allow going online if not verified
    if (!isVerified) {
      return;
    }

    try {
      if (isOnline) {
        await driverService.goOffline();
      } else {
        await driverService.goOnline();
      }
      setIsOnline(!isOnline);
    } catch (error) {
      console.error('Error toggling online status:', error);
    }
  };

  const currentRequest = pendingRequests[0];

  return {
    // State
    isOnline,
    driverStats,
    pendingRequests,
    recentTrips,
    showTripRequest,
    isLoading,
    error,
    currentRequest,
    // Verification
    verificationStatus,
    isVerified,
    onboardingRequired,
    // Actions
    setShowTripRequest,
    handleToggleOnline,
  };
}
