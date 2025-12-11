import { apiClient } from '../lib/api';

export interface SavedAddress {
    id: string;
    user_id: string;
    label: string;
    address: string;
    lat: number;
    lng: number;
    icon?: string;
    is_default?: boolean;
    created_at: string;
    updated_at: string;
}

export interface RecentDestination {
    id: string;
    address: string;
    lat: number;
    lng: number;
    used_at: string;
}

export interface PaymentMethod {
    id: string;
    user_id: string;
    type: 'card' | 'upi' | 'wallet' | 'netbanking';
    display_name: string;
    last_four?: string;
    upi_id?: string;
    is_default: boolean;
    expires_at?: string;
    created_at: string;
}

export interface WalletInfo {
    balance: number;
    currency: string;
    last_updated: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    type: 'payment' | 'refund' | 'topup' | 'withdrawal';
    amount: number;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    payment_method?: string;
    trip_id?: string;
    created_at: string;
}

export interface CreateAddressDto {
    label: string;
    address: string;
    lat: number;
    lng: number;
    icon?: string;
    is_default?: boolean;
}

export interface UpdateAddressDto {
    label?: string;
    address?: string;
    lat?: number;
    lng?: number;
    icon?: string;
    is_default?: boolean;
}

export const usersService = {
    // Get saved addresses
    async getSavedAddresses(): Promise<SavedAddress[]> {
        return apiClient.get<SavedAddress[]>('/v1/users/addresses');
    },

    // Create a new saved address
    async createAddress(data: CreateAddressDto): Promise<SavedAddress> {
        return apiClient.post<SavedAddress>('/v1/users/addresses', data);
    },

    // Update a saved address
    async updateAddress(id: string, data: UpdateAddressDto): Promise<SavedAddress> {
        return apiClient.patch<SavedAddress>(`/v1/users/addresses/${id}`, data);
    },

    // Delete a saved address
    async deleteAddress(id: string): Promise<void> {
        return apiClient.delete(`/v1/users/addresses/${id}`);
    },

    // Get recent destinations
    async getRecentDestinations(limit?: number): Promise<RecentDestination[]> {
        const params = limit ? `?limit=${limit}` : '';
        return apiClient.get<RecentDestination[]>(`/v1/users/recent-destinations${params}`);
    },

    // Get payment methods
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        return apiClient.get<PaymentMethod[]>('/v1/users/payment-methods');
    },

    // Add a payment method
    async addPaymentMethod(data: {
        type: 'card' | 'upi' | 'wallet' | 'netbanking';
        token?: string;
        upi_id?: string;
        is_default?: boolean;
    }): Promise<PaymentMethod> {
        return apiClient.post<PaymentMethod>('/v1/users/payment-methods', data);
    },

    // Remove a payment method
    async removePaymentMethod(id: string): Promise<void> {
        return apiClient.delete(`/v1/users/payment-methods/${id}`);
    },

    // Set default payment method
    async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
        return apiClient.patch<PaymentMethod>(`/v1/users/payment-methods/${id}/default`, {});
    },

    // Get wallet balance
    async getWalletBalance(): Promise<WalletInfo> {
        return apiClient.get<WalletInfo>('/v1/users/wallet');
    },

    // Get transaction history
    async getTransactions(limit?: number): Promise<Transaction[]> {
        const params = limit ? `?limit=${limit}` : '';
        return apiClient.get<Transaction[]>(`/v1/users/transactions${params}`);
    },
};

export default usersService;
