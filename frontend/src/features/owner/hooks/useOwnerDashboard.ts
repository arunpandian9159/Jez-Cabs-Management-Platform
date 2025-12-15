import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cabsService, type Cab } from '@/services';
import { ownerService } from '@/services/owner.service';

// Types for owner dashboard display
export interface OwnerStatsDisplay {
  totalCabs: number;
  activeCabs: number;
  totalDrivers: number;
  activeDrivers: number;
  monthlyRevenue: number;
  pendingPayments: number;
  avgRating: number;
}

export interface CabDriverDisplay {
  name: string;
  rating: number;
  trips: number;
}

export interface CabDisplay {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  status: string;
  driver: CabDriverDisplay | null;
  todayEarnings: number;
  rating: number;
}

export function useOwnerDashboard() {
  const [ownerStats, setOwnerStats] = useState<OwnerStatsDisplay>({
    totalCabs: 0,
    activeCabs: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    avgRating: 0,
  });
  const [cabs, setCabs] = useState<CabDisplay[]>([]);
  const [todaysEarnings, setTodaysEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [cabStats, cabsResponse, drivers, earningsSummary] = await Promise.all([
          cabsService.getStatistics(),
          cabsService.findAll(),
          ownerService.getDrivers().catch(() => []),
          ownerService.getEarningsSummary('month').catch(() => ({
            today: 0,
            week: 0,
            month: 0,
            totalRevenue: 0,
            pendingSettlements: 0,
            platformFee: 0,
            netEarnings: 0,
          })),
        ]);

        // Calculate driver stats
        const totalDrivers = drivers.length;
        const activeDrivers = drivers.filter(d => d.status === 'active').length;

        // Calculate average rating from drivers
        const avgRating = drivers.length > 0
          ? drivers.reduce((sum, d) => sum + (d.metrics?.rating || 0), 0) / drivers.length
          : 0;

        setOwnerStats({
          totalCabs: cabStats.total || 0,
          activeCabs: (cabStats.available || 0) + (cabStats.onTrip || 0),
          totalDrivers,
          activeDrivers,
          monthlyRevenue: earningsSummary.month || 0,
          pendingPayments: earningsSummary.pendingSettlements || 0,
          avgRating: Number(avgRating.toFixed(1)) || 0,
        });

        // Set today's earnings from earnings summary
        setTodaysEarnings(earningsSummary.today || 0);

        // Format cabs list
        const cabsArray = Array.isArray(cabsResponse)
          ? cabsResponse
          : cabsResponse.data || [];
        const formattedCabs: CabDisplay[] = cabsArray.map((c: Cab) => {
          // Check both driver and assigned_driver for compatibility
          const driverData = c.driver || c.assigned_driver;
          // Look up driver's total_trips from driver_profile via the drivers array
          const driverProfile = driverData
            ? drivers.find(d => d.id === driverData.id)
            : null;
          const driverTotalTrips = driverProfile?.metrics?.totalTrips || 0;
          return {
            id: c.id,
            make: c.make,
            model: c.model,
            registrationNumber: c.registration_number,
            status: c.status,
            driver: driverData
              ? {
                name: `${driverData.first_name} ${driverData.last_name}`,
                rating: driverProfile?.metrics?.rating || driverData.rating || 4.5,
                trips: driverTotalTrips,
              }
              : null,
            todayEarnings: 0,
            rating: c.rating || 4.5,
          };
        });
        setCabs(formattedCabs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddNewCab = () => {
    navigate('/owner/cabs');
  };

  const activeCabsCount = cabs.filter((c) => c.status === 'active').length;

  return {
    ownerStats,
    cabs,
    isLoading,
    todaysEarnings,
    activeCabsCount,
    handleAddNewCab,
  };
}
