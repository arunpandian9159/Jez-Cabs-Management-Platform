import { useState, useEffect, useCallback } from 'react';
import {
  ownerService,
  type EarningsSummary,
  type CabEarning,
  type OwnerTransaction,
  type MonthlyEarning,
} from '@/services/owner.service';

export function useOwnerEarnings() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('month');

  // API state
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>({
    today: 0,
    week: 0,
    month: 0,
    totalRevenue: 0,
    pendingSettlements: 0,
    platformFee: 0,
    netEarnings: 0,
  });
  const [cabEarnings, setCabEarnings] = useState<CabEarning[]>([]);
  const [transactions, setTransactions] = useState<OwnerTransaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarningsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const period = dateFilter as 'week' | 'month' | 'quarter' | 'year';
      const [summary, byCab, txns, monthly] = await Promise.all([
        ownerService.getEarningsSummary(period),
        ownerService.getEarningsByCab(),
        ownerService.getTransactions(),
        ownerService.getMonthlyEarnings(6),
      ]);
      setEarningsSummary(summary);
      setCabEarnings(byCab);
      setTransactions(txns);
      setMonthlyData(monthly);
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError('Failed to load earnings data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const maxEarning =
    monthlyData.length > 0
      ? Math.max(...monthlyData.map((d) => d.earnings))
      : 0;

  return {
    // State
    activeTab,
    dateFilter,
    earningsSummary,
    cabEarnings,
    transactions,
    monthlyData,
    maxEarning,
    isLoading,
    error,
    // Actions
    setActiveTab,
    setDateFilter,
  };
}
