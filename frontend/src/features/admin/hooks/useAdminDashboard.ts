import { useState, useEffect, useCallback } from 'react';
import { Users, Car, DollarSign, AlertTriangle } from 'lucide-react';
import { tripsService, disputesService, adminService } from '@/services';
import { formatCurrency } from '@/shared/utils';

export interface DashboardStatDisplay {
  label: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  icon: typeof Users;
  color: string;
}

export interface RecentTripDisplay {
  id: string;
  customer: string;
  driver: string;
  fare: number;
  status: string;
  time: string;
}

export interface PendingVerificationDisplay {
  id: string;
  name: string;
  type: string;
  document: string;
  submitted: string;
}

export interface RecentDisputeDisplay {
  id: string;
  customer: string;
  issue: string;
  priority: string;
  status: string;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStatDisplay[]>([]);
  const [recentTrips, setRecentTrips] = useState<RecentTripDisplay[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerificationDisplay[]>([]);
  const [recentDisputes, setRecentDisputes] = useState<RecentDisputeDisplay[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard stats from the backend (revenue calculated from completed payments)
      const dashboardStats = await adminService.getDashboardStats();

      const trips = await tripsService.findAll({ limit: 5 });
      const formattedTrips: RecentTripDisplay[] = trips.map((t) => ({
        id: t.id,
        customer: t.customer
          ? `${t.customer.first_name} ${t.customer.last_name}`
          : 'Customer',
        driver: t.driver
          ? `${t.driver.first_name} ${t.driver.last_name}`
          : 'Unassigned',
        fare: t.actual_fare || t.estimated_fare,
        status: t.status,
        time: new Date(t.created_at).toLocaleTimeString(),
      }));
      setRecentTrips(formattedTrips);

      const disputes = await disputesService.findAll();
      const formattedDisputes: RecentDisputeDisplay[] = disputes
        .slice(0, 3)
        .map((d) => ({
          id: d.id,
          customer: d.raisedByUser
            ? `${d.raisedByUser.first_name} ${d.raisedByUser.last_name}`
            : 'User',
          issue: d.description?.substring(0, 50) || d.type || 'Issue',
          priority: d.priority || 'medium',
          status: d.status,
        }));
      setRecentDisputes(formattedDisputes);

      // Fetch pending verifications
      const verifications = await adminService.getVerifications({ status: 'pending', limit: 5 });
      const formattedVerifications: PendingVerificationDisplay[] = verifications.map((v) => ({
        id: v.id,
        name: v.applicant.name,
        type: v.type === 'driver' ? 'Driver' : 'Cab Owner',
        document: v.documentType,
        submitted: new Date(v.submittedAt).toLocaleDateString(),
      }));
      setPendingVerifications(formattedVerifications);

      // Use stats from backend API (revenue is calculated from completed payments in payments table)
      setStats([
        {
          label: 'Total Users',
          value: dashboardStats.totalUsers.toString(),
          change: '+12%',
          trending: 'up',
          icon: Users,
          color: 'primary',
        },
        {
          label: 'Total Trips',
          value: dashboardStats.totalTrips.toString(),
          change: '+8%',
          trending: 'up',
          icon: Car,
          color: 'success',
        },
        {
          label: 'Revenue',
          value: formatCurrency(dashboardStats.totalRevenue),
          change: '+15%',
          trending: 'up',
          icon: DollarSign,
          color: 'accent',
        },
        {
          label: 'Disputes',
          value: dashboardStats.totalDisputes.toString(),
          change: '-5%',
          trending: 'down',
          icon: AlertTriangle,
          color: 'error',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentTrips,
    pendingVerifications,
    recentDisputes,
    isLoading,
  };
}
