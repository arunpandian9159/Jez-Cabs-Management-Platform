import { useState, useEffect, useCallback } from 'react';
import { cabsService, type Cab, type CreateCabDto } from '@/services';

// Types for cab display
export interface CabDriverDisplay {
  id: string;
  name: string;
  phone: string;
  rating: number;
  trips: number;
}

export interface CabMetricsDisplay {
  totalTrips: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  rating: number;
}

export interface DocumentStatusDisplay {
  status: string;
  expiry: string;
}

export interface CabDocumentsDisplay {
  registration: DocumentStatusDisplay;
  insurance: DocumentStatusDisplay;
  permit: DocumentStatusDisplay;
}

export interface CabDisplay {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  fuelType: string;
  status: string;
  driver: CabDriverDisplay | null;
  metrics: CabMetricsDisplay;
  documents: CabDocumentsDisplay;
  lastService: string;
  nextService: string;
}

// Initial form state for new cab
export const initialNewCab: CreateCabDto = {
  registration_number: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  cab_type: 'sedan',
  seat_capacity: 4,
  fuel_type: 'petrol',
  base_fare: 50,
  per_km_rate: 12,
  daily_rate: 1500,
};

export function useManageCabs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCab, setSelectedCab] = useState<CabDisplay | null>(null);
  const [cabs, setCabs] = useState<CabDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New cab modal state
  const [showNewCabModal, setShowNewCabModal] = useState(false);
  const [newCab, setNewCab] = useState<CreateCabDto>(initialNewCab);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchCabs = useCallback(async () => {
    try {
      setIsLoading(true);
      const cabsResponse = await cabsService.findAll();
      const cabsArray = Array.isArray(cabsResponse)
        ? cabsResponse
        : cabsResponse.data || [];
      const formattedCabs: CabDisplay[] = cabsArray.map((c: Cab) => ({
        id: c.id,
        make: c.make,
        model: c.model,
        year: c.year || 2023,
        color: c.color,
        registrationNumber: c.registration_number,
        fuelType: c.fuel_type || 'petrol',
        status: c.status,
        driver: c.driver
          ? {
              id: c.driver.id,
              name: `${c.driver.first_name} ${c.driver.last_name}`,
              phone: c.driver.phone || '',
              rating: c.driver.rating || 4.5,
              trips: 0,
            }
          : null,
        metrics: {
          totalTrips: c.total_trips || 0,
          totalEarnings: 0,
          thisMonthEarnings: 0,
          rating: c.rating || 4.5,
        },
        documents: {
          registration: { status: 'valid', expiry: new Date().toISOString() },
          insurance: { status: 'valid', expiry: new Date().toISOString() },
          permit: { status: 'valid', expiry: new Date().toISOString() },
        },
        lastService: new Date().toISOString(),
        nextService: new Date().toISOString(),
      }));
      setCabs(formattedCabs);
    } catch (error) {
      console.error('Error fetching cabs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCabs();
  }, [fetchCabs]);

  const filteredCabs = cabs.filter((cab) => {
    const matchesSearch = `${cab.make} ${cab.model} ${cab.registrationNumber}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cab.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'success';
      case 'expiring':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCreateCab = async () => {
    if (
      !newCab.registration_number ||
      !newCab.make ||
      !newCab.model ||
      !newCab.color
    ) {
      setCreateError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);
      await cabsService.create(newCab);
      setShowNewCabModal(false);
      setNewCab(initialNewCab);
      await fetchCabs();
    } catch (error) {
      console.error('Error creating cab:', error);
      setCreateError('Failed to create cab. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewCabChange = (
    field: keyof CreateCabDto,
    value: string | number
  ) => {
    setNewCab((prev) => ({ ...prev, [field]: value }));
    setCreateError(null);
  };

  const handleCloseNewCabModal = (open: boolean) => {
    setShowNewCabModal(open);
    if (!open) {
      setNewCab(initialNewCab);
      setCreateError(null);
    }
  };

  return {
    // State
    searchQuery,
    statusFilter,
    selectedCab,
    cabs: filteredCabs,
    isLoading,
    showNewCabModal,
    newCab,
    isCreating,
    createError,
    // Actions
    setSearchQuery,
    setStatusFilter,
    setSelectedCab,
    setShowNewCabModal,
    handleCreateCab,
    handleNewCabChange,
    handleCloseNewCabModal,
    getDocumentStatusColor,
  };
}
