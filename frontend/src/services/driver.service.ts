import { apiClient } from '../lib/api';

export interface DriverProfile {
    id: string;
    user_id: string;
    license_number: string;
    license_expiry: string;
    vehicle_type_expertise: string[];
    status: 'pending' | 'verified' | 'rejected' | 'suspended';
    availability_status: 'offline' | 'online' | 'busy';
    current_lat?: number;
    current_lng?: number;
    rating: number;
    total_trips: number;
    total_earnings: number;
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
        return apiClient.get<DriverProfile>('/v1/drivers/profile');
    },

    // Update driver profile
    async updateProfile(data: UpdateProfileDto): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/v1/drivers/profile', data);
    },

    // Get driver dashboard stats
    async getDashboardStats(): Promise<DriverStats> {
        return apiClient.get<DriverStats>('/v1/drivers/stats');
    },

    // Get driver earnings
    async getEarnings(): Promise<DriverEarnings> {
        return apiClient.get<DriverEarnings>('/v1/drivers/earnings');
    },

    // Update driver location
    async updateLocation(lat: number, lng: number): Promise<void> {
        return apiClient.patch('/v1/drivers/location', { lat, lng });
    },

    // Go online (start accepting trips)
    async goOnline(): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/v1/drivers/go-online', {});
    },

    // Go offline (stop accepting trips)
    async goOffline(): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/v1/drivers/go-offline', {});
    },

    // Update availability status
    async updateStatus(status: 'offline' | 'online' | 'busy'): Promise<DriverProfile> {
        return apiClient.patch<DriverProfile>('/v1/drivers/status', { status });
    },

    // Get pending trip requests (usually via WebSocket, but fallback API)
    async getTripRequests(): Promise<TripRequest[]> {
        return apiClient.get<TripRequest[]>('/v1/drivers/trip-requests');
    },

    // Get driver trips history
    async getTripHistory(limit?: number): Promise<import('./trips.service').Trip[]> {
        const params = limit ? `?limit=${limit}` : '';
        return apiClient.get(`/v1/trips${params}`);
    },
};

export default driverService;
