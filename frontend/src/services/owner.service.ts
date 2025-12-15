import { apiClient } from '@/shared/api';

// Types for owner contracts
export interface Contract {
  id: string;
  type: 'driver' | 'platform' | 'insurance';
  title: string;
  partyName: string;
  vehicleAssigned: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired' | 'pending';
  commission?: number;
  monthlyTarget?: number;
  premium?: number;
  documents: string[];
}

export interface ContractFilters {
  type?: 'driver' | 'platform' | 'insurance';
  status?: 'active' | 'expiring' | 'expired' | 'pending';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateContractDto {
  type: 'driver' | 'platform' | 'insurance';
  title: string;
  partyName: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
  commission?: number;
  monthlyTarget?: number;
  premium?: number;
}

// Types for owner earnings
export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  totalRevenue: number;
  pendingSettlements: number;
  platformFee: number;
  netEarnings: number;
}

export interface CabEarning {
  id: string;
  vehicle: string;
  registration: string;
  driver: string;
  thisMonth: number;
  lastMonth: number;
  trips: number;
  growth: number;
}

export interface OwnerTransaction {
  id: string;
  type: 'earning' | 'payout' | 'settlement' | 'deduction';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
}

// Driver earnings breakdown
export interface DriverEarning {
  id: string;
  driverName: string;
  driverPhone: string;
  avatar: string | null;
  vehicleAssigned: string | null;
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  trips: number;
  commission: number;
  commissionRate: number;
  growth: number;
}

// Expense tracking
export interface Expense {
  id: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'taxes' | 'toll' | 'other';
  description: string;
  amount: number;
  date: string;
  vehicleId?: string;
  vehicleName?: string;
  receipt?: string;
}

export interface CreateExpenseDto {
  category: 'fuel' | 'maintenance' | 'insurance' | 'taxes' | 'toll' | 'other';
  description: string;
  amount: number;
  date: string;
  vehicleId?: string;
  receipt?: string;
}

// Earnings goals
export interface EarningsGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on_track' | 'behind' | 'ahead' | 'completed';
}

export interface CreateGoalDto {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  targetAmount: number;
}

// Earnings insights/analytics
export interface EarningsInsight {
  id: string;
  type: 'growth' | 'decline' | 'milestone' | 'recommendation' | 'warning';
  title: string;
  description: string;
  value?: number;
  percentageChange?: number;
  date: string;
}

// Export options
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  includeTransactions?: boolean;
  includeCabBreakdown?: boolean;
  includeDriverBreakdown?: boolean;
  includeExpenses?: boolean;
}

// Custom date range
export interface DateRange {
  start: string;
  end: string;
}

// Types for owner drivers
export interface OwnerDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string | null;
  status: 'active' | 'inactive' | 'pending';
  cab: {
    make: string;
    model: string;
    registrationNumber: string;
  } | null;
  metrics: {
    totalTrips: number;
    rating: number;
    acceptanceRate: number;
    completionRate: number;
    thisMonthEarnings: number;
    totalEarnings: number;
  };
  joinedDate: string;
  lastActive: string | null;
}

// Types for owner business settings
export interface BusinessInfo {
  name: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
}

export interface OwnerSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  driverAlerts: boolean;
  maintenanceReminders: boolean;
  paymentAlerts: boolean;
  autoSettlement: boolean;
  language: string;
}

export const ownerService = {
  // ============= CONTRACTS =============

  // Get all contracts
  async getContracts(filters?: ContractFilters): Promise<Contract[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return apiClient.get<Contract[]>(
      `/owner/contracts${query ? `?${query}` : ''}`
    );
  },

  // Get a specific contract
  async getContract(id: string): Promise<Contract> {
    return apiClient.get<Contract>(`/owner/contracts/${id}`);
  },

  // Create a new contract
  async createContract(data: CreateContractDto): Promise<Contract> {
    return apiClient.post<Contract>('/owner/contracts', data);
  },

  // Update a contract
  async updateContract(
    id: string,
    data: Partial<CreateContractDto>
  ): Promise<Contract> {
    return apiClient.patch<Contract>(`/owner/contracts/${id}`, data);
  },

  // Renew a contract
  async renewContract(id: string, newEndDate: string): Promise<Contract> {
    return apiClient.patch<Contract>(`/owner/contracts/${id}/renew`, {
      endDate: newEndDate,
    });
  },

  // Terminate a contract
  async terminateContract(id: string, reason?: string): Promise<Contract> {
    return apiClient.patch<Contract>(`/owner/contracts/${id}/terminate`, {
      reason,
    });
  },

  // ============= EARNINGS =============

  // Get earnings summary
  async getEarningsSummary(
    period?: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<EarningsSummary> {
    const params = period ? `?period=${period}` : '';
    return apiClient.get<EarningsSummary>(`/owner/earnings/summary${params}`);
  },

  // Get earnings by cab
  async getEarningsByCab(): Promise<CabEarning[]> {
    return apiClient.get<CabEarning[]>('/owner/earnings/by-cab');
  },

  // Get transactions
  async getTransactions(limit?: number): Promise<OwnerTransaction[]> {
    const params = limit ? `?limit=${limit}` : '';
    return apiClient.get<OwnerTransaction[]>(`/owner/transactions${params}`);
  },

  // Get monthly earnings data
  async getMonthlyEarnings(months?: number): Promise<MonthlyEarning[]> {
    const params = months ? `?months=${months}` : '';
    return apiClient.get<MonthlyEarning[]>(`/owner/earnings/monthly${params}`);
  },

  // Get earnings by driver
  async getEarningsByDriver(): Promise<DriverEarning[]> {
    return apiClient.get<DriverEarning[]>('/owner/earnings/by-driver');
  },

  // Get earnings with custom date range
  async getEarningsWithDateRange(dateRange: DateRange): Promise<EarningsSummary> {
    return apiClient.get<EarningsSummary>(
      `/owner/earnings/summary?start=${dateRange.start}&end=${dateRange.end}`
    );
  },

  // ============= EXPENSES =============

  // Get all expenses
  async getExpenses(filters?: {
    category?: string;
    vehicleId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return apiClient.get<Expense[]>(`/owner/expenses${query ? `?${query}` : ''}`);
  },

  // Create expense
  async createExpense(data: CreateExpenseDto): Promise<Expense> {
    return apiClient.post<Expense>('/owner/expenses', data);
  },

  // Update expense
  async updateExpense(id: string, data: Partial<CreateExpenseDto>): Promise<Expense> {
    return apiClient.patch<Expense>(`/owner/expenses/${id}`, data);
  },

  // Delete expense
  async deleteExpense(id: string): Promise<void> {
    return apiClient.delete(`/owner/expenses/${id}`);
  },

  // Get expense summary
  async getExpenseSummary(period?: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    total: number;
    byCategory: { category: string; amount: number }[];
    byVehicle: { vehicleId: string; vehicleName: string; amount: number }[];
  }> {
    const params = period ? `?period=${period}` : '';
    return apiClient.get(`/owner/expenses/summary${params}`);
  },

  // ============= GOALS =============

  // Get earnings goals
  async getGoals(): Promise<EarningsGoal[]> {
    return apiClient.get<EarningsGoal[]>('/owner/goals');
  },

  // Create goal
  async createGoal(data: CreateGoalDto): Promise<EarningsGoal> {
    return apiClient.post<EarningsGoal>('/owner/goals', data);
  },

  // Update goal
  async updateGoal(id: string, data: Partial<CreateGoalDto>): Promise<EarningsGoal> {
    return apiClient.patch<EarningsGoal>(`/owner/goals/${id}`, data);
  },

  // Delete goal
  async deleteGoal(id: string): Promise<void> {
    return apiClient.delete(`/owner/goals/${id}`);
  },

  // ============= INSIGHTS =============

  // Get earnings insights
  async getInsights(): Promise<EarningsInsight[]> {
    return apiClient.get<EarningsInsight[]>('/owner/earnings/insights');
  },

  // ============= EXPORT =============

  // Export earnings data
  async exportEarnings(options: ExportOptions): Promise<Blob> {
    const response = await apiClient.post<Blob>('/owner/earnings/export', options, {
      responseType: 'blob'
    });
    return response;
  },

  // Generate earnings report
  async generateReport(period: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    reportUrl: string;
    generatedAt: string;
  }> {
    return apiClient.post(`/owner/earnings/report`, { period });
  },

  // ============= DRIVERS =============

  // Get all drivers under owner
  async getDrivers(): Promise<OwnerDriver[]> {
    return apiClient.get<OwnerDriver[]>('/owner/drivers');
  },

  // Get a specific driver
  async getDriver(id: string): Promise<OwnerDriver> {
    return apiClient.get<OwnerDriver>(`/owner/drivers/${id}`);
  },

  // Assign a vehicle to driver
  async assignVehicle(
    driverId: string,
    vehicleId: string
  ): Promise<OwnerDriver> {
    return apiClient.patch<OwnerDriver>(
      `/owner/drivers/${driverId}/assign-vehicle`,
      { vehicleId }
    );
  },

  // Remove a driver
  async removeDriver(driverId: string): Promise<void> {
    return apiClient.delete(`/owner/drivers/${driverId}`);
  },

  // Invite a new driver
  async inviteDriver(data: {
    name: string;
    phone: string;
    email: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      '/owner/drivers/invite',
      data
    );
  },

  // ============= SETTINGS =============

  // Get business info
  async getBusinessInfo(): Promise<BusinessInfo> {
    return apiClient.get<BusinessInfo>('/owner/business');
  },

  // Update business info
  async updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
    return apiClient.patch<BusinessInfo>('/owner/business', data);
  },

  // Get settings
  async getSettings(): Promise<OwnerSettings> {
    return apiClient.get<OwnerSettings>('/owner/settings');
  },

  // Update settings
  async updateSettings(data: Partial<OwnerSettings>): Promise<OwnerSettings> {
    return apiClient.patch<OwnerSettings>('/owner/settings', data);
  },
};

export default ownerService;
