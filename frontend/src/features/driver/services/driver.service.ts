import { apiClient } from '../lib/api';

export interface DriverProfile {
    id: string;
    user_id: string;
    license_number: string;
    license_expiry: string;
    license_type?: string;
    date_of_birth?: string;
    address?: string;
    vehicle_type_expertise: string[];
    status: 'pending' | 'verified' | 'rejected' | 'suspended';
    availability_status: 'offline' | 'online' | 'busy';
    is_online: boolean;
    current_lat?: number;
    current_lng?: number;
    rating: number;
    total_trips: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        avatar?: string;
    };
}

export interface DriverStats {
    todayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    totalTrips: number;
    rating: number;
    acceptanceRate: number;
    completionRate: number;
    onlineHours: number;
}

export interface DriverEarnings {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    transactions: EarningTransaction[];
    weeklyBreakdown: WeeklyEarning[];
}

export interface EarningTransaction {
    id: string;
    amount: number;
    type: 'trip' | 'bonus' | 'deduction' | 'payout';
    description: string;
    created_at: string;
}

export interface WeeklyEarning {
    day: string;
    earnings: number;
    trips: number;
}

export interface TripRequest {
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

export interface UpdateProfileDto {
    license_number?: string;
    license_expiry?: string;
    vehicle_type_expertise?: string[];
}

export const driverService = {
    // Get driver profile
    async getProfile(): Promise<DriverProfile> {
        return apiClient.get<DriverProfile>('/drivers/profile');
    },

    // Update driver profile
    async updateProfile(data: UpdateProfileDto): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/drivers/profile', data);
    },

    // Get driver dashboard stats
    async getDashboardStats(): Promise<DriverStats> {
        return apiClient.get<DriverStats>('/drivers/stats');
    },

    // Get driver earnings
    async getEarnings(): Promise<DriverEarnings> {
        return apiClient.get<DriverEarnings>('/drivers/earnings');
    },

    // Update driver location
    async updateLocation(lat: number, lng: number): Promise<void> {
        return apiClient.patch('/drivers/location', { lat, lng });
    },

    // Go online (start accepting trips)
    async goOnline(): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/drivers/go-online', {});
    },

    // Go offline (stop accepting trips)
    async goOffline(): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/drivers/go-offline', {});
    },

    // Update availability status
    async updateStatus(status: 'offline' | 'online' | 'busy'): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/drivers/status', { status });
    },

    // Get pending trip requests (usually via WebSocket, but fallback API)
    async getTripRequests(): Promise<TripRequest[]> {
        return apiClient.get<TripRequest[]>('/drivers/trip-requests');
    },

    // Get driver trips history
    async getTripHistory(limit?: number): Promise<import('./trips.service').Trip[]> {
        const params = limit ? `?limit=${limit}` : '';
        return apiClient.get(`/trips${params}`);
    },
};

export default driverService;
