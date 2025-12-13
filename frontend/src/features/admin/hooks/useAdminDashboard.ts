import { useState, useEffect, useCallback } from 'react';
import { Users, Car, DollarSign, AlertTriangle } from 'lucide-react';
import { tripsService, disputesService } from '@/services';
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
    const [pendingVerifications] = useState<PendingVerificationDisplay[]>([]);
    const [recentDisputes, setRecentDisputes] = useState<RecentDisputeDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);

            const trips = await tripsService.findAll({ limit: 5 });
            const formattedTrips: RecentTripDisplay[] = trips.map(t => ({
                id: t.id,
                customer: t.customer ? `${t.customer.first_name} ${t.customer.last_name}` : 'Customer',
                driver: t.driver ? `${t.driver.first_name} ${t.driver.last_name}` : 'Unassigned',
                fare: t.actual_fare || t.estimated_fare,
                status: t.status,
                time: new Date(t.created_at).toLocaleTimeString(),
            }));
            setRecentTrips(formattedTrips);

            const disputes = await disputesService.findAll();
            const formattedDisputes: RecentDisputeDisplay[] = disputes.slice(0, 3).map(d => ({
                id: d.id,
                customer: d.raised_by_user ? `${d.raised_by_user.first_name} ${d.raised_by_user.last_name}` : 'User',
                issue: d.description?.substring(0, 50) || d.type,
                priority: 'medium',
                status: d.status,
            }));
            setRecentDisputes(formattedDisputes);

            setStats([
                { label: 'Total Users', value: trips.length.toString(), change: '+12%', trending: 'up', icon: Users, color: 'primary' },
                { label: 'Total Trips', value: trips.length.toString(), change: '+8%', trending: 'up', icon: Car, color: 'success' },
                { label: 'Revenue', value: formatCurrency(trips.reduce((sum, t) => sum + (t.actual_fare || t.estimated_fare), 0)), change: '+15%', trending: 'up', icon: DollarSign, color: 'accent' },
                { label: 'Disputes', value: disputes.length.toString(), change: '-5%', trending: 'down', icon: AlertTriangle, color: 'error' },
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
