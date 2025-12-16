import { apiClient } from '@/shared/api';

export interface Trip {
  id: string;
  customer_id: string;
  driver_id?: string;
  cab_id?: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  status: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  estimated_fare: number;
  actual_fare?: number;
  distance_km: number;
  estimated_duration_minutes: number;
  otp?: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  customer_rating?: number;
  driver_rating?: number;
  customer_feedback?: string;
  driver_feedback?: string;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar?: string;
  };
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar?: string;
    rating?: number;
  };
  cab?: {
    id: string;
    registration_number: string;
    make: string;
    model: string;
    color: string;
    cab_type: string;
  };
}

export interface CreateTripDto {
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  cab_type?: string;
  scheduled_at?: string;
}

export interface TripFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

export const tripsService = {
  // Create a new trip request
  async create(data: CreateTripDto): Promise<Trip> {
    return apiClient.post<Trip>('/trips', data);
  },

  // Get all trips for the current user
  async findAll(filters?: TripFilters): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return apiClient.get<Trip[]>(`/trips${query ? `?${query}` : ''}`);
  },

  // Get a specific trip by ID
  async findOne(id: string): Promise<Trip> {
    return apiClient.get<Trip>(`/trips/${id}`);
  },

  // Driver accepts a trip request
  async accept(tripId: string, cabId: string): Promise<Trip> {
    return apiClient.patch<Trip>(`/trips/${tripId}/accept`, { cab_id: cabId });
  },

  // Start the trip (driver verifies OTP)
  async start(tripId: string, otp: string): Promise<Trip> {
    return apiClient.patch<Trip>(`/trips/${tripId}/start`, { otp });
  },

  // Complete the trip
  async complete(tripId: string, actualFare: number): Promise<Trip> {
    return apiClient.patch<Trip>(`/trips/${tripId}/complete`, {
      actual_fare: actualFare,
    });
  },

  // Cancel a trip
  async cancel(tripId: string, reason: string): Promise<Trip> {
    return apiClient.patch<Trip>(`/trips/${tripId}/cancel`, { reason });
  },

  // Rate a trip
  async rate(tripId: string, rating: number, feedback?: string): Promise<Trip> {
    return apiClient.post<Trip>(`/trips/${tripId}/rate`, { rating, feedback });
  },

  // Get recent trips (for dashboard)
  async getRecent(limit: number = 3): Promise<Trip[]> {
    return this.findAll({ status: 'completed', limit });
  },
};

export default tripsService;
