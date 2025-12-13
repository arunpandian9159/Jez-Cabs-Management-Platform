import { useState, useEffect, useCallback } from 'react';
import { rentalsService } from '@/services';

export interface AvailableCabDisplay {
    id: string; make: string; model: string; year: number; color: string; seats: number;
    fuel: string; transmission: string; pricePerDay: number; pricePerKm: number;
    rating: number; reviews: number; ownerName: string; image: string | null; features: string[]; available: boolean;
}

export const rentalTypes = [{ value: 'self_drive', label: 'Self Drive' }, { value: 'with_driver', label: 'With Driver' }];
export const durationOptions = [{ value: 'hourly', label: 'Hourly' }, { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }];

export function useBrowseCabs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [rentalType, setRentalType] = useState('self_drive');
    const [duration, setDuration] = useState('daily');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [availableCabs, setAvailableCabs] = useState<AvailableCabDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCabs = useCallback(async () => {
        try {
            setIsLoading(true);
            const cabs = await rentalsService.getAvailableCabs();
            const formatted: AvailableCabDisplay[] = cabs.map(cab => ({
                id: cab.id, make: cab.make, model: cab.model, year: 2023, color: 'Black', seats: 5,
                fuel: 'Petrol', transmission: 'Automatic', pricePerDay: cab.daily_rate || 2000, pricePerKm: 15,
                rating: cab.rating || 4.5, reviews: cab.total_rentals || 0,
                ownerName: cab.owner ? `${cab.owner.first_name} ${cab.owner.last_name}` : 'Owner',
                image: cab.images?.[0] || null, features: cab.features || [], available: true,
            }));
            setAvailableCabs(formatted);
        } catch (error) { console.error('Error fetching available cabs:', error); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchCabs(); }, [fetchCabs]);

    const toggleFavorite = (id: string) => setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
    const filteredCabs = availableCabs.filter((cab) => `${cab.make} ${cab.model}`.toLowerCase().includes(searchQuery.toLowerCase()));

    return {
        searchQuery, rentalType, duration, showFilters, favorites, availableCabs, filteredCabs, isLoading,
        setSearchQuery, setRentalType, setDuration, setShowFilters: () => setShowFilters(!showFilters), toggleFavorite,
    };
}
