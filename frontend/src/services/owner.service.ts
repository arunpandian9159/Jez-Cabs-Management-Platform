import { apiClient } from '../lib/api';

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
        return apiClient.get<Contract[]>(`/v1/owner/contracts${query ? `?${query}` : ''}`);
    },

    // Get a specific contract
    async getContract(id: string): Promise<Contract> {
        return apiClient.get<Contract>(`/v1/owner/contracts/${id}`);
    },

    // Create a new contract
    async createContract(data: CreateContractDto): Promise<Contract> {
        return apiClient.post<Contract>('/v1/owner/contracts', data);
    },

    // Update a contract
    async updateContract(id: string, data: Partial<CreateContractDto>): Promise<Contract> {
        return apiClient.patch<Contract>(`/v1/owner/contracts/${id}`, data);
    },

    // Renew a contract
    async renewContract(id: string, newEndDate: string): Promise<Contract> {
        return apiClient.patch<Contract>(`/v1/owner/contracts/${id}/renew`, { endDate: newEndDate });
    },

    // Terminate a contract
    async terminateContract(id: string, reason?: string): Promise<Contract> {
        return apiClient.patch<Contract>(`/v1/owner/contracts/${id}/terminate`, { reason });
    },

    // ============= EARNINGS =============

    // Get earnings summary
    async getEarningsSummary(period?: 'week' | 'month' | 'quarter' | 'year'): Promise<EarningsSummary> {
        const params = period ? `?period=${period}` : '';
        return apiClient.get<EarningsSummary>(`/v1/owner/earnings/summary${params}`);
    },

    // Get earnings by cab
    async getEarningsByCab(): Promise<CabEarning[]> {
        return apiClient.get<CabEarning[]>('/v1/owner/earnings/by-cab');
    },

    // Get transactions
    async getTransactions(limit?: number): Promise<OwnerTransaction[]> {
        const params = limit ? `?limit=${limit}` : '';
        return apiClient.get<OwnerTransaction[]>(`/v1/owner/transactions${params}`);
    },

    // Get monthly earnings data
    async getMonthlyEarnings(months?: number): Promise<MonthlyEarning[]> {
        const params = months ? `?months=${months}` : '';
        return apiClient.get<MonthlyEarning[]>(`/v1/owner/earnings/monthly${params}`);
    },

    // ============= DRIVERS =============

    // Get all drivers under owner
    async getDrivers(): Promise<OwnerDriver[]> {
        return apiClient.get<OwnerDriver[]>('/v1/owner/drivers');
    },

    // Get a specific driver
    async getDriver(id: string): Promise<OwnerDriver> {
        return apiClient.get<OwnerDriver>(`/v1/owner/drivers/${id}`);
    },

    // Assign a vehicle to driver
    async assignVehicle(driverId: string, vehicleId: string): Promise<OwnerDriver> {
        return apiClient.patch<OwnerDriver>(`/v1/owner/drivers/${driverId}/assign-vehicle`, { vehicleId });
    },

    // Remove a driver
    async removeDriver(driverId: string): Promise<void> {
        return apiClient.delete(`/v1/owner/drivers/${driverId}`);
    },

    // ============= SETTINGS =============

    // Get business info
    async getBusinessInfo(): Promise<BusinessInfo> {
        return apiClient.get<BusinessInfo>('/v1/owner/business');
    },

    // Update business info
    async updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
        return apiClient.patch<BusinessInfo>('/v1/owner/business', data);
    },

    // Get settings
    async getSettings(): Promise<OwnerSettings> {
        return apiClient.get<OwnerSettings>('/v1/owner/settings');
    },

    // Update settings
    async updateSettings(data: Partial<OwnerSettings>): Promise<OwnerSettings> {
        return apiClient.patch<OwnerSettings>('/v1/owner/settings', data);
    },
};

export default ownerService;
