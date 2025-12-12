import { apiClient } from '../lib/api';

export interface Cab {
    id: string;
    owner_id: string;
    driver_id?: string;
    registration_number: string;
    make: string;
    model: string;
    year: number;
    color: string;
    cab_type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van' | 'auto';
    status: 'available' | 'busy' | 'maintenance' | 'inactive';
    seat_capacity: number;
    fuel_type: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
    images?: string[];
    features?: string[];
    current_lat?: number;
    current_lng?: number;
    daily_rate?: number;
    base_fare?: number;
    per_km_rate?: number;
    rating?: number;
    total_trips?: number;
    created_at: string;
    updated_at: string;
    owner?: {
        id: string;
        first_name: string;
        last_name: string;
        business_name?: string;
    };
    driver?: {
        id: string;
        first_name: string;
        last_name: string;
        phone: string;
        rating?: number;
    };
}

export interface CabPriceEstimate {
    cab_type: string;
    display_name: string;
    base_fare: number;
    per_km_rate: number;
    estimated_fare: number;
    eta_minutes: number;
}

export interface CreateCabDto {
    registration_number: string;
    make: string;
    model: string;
    year: number;
    color: string;
    cab_type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van' | 'auto';
    seat_capacity: number;
    fuel_type: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
    images?: string[];
    features?: string[];
    daily_rate?: number;
    base_fare?: number;
    per_km_rate?: number;
}

export interface UpdateCabDto {
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    seat_capacity?: number;
    fuel_type?: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
    images?: string[];
    features?: string[];
    daily_rate?: number;
    base_fare?: number;
    per_km_rate?: number;
}

export interface CabFilters {
    type?: string;
    status?: string;
    owner_id?: string;
    limit?: number;
    offset?: number;
}

// Paginated response type
export interface PaginatedCabsResponse {
    data: Cab[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Statistics response type
export interface CabStatistics {
    total: number;
    available: number;
    onTrip: number;
    maintenance: number;
}

export const cabsService = {
    // Create a new cab
    async create(data: CreateCabDto): Promise<Cab> {
        return apiClient.post<Cab>('/cabs', data);
    },

    // Get all cabs (with filters) - returns paginated response
    async findAll(filters?: CabFilters): Promise<PaginatedCabsResponse> {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.owner_id) params.append('owner_id', filters.owner_id);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const query = params.toString();
        return apiClient.get<PaginatedCabsResponse>(`/cabs${query ? `?${query}` : ''}`);
    },

    // Get a specific cab by ID
    async findOne(id: string): Promise<Cab> {
        return apiClient.get<Cab>(`/cabs/${id}`);
    },

    // Get available cabs near a location
    async findAvailable(lat?: number, lng?: number, cabType?: string): Promise<Cab[]> {
        const params = new URLSearchParams();
        if (lat) params.append('lat', lat.toString());
        if (lng) params.append('lng', lng.toString());
        if (cabType) params.append('type', cabType);

        const query = params.toString();
        return apiClient.get<Cab[]>(`/cabs/available${query ? `?${query}` : ''}`);
    },

    // Update a cab
    async update(id: string, data: UpdateCabDto): Promise<Cab> {
        return apiClient.patch<Cab>(`/cabs/${id}`, data);
    },

    // Update cab status
    async updateStatus(id: string, status: 'available' | 'busy' | 'maintenance' | 'inactive'): Promise<Cab> {
        return apiClient.patch<Cab>(`/cabs/${id}/status`, { status });
    },

    // Assign driver to cab
    async assignDriver(cabId: string, driverId: string): Promise<Cab> {
        return apiClient.patch<Cab>(`/cabs/${cabId}/assign-driver`, { driver_id: driverId });
    },

    // Delete a cab
    async delete(id: string): Promise<void> {
        return apiClient.delete(`/cabs/${id}`);
    },

    // Get cab statistics (for cab owners)
    async getStatistics(): Promise<CabStatistics> {
        return apiClient.get<CabStatistics>('/cabs/statistics');
    },

    // Get price estimates for a route
    async getPriceEstimates(
        pickupLat: number,
        pickupLng: number,
        destLat: number,
        destLng: number
    ): Promise<CabPriceEstimate[]> {
        const params = new URLSearchParams({
            pickup_lat: pickupLat.toString(),
            pickup_lng: pickupLng.toString(),
            dest_lat: destLat.toString(),
            dest_lng: destLng.toString(),
        });
        return apiClient.get<CabPriceEstimate[]>(`/cabs/price-estimates?${params}`);
    },
};

export default cabsService;
