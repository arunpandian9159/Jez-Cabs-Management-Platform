import { apiClient } from '@/shared/api';

export interface RentalApiResponse {
  id: string;
  customer_id: string;
  cab_id: string;
  start_date: string;
  end_date: string;
  pickup_address: string;
  return_address?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  total_amount: number;
  deposit_amount?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  cab?: {
    id: string;
    registration_number: string;
    make: string;
    model: string;
    color: string;
    cab_type: string;
    images?: string[];
    daily_rate: number;
    features?: string[];
  };
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export interface CabForRental {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  color: string;
  cab_type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van';
  images?: string[];
  daily_rate: number;
  weekly_rate?: number;
  monthly_rate?: number;
  features?: string[];
  rating?: number;
  total_rentals?: number;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    business_name?: string;
    rating?: number;
  };
}

export interface CreateRentalDto {
  cab_id: string;
  start_date: string;
  end_date: string;
  pickup_address: string;
  return_address?: string;
}

export interface RentalFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

export const rentalsService = {
  // Get available cabs for rental
  async getAvailableCabs(filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<CabForRental[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.minPrice)
      params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return apiClient.get<CabForRental[]>(
      `/cabs/available${query ? `?${query}` : ''}`
    );
  },

  // Create a new rental booking
  async create(data: CreateRentalDto): Promise<RentalApiResponse> {
    return apiClient.post<RentalApiResponse>('/rentals', data);
  },

  // Get all rentals for the current user
  async findAll(filters?: RentalFilters): Promise<RentalApiResponse[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return apiClient.get<RentalApiResponse[]>(
      `/rentals${query ? `?${query}` : ''}`
    );
  },

  // Get a specific rental by ID
  async findOne(id: string): Promise<RentalApiResponse> {
    return apiClient.get<RentalApiResponse>(`/rentals/${id}`);
  },

  // Confirm a rental
  async confirm(id: string): Promise<RentalApiResponse> {
    return apiClient.patch<RentalApiResponse>(`/rentals/${id}/confirm`, {});
  },

  // Cancel a rental
  async cancel(id: string): Promise<RentalApiResponse> {
    return apiClient.patch<RentalApiResponse>(`/rentals/${id}/cancel`, {});
  },

  // Get active rentals
  async getActiveRentals(): Promise<RentalApiResponse[]> {
    return this.findAll({ status: 'active' });
  },

  // Get past rentals (completed or cancelled)
  async getPastRentals(): Promise<RentalApiResponse[]> {
    return this.findAll({ status: 'completed' });
  },
};

export default rentalsService;
