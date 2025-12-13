import { useState, useEffect, useCallback } from 'react';
import { usersService } from '@/services';

export interface PaymentMethodDisplay {
  id: string;
  type: string;
  brand?: string;
  last4?: string;
  expiry?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface TransactionDisplay {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: string;
}

export function usePayments() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [showAddCard, setShowAddCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDisplay[]>(
    []
  );
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentData = useCallback(async () => {
    try {
      setIsLoading(true);
      const methods = await usersService.getPaymentMethods();
      setPaymentMethods(
        methods.map((m) => ({
          id: m.id,
          type: m.type,
          brand: m.type === 'card' ? 'Visa' : undefined,
          last4: m.last_four,
          expiry: m.expires_at,
          upiId: m.upi_id,
          isDefault: m.is_default,
        }))
      );
      const txns = await usersService.getTransactions();
      setTransactions(
        txns.map((t) => ({
          id: t.id,
          type: t.type,
          description: t.description,
          amount: t.amount,
          date: t.created_at,
          status: t.status,
          paymentMethod: t.payment_method || 'Wallet',
        }))
      );
      const wallet = await usersService.getWalletBalance();
      setWalletBalance(wallet.balance);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const filteredTransactions = transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pendingTransactions = filteredTransactions.filter(
    (tx) => tx.status === 'pending'
  );
  const completedTransactions = filteredTransactions.filter(
    (tx) => tx.status !== 'pending'
  );

  return {
    activeTab,
    showAddCard,
    searchQuery,
    paymentMethods,
    transactions,
    walletBalance,
    isLoading,
    filteredTransactions,
    pendingTransactions,
    completedTransactions,
    setActiveTab,
    setShowAddCard,
    setSearchQuery,
  };
}
