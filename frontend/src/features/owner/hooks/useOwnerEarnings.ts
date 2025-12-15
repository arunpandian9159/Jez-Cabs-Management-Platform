import { useState, useEffect, useCallback } from 'react';
import {
  ownerService,
  type EarningsSummary,
  type CabEarning,
  type OwnerTransaction,
  type MonthlyEarning,
  type DriverEarning,
  type Expense,
  type CreateExpenseDto,
  type EarningsGoal,
  type CreateGoalDto,
  type EarningsInsight,
  type DateRange,
} from '@/services/owner.service';

// Mock data for features not yet implemented in backend
const mockDriverEarnings: DriverEarning[] = [
  {
    id: '1',
    driverName: 'Rajesh Kumar',
    driverPhone: '9876543210',
    avatar: null,
    vehicleAssigned: 'Toyota Innova (KA-01-AB-1234)',
    totalEarnings: 125000,
    thisMonthEarnings: 28500,
    lastMonthEarnings: 25000,
    trips: 156,
    commission: 4275,
    commissionRate: 15,
    growth: 14,
  },
  {
    id: '2',
    driverName: 'Suresh Singh',
    driverPhone: '9876543211',
    avatar: null,
    vehicleAssigned: 'Maruti Swift (KA-01-CD-5678)',
    totalEarnings: 98000,
    thisMonthEarnings: 22000,
    lastMonthEarnings: 24000,
    trips: 142,
    commission: 3300,
    commissionRate: 15,
    growth: -8,
  },
  {
    id: '3',
    driverName: 'Mahesh Patel',
    driverPhone: '9876543212',
    avatar: null,
    vehicleAssigned: 'Hyundai Creta (KA-01-EF-9012)',
    totalEarnings: 145000,
    thisMonthEarnings: 32000,
    lastMonthEarnings: 28000,
    trips: 178,
    commission: 4800,
    commissionRate: 15,
    growth: 14,
  },
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'fuel',
    description: 'Fuel for Toyota Innova',
    amount: 5000,
    date: new Date().toISOString(),
    vehicleId: '1',
    vehicleName: 'Toyota Innova',
  },
  {
    id: '2',
    category: 'maintenance',
    description: 'Regular service',
    amount: 3500,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    vehicleId: '2',
    vehicleName: 'Maruti Swift',
  },
  {
    id: '3',
    category: 'insurance',
    description: 'Annual insurance renewal',
    amount: 15000,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    vehicleId: '1',
    vehicleName: 'Toyota Innova',
  },
];

const mockGoals: EarningsGoal[] = [
  {
    id: '1',
    type: 'monthly',
    targetAmount: 100000,
    currentAmount: 75000,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    progress: 75,
    status: 'on_track',
  },
  {
    id: '2',
    type: 'yearly',
    targetAmount: 1200000,
    currentAmount: 850000,
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    progress: 71,
    status: 'ahead',
  },
];

const mockInsights: EarningsInsight[] = [
  {
    id: '1',
    type: 'growth',
    title: 'Strong Monthly Growth',
    description: 'Your fleet earnings grew 12% compared to last month. Toyota Innova is your top performer.',
    percentageChange: 12,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Milestone Reached!',
    description: 'Congratulations! Your fleet has completed 1000 trips this quarter.',
    value: 1000,
    date: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Optimize Driver Schedule',
    description: 'Consider adding more drivers during peak hours (8-10 AM) to maximize earnings.',
    date: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'warning',
    title: 'Expense Increase',
    description: 'Fuel expenses have increased by 15% this month. Consider route optimization.',
    percentageChange: 15,
    date: new Date().toISOString(),
  },
];

export function useOwnerEarnings() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null);

  // Main earnings state
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

  // New feature states
  const [driverEarnings, setDriverEarnings] = useState<DriverEarning[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<EarningsGoal[]>([]);
  const [insights, setInsights] = useState<EarningsInsight[]>([]);

  // Expense form state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState<CreateExpenseDto>({
    category: 'fuel',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  // Goal form state
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState<CreateGoalDto>({
    type: 'monthly',
    targetAmount: 0,
  });
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Loading and error
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

      // Load mock data for new features (replace with real API calls when backend is ready)
      setDriverEarnings(mockDriverEarnings);
      setExpenses(mockExpenses);
      setGoals(mockGoals);
      setInsights(mockInsights);
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

  // Add expense
  const handleAddExpense = useCallback(async () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      setExpenseError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingExpense(true);
      setExpenseError(null);

      // Mock: Add to local state (replace with API call)
      const createdExpense: Expense = {
        id: Date.now().toString(),
        ...newExpense,
      };
      setExpenses(prev => [createdExpense, ...prev]);
      setShowAddExpenseModal(false);
      setNewExpense({
        category: 'fuel',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setExpenseError('Failed to add expense. Please try again.');
    } finally {
      setIsCreatingExpense(false);
    }
  }, [newExpense]);

  // Delete expense
  const handleDeleteExpense = useCallback(async (id: string) => {
    try {
      // Mock: Remove from local state (replace with API call)
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  }, []);

  // Add goal
  const handleAddGoal = useCallback(async () => {
    if (newGoal.targetAmount <= 0) {
      setGoalError('Please enter a valid target amount');
      return;
    }

    try {
      setIsCreatingGoal(true);
      setGoalError(null);

      // Mock: Add to local state (replace with API call)
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (newGoal.type) {
        case 'daily':
          startDate = now;
          endDate = now;
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          endDate = new Date(now.setDate(now.getDate() + 6));
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
      }

      const createdGoal: EarningsGoal = {
        id: Date.now().toString(),
        ...newGoal,
        currentAmount: 0,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        progress: 0,
        status: 'on_track',
      };
      setGoals(prev => [...prev, createdGoal]);
      setShowAddGoalModal(false);
      setNewGoal({ type: 'monthly', targetAmount: 0 });
    } catch (err) {
      setGoalError('Failed to add goal. Please try again.');
    } finally {
      setIsCreatingGoal(false);
    }
  }, [newGoal]);

  // Delete goal
  const handleDeleteGoal = useCallback(async (id: string) => {
    try {
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  }, []);

  // Export data
  const handleExport = useCallback(async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setIsExporting(true);
      setExportError(null);

      // Calculate date range based on filter
      const now = new Date();
      let start: Date;
      let end = now;

      switch (dateFilter) {
        case 'week':
          start = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Generate CSV content
      if (format === 'csv') {
        const headers = ['Date', 'Description', 'Type', 'Amount'];
        const rows = transactions.map(tx => [
          tx.date,
          tx.description,
          tx.type,
          tx.amount.toString()
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnings-report-${dateFilter}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For PDF/Excel, show a message (would need backend support)
        alert(`${format.toUpperCase()} export will be available soon!`);
      }
    } catch (err) {
      setExportError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [dateFilter, transactions]);

  // Update expense form field
  const updateNewExpense = useCallback(<K extends keyof CreateExpenseDto>(
    field: K,
    value: CreateExpenseDto[K]
  ) => {
    setNewExpense(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update goal form field
  const updateNewGoal = useCallback(<K extends keyof CreateGoalDto>(
    field: K,
    value: CreateGoalDto[K]
  ) => {
    setNewGoal(prev => ({ ...prev, [field]: value }));
  }, []);

  const maxEarning =
    monthlyData.length > 0
      ? Math.max(...monthlyData.map((d) => d.earnings))
      : 0;

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDriverCommissions = driverEarnings.reduce((sum, d) => sum + d.commission, 0);
  const netProfit = earningsSummary.netEarnings - totalExpenses;

  return {
    // State
    activeTab,
    dateFilter,
    customDateRange,
    earningsSummary,
    cabEarnings,
    transactions,
    monthlyData,
    maxEarning,
    isLoading,
    error,

    // New feature states
    driverEarnings,
    expenses,
    goals,
    insights,
    totalExpenses,
    totalDriverCommissions,
    netProfit,

    // Expense modal
    showAddExpenseModal,
    newExpense,
    isCreatingExpense,
    expenseError,

    // Goal modal
    showAddGoalModal,
    newGoal,
    isCreatingGoal,
    goalError,

    // Export
    isExporting,
    exportError,

    // Actions
    setActiveTab,
    setDateFilter,
    setCustomDateRange,
    setShowAddExpenseModal,
    setShowAddGoalModal,
    updateNewExpense,
    updateNewGoal,
    handleAddExpense,
    handleDeleteExpense,
    handleAddGoal,
    handleDeleteGoal,
    handleExport,
    refreshData: fetchEarningsData,
  };
}
