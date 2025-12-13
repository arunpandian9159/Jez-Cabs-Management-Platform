import { useState, useEffect, useCallback } from 'react';
import { tripsService } from '@/services';

export interface TripDriverDisplay { name: string; rating: number; }
export interface TripCabDisplay { make: string; model: string; registrationNumber: string; }
export interface TripDisplay {
    id: string; type: string; pickup: string; destination: string; date: string;
    driver: TripDriverDisplay | null; cab: TripCabDisplay | null;
    status: string; fare: number; distance: number; duration: number;
    rating?: number; cancellationReason?: string; refundAmount?: number;
}

export function useTripHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [trips, setTrips] = useState<TripDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await tripsService.findAll();
            const formatted: TripDisplay[] = data.map(trip => ({
                id: trip.id, type: trip.scheduled_at ? 'planned' : 'instant', pickup: trip.pickup_address,
                destination: trip.destination_address, date: trip.created_at,
                driver: trip.driver ? { name: `${trip.driver.first_name} ${trip.driver.last_name}`, rating: trip.driver.rating || 4.5 } : null,
                cab: trip.cab ? { make: trip.cab.make, model: trip.cab.model, registrationNumber: trip.cab.registration_number } : null,
                status: trip.status, fare: Number(trip.actual_fare) || Number(trip.estimated_fare) || 0, distance: Number(trip.distance_km) || 0,
                duration: trip.estimated_duration_minutes, rating: trip.customer_rating, cancellationReason: trip.cancellation_reason, refundAmount: undefined,
            }));
            setTrips(formatted);
        } catch (error) { console.error('Error fetching trips:', error); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchTrips(); }, [fetchTrips]);

    const filteredTrips = trips.filter((trip) => activeTab === 'all' || (activeTab === 'completed' ? trip.status === 'completed' : trip.status === 'cancelled'));
    const completedTrips = trips.filter((t) => t.status === 'completed');
    const totalSpent = completedTrips.reduce((acc, t) => acc + t.fare, 0);
    const totalDistance = completedTrips.reduce((acc, t) => acc + (Number(t.distance) || 0), 0);
    const completedCount = completedTrips.length;
    const cancelledCount = trips.filter((t) => t.status === 'cancelled').length;

    return { activeTab, sortBy, trips, filteredTrips, isLoading, totalSpent, totalDistance, completedCount, cancelledCount, totalCount: trips.length, setActiveTab, setSortBy };
}
