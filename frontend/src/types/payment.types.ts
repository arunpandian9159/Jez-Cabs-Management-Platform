// Payment method types
export type PaymentMethodType =
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'wallet'
  | 'cash';

// Payment status
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'cancelled';

// Transaction type
export type TransactionType =
  | 'trip_payment'
  | 'rental_payment'
  | 'rental_advance'
  | 'rental_final'
  | 'refund'
  | 'driver_withdrawal'
  | 'owner_settlement'
  | 'platform_fee'
  | 'cancellation_charge';

// Saved payment method
export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  // Card specific
  cardLast4?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'rupay';
  cardExpiry?: string;
  // UPI specific
  upiId?: string;
  // Wallet specific
  walletProvider?: string;
  createdAt: string;
}

// Payment transaction
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: string;

  // References
  bookingId?: string;
  rentalId?: string;
  invoiceId?: string;
  refundForTransactionId?: string;

  // Payment gateway
  gatewayTransactionId?: string;
  gatewayResponse?: string;

  // Metadata
  description?: string;
  failureReason?: string;

  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  bookingId?: string;
  rentalId?: string;
  type: 'trip' | 'rental' | 'cancellation' | 'settlement';

  // Items
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  taxBreakdown?: TaxBreakdown[];
  discount?: number;
  total: number;
  currency: string;

  // Status
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: string;
  paidAt?: string;
  paidAmount?: number;

  // PDF
  pdfUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface TaxBreakdown {
  name: string;
  rate: number;
  amount: number;
}

// Driver withdrawal request
export interface WithdrawalRequest {
  id: string;
  driverId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  transactionId?: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

// Settlement for cab owners
export interface Settlement {
  id: string;
  ownerId: string;
  period: {
    start: string;
    end: string;
  };
  grossEarnings: number;
  platformFee: number;
  deductions: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed';
  transactions: string[]; // Transaction IDs
  settlementDate?: string;
  bankReference?: string;
  createdAt: string;
}

// Cancellation details
export interface Cancellation {
  id: string;
  bookingId?: string;
  rentalId?: string;
  initiatedBy: 'customer' | 'driver' | 'owner' | 'system';
  initiatorId: string;
  reason: string;
  reasonCategory: string;

  // Charges
  cancellationFee: number;
  refundAmount: number;
  refundStatus:
    | 'not_applicable'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';
  refundTransactionId?: string;

  // Policy applied
  policyApplied: string;
  freeOfCharge: boolean;

  createdAt: string;
  processedAt?: string;
}
