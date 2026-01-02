import React, { useState, useCallback } from 'react';
import { paymentsService, VerifyPaymentDto } from '@/services/payments.service';

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface PaymentCheckoutProps {
  amount: number; // in rupees
  tripId?: string;
  rentalId?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (payment: { paymentId: string; orderId: string }) => void;
  onError?: (error: Error) => void;
  onDismiss?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export function useRazorpayCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(
    async (options: {
      amount: number;
      tripId?: string;
      rentalId?: string;
      description?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      onSuccess?: (data: { paymentId: string; orderId: string }) => void;
      onError?: (error: Error) => void;
      onDismiss?: () => void;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        // Load Razorpay script if not loaded
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay SDK');
        }

        // Create order on backend
        const amountInPaise = Math.round(options.amount * 100);
        const orderResponse = await paymentsService.createOrder({
          amount: amountInPaise,
          trip_id: options.tripId,
          rental_id: options.rentalId,
          notes: options.description,
        });

        if (!orderResponse.success) {
          throw new Error('Failed to create payment order');
        }

        const { order_id, amount, currency } = orderResponse.data;

        // Open Razorpay checkout
        const razorpayOptions: RazorpayOptions = {
          key: RAZORPAY_KEY,
          amount,
          currency,
          name: 'Jez Cabs',
          description: options.description || 'Trip Payment',
          order_id,
          handler: async (response: RazorpayResponse) => {
            try {
              // Verify payment on backend
              const verifyDto: VerifyPaymentDto = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              const verifyResponse =
                await paymentsService.verifyPayment(verifyDto);

              if (verifyResponse.success) {
                options.onSuccess?.({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                });
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (err) {
              const error =
                err instanceof Error
                  ? err
                  : new Error('Payment verification failed');
              setError(error);
              options.onError?.(error);
            } finally {
              setIsLoading(false);
            }
          },
          prefill: {
            name: options.customerName,
            email: options.customerEmail,
            contact: options.customerPhone,
          },
          theme: {
            color: '#6366f1', // Indigo color matching the app theme
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              options.onDismiss?.();
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Payment initialization failed');
        setError(error);
        setIsLoading(false);
        options.onError?.(error);
      }
    },
    [loadRazorpayScript]
  );

  return {
    initiatePayment,
    isLoading,
    error,
  };
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  amount,
  tripId,
  rentalId,
  description,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
  onDismiss,
  children,
  className = '',
  disabled = false,
}) => {
  const { initiatePayment, isLoading } = useRazorpayCheckout();

  const handleClick = () => {
    if (disabled || isLoading) return;

    initiatePayment({
      amount,
      tripId,
      rentalId,
      description,
      customerName,
      customerEmail,
      customerPhone,
      onSuccess,
      onError,
      onDismiss,
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children || `Pay ₹${amount.toFixed(2)}`
      )}
    </button>
  );
};

export default PaymentCheckout;
