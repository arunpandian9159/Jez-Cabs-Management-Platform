import { useState, useEffect, useCallback } from 'react';
import { driverService } from '@/services';

export interface EarningsSummaryDisplay {
    today: number;
    week: number;
    month: number;
    pendingPayout: number;
    lastPayout: number;
    lastPayoutDate: string;
}

export interface TransactionDisplay {
    id: string;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}

export interface DayBreakdownDisplay {
    day: string;
    earnings: number;
    trips: number;
}

export function useDriverEarnings() {
    const [activeTab, setActiveTab] = useState('overview');
    const [earningsSummary, setEarningsSummary] = useState<EarningsSummaryDisplay>({
        today: 0,
        week: 0,
        month: 0,
        pendingPayout: 0,
        lastPayout: 0,
        lastPayoutDate: '',
    });
    const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
    const [weeklyBreakdown, setWeeklyBreakdown] = useState<DayBreakdownDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEarningsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const earnings = await driverService.getEarnings();

            setEarningsSummary({
                today: Number(earnings.today) || 0,
                week: Number(earnings.thisWeek) || 0,
                month: Number(earnings.thisMonth) || 0,
                pendingPayout: 0,
                lastPayout: 0,
                lastPayoutDate: '',
            });

            const formattedTxns: TransactionDisplay[] = (earnings.transactions || []).map(t => ({
                id: t.id,
                type: t.type,
                description: t.description,
                amount: t.amount,
                date: t.created_at,
                status: 'completed',
            }));
            setTransactions(formattedTxns);

            const formattedBreakdown: DayBreakdownDisplay[] = (earnings.weeklyBreakdown || []).map(d => ({
                day: d.day,
                earnings: Number(d.earnings) || 0,
                trips: Number(d.trips) || 0,
            }));
            setWeeklyBreakdown(formattedBreakdown);
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEarningsData();
    }, [fetchEarningsData]);

    const maxEarning = Math.max(...weeklyBreakdown.map((d) => d.earnings), 1);
    const totalWeeklyTrips = weeklyBreakdown.reduce((acc, d) => acc + d.trips, 0);
    const avgPerTrip = totalWeeklyTrips > 0 ? earningsSummary.week / totalWeeklyTrips : 0;
    const avgPerDay = earningsSummary.week / 7;
    const bestDay = weeklyBreakdown.length > 0
        ? weeklyBreakdown.reduce((max, day) => day.earnings > max.earnings ? day : max)
        : null;

    return {
        // State
        activeTab,
        earningsSummary,
        transactions,
        weeklyBreakdown,
        isLoading,
        // Computed
        maxEarning,
        totalWeeklyTrips,
        avgPerTrip,
        avgPerDay,
        bestDay,
        // Actions
        setActiveTab,
    };
}
