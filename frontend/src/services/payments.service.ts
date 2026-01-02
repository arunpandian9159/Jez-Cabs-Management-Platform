import { apiClient } from '@/shared/api';

export interface Payment {
  id: string;
  trip_id?: string;
  rental_id?: string;
  payer_id: string;
  amount: number;
  payment_method: 'cash' | 'upi' | 'card' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  gateway_response?: Record<string, unknown>;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderDto {
  amount: number; // in paise
  currency?: string;
  trip_id?: string;
  rental_id?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order_id: string;
    amount: number;
    currency: string;
    payment_id: string;
  };
}

export interface VerifyPaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentStats {
  totalPaid: number;
  totalRefunded: number;
  pendingPayments: number;
}

export const paymentsService = {
  /**
   * Create a Razorpay order for payment
   */
  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>('/payments/create-order', dto);
  },

  /**
   * Verify payment after Razorpay checkout completion
   */
  async verifyPayment(
    dto: VerifyPaymentDto
  ): Promise<{ success: boolean; data: Payment }> {
    return apiClient.post<{ success: boolean; data: Payment }>(
      '/payments/verify',
      dto
    );
  },

  /**
   * Create order for wallet top-up
   */
  async createWalletTopup(amount: number): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>('/payments/wallet/topup', {
      amount,
    });
  },

  /**
   * Process a refund
   */
  async processRefund(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; data: Payment }> {
    return apiClient.post<{ success: boolean; data: Payment }>(
      '/payments/refund',
      {
        payment_id: paymentId,
        amount,
        reason,
      }
    );
  },

  /**
   * Get payment history
   */
  async getHistory(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data: Payment[] }> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const query = params.toString();
    return apiClient.get<{ success: boolean; data: Payment[] }>(
      `/payments/history${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get payment statistics
   */
  async getStats(): Promise<{ success: boolean; data: PaymentStats }> {
    return apiClient.get<{ success: boolean; data: PaymentStats }>(
      '/payments/stats'
    );
  },

  /**
   * Get payment by ID
   */
  async getById(id: string): Promise<{ success: boolean; data: Payment }> {
    return apiClient.get<{ success: boolean; data: Payment }>(
      `/payments/${id}`
    );
  },
};

export default paymentsService;
