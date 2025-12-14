import { useState, useEffect, useCallback } from 'react';
import { rentalsService, Rental } from '@/services';

export interface RentalDisplay {
  id: string;
  cab: {
    make: string;
    model: string;
    registrationNumber: string;
    color: string;
    imageUrl?: string;
  };
  owner: { name: string; phone: string };
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  daysRemaining?: number;
  totalDays?: number;
  startOdometer?: number;
  currentOdometer?: number;
  rating?: number;
  refundAmount?: number;
}

export function useActiveRentals() {
  const [activeTab, setActiveTab] = useState('active');
  const [activeRentals, setActiveRentals] = useState<RentalDisplay[]>([]);
  const [pastRentals, setPastRentals] = useState<RentalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatRental = (r: Rental): RentalDisplay => {
    const startDate = new Date(r.start_date);
    const endDate = new Date(r.end_date);
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: r.id,
      cab: {
        make: r.cab?.make || '',
        model: r.cab?.model || '',
        registrationNumber: r.cab?.registration_number || '',
        color: r.cab?.color || 'Black',
        imageUrl: r.cab?.images?.[0],
      },
      owner: { name: '', phone: '' },
      startDate: r.start_date,
      endDate: r.end_date,
      status: r.status,
      totalAmount: r.total_amount,
      paidAmount: r.total_amount,
      totalDays,
      daysRemaining: Math.max(
        0,
        Math.ceil(
          (new Date(r.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      ),
    };
  };

  const fetchRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      const rentals = await rentalsService.findAll();
      setActiveRentals(
        rentals
          .filter(
            (r: Rental) => r.status === 'active' || r.status === 'confirmed'
          )
          .map(formatRental)
      );
      setPastRentals(
        rentals
          .filter(
            (r: Rental) => r.status === 'completed' || r.status === 'cancelled'
          )
          .map(formatRental)
      );
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return { activeTab, activeRentals, pastRentals, isLoading, setActiveTab };
}
