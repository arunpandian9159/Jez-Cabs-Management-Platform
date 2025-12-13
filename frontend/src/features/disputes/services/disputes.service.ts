import { apiClient } from '@/shared/api';

export interface Dispute {
    id: string;
    trip_id: string;
    raised_by: string;
    type: 'fare' | 'behavior' | 'safety' | 'service' | 'other';
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'closed';
    resolution?: string;
    refund_amount?: number;
    created_at: string;
    updated_at: string;
    resolved_at?: string;
    trip?: {
        id: string;
        pickup_address: string;
        destination_address: string;
        actual_fare: number;
        created_at: string;
    };
    raised_by_user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface CreateDisputeDto {
    trip_id: string;
    type: 'fare' | 'behavior' | 'safety' | 'service' | 'other';
    description: string;
}

export interface ResolveDisputeDto {
    resolution: string;
    refund_amount?: number;
}

export interface DisputeFilters {
    status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
    limit?: number;
    offset?: number;
}

export const disputesService = {
    // Create a new dispute
    async create(data: CreateDisputeDto): Promise<Dispute> {
        return apiClient.post<Dispute>('/disputes', data);
    },

    // Get all disputes for the current user
    async findAll(filters?: DisputeFilters): Promise<Dispute[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const query = params.toString();
        return apiClient.get<Dispute[]>(`/disputes${query ? `?${query}` : ''}`);
    },

    // Get a specific dispute by ID
    async findOne(id: string): Promise<Dispute> {
        return apiClient.get<Dispute>(`/disputes/${id}`);
    },

    // Resolve a dispute (admin only)
    async resolve(id: string, data: ResolveDisputeDto): Promise<Dispute> {
        return apiClient.patch<Dispute>(`/disputes/${id}/resolve`, data);
    },

    // Update dispute status
    async updateStatus(id: string, status: 'pending' | 'in_progress' | 'resolved' | 'closed'): Promise<Dispute> {
        return apiClient.patch<Dispute>(`/disputes/${id}/status`, { status });
    },
};

export default disputesService;
