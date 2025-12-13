import { apiClient } from '@/shared/api';

// Community Trips / Rideshare Types
export interface TripPoster {
    id: string;
    name: string;
    rating: number;
    trips: number;
    avatar?: string;
}

export interface CommunityTrip {
    id: string;
    type: 'share' | 'request'; // 'share' = offering ride, 'request' = looking for ride
    poster: TripPoster;
    from: string;
    to: string;
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
    date: string;
    time: string;
    seats: number;
    price_per_seat: number;
    status: 'active' | 'filled' | 'cancelled' | 'completed';
    vehicle_type: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCommunityTripDto {
    type: 'share' | 'request';
    from: string;
    to: string;
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
    date: string;
    time: string;
    seats: number;
    price_per_seat: number;
    vehicle_type?: string;
    description?: string;
}

// Shared Contact Types
export interface SharedContact {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    timestamp: string;
    via: 'whatsapp' | 'sms' | 'link' | 'email';
}

export interface ShareTripDto {
    method: 'whatsapp' | 'sms' | 'link' | 'email';
    contact_id?: string;
    phone?: string;
    email?: string;
}

// Active Trip Types (for sharing)
export interface ActiveTripForShare {
    id: string;
    driver: {
        id: string;
        name: string;
        phone: string;
        rating: number;
        vehicle_number: string;
        vehicle_model: string;
        avatar?: string;
    };
    from: string;
    to: string;
    estimated_arrival: string;
    status: string;
    share_link: string;
}

// Exchange History Types
export interface ExchangeHistoryItem {
    id: string;
    type: 'booked' | 'hosted';
    status: 'completed' | 'cancelled' | 'upcoming';
    trip: {
        id: string;
        from: string;
        to: string;
        date: string;
        time: string;
    };
    host?: {
        id: string;
        name: string;
        rating: number;
    };
    passengers?: Array<{
        id: string;
        name: string;
        rating: number;
    }>;
    price?: number;
    earnings?: number;
    seats_booked?: number;
    seats_offered?: number;
    seats_filled?: number;
    rating?: number;
    cancel_reason?: string;
    created_at: string;
}

export const rideshareService = {
    // ==================== Community Trips ====================

    // Get all available community trips
    async getCommunityTrips(filters?: {
        type?: 'share' | 'request';
        from?: string;
        to?: string;
        date?: string;
    }): Promise<CommunityTrip[]> {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.from) params.append('from', filters.from);
        if (filters?.to) params.append('to', filters.to);
        if (filters?.date) params.append('date', filters.date);

        const query = params.toString();
        return apiClient.get<CommunityTrip[]>(
            `/community-trips${query ? `?${query}` : ''}`
        );
    },

    // Get a specific community trip
    async getCommunityTrip(id: string): Promise<CommunityTrip> {
        return apiClient.get<CommunityTrip>(`/community-trips/${id}`);
    },

    // Create a new community trip
    async createCommunityTrip(data: CreateCommunityTripDto): Promise<CommunityTrip> {
        return apiClient.post<CommunityTrip>('/community-trips', data);
    },

    // Book a seat on a community trip
    async bookSeat(tripId: string, seats: number = 1): Promise<{ booking_id: string }> {
        return apiClient.post<{ booking_id: string }>(
            `/community-trips/${tripId}/book`,
            { seats }
        );
    },

    // Cancel community trip booking
    async cancelBooking(tripId: string, reason?: string): Promise<void> {
        return apiClient.delete<void>(`/community-trips/${tripId}/book`, {
            data: { reason },
        });
    },

    // ==================== Trip Sharing ====================

    // Get active trip for sharing
    async getActiveTrip(): Promise<ActiveTripForShare | null> {
        try {
            return await apiClient.get<ActiveTripForShare>('/trips/active');
        } catch {
            // No active trip
            return null;
        }
    },

    // Get contacts the trip has been shared with
    async getSharedContacts(tripId: string): Promise<SharedContact[]> {
        return apiClient.get<SharedContact[]>(`/trips/${tripId}/shares`);
    },

    // Share trip with a contact
    async shareTrip(tripId: string, data: ShareTripDto): Promise<SharedContact> {
        return apiClient.post<SharedContact>(`/trips/${tripId}/share`, data);
    },

    // Get shareable link for a trip
    async getShareLink(tripId: string): Promise<{ link: string }> {
        return apiClient.get<{ link: string }>(`/trips/${tripId}/share-link`);
    },

    // ==================== Exchange History ====================

    // Get exchange history (ridesharing history)
    async getExchangeHistory(filters?: {
        type?: 'booked' | 'hosted';
        status?: 'completed' | 'cancelled' | 'upcoming';
        limit?: number;
        offset?: number;
    }): Promise<ExchangeHistoryItem[]> {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const query = params.toString();
        return apiClient.get<ExchangeHistoryItem[]>(
            `/exchanges${query ? `?${query}` : ''}`
        );
    },

    // Get exchange statistics
    async getExchangeStats(): Promise<{
        total_earnings: number;
        total_saved: number;
        trips_hosted: number;
        trips_booked: number;
    }> {
        return apiClient.get('/exchanges/stats');
    },

    // Rate an exchange/rideshare experience
    async rateExchange(
        exchangeId: string,
        rating: number,
        feedback?: string
    ): Promise<void> {
        return apiClient.post(`/exchanges/${exchangeId}/rate`, {
            rating,
            feedback,
        });
    },
};

export default rideshareService;
