import { useState, useEffect, useCallback } from 'react';
import { tripsService } from '@/services';

export interface TripDisplay {
    id: string;
    date: string;
    pickup: string;
    destination: string;
    customer: { name: string; rating: number };
    fare: number;
    distance: number;
    duration: number;
    status: 'completed' | 'cancelled';
    rating?: number;
    tip?: number;
    paymentMethod: string;
    cancellationReason?: string;
}

export function useTripHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [dateFilter, setDateFilter] = useState('today');
    const [trips, setTrips] = useState<TripDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await tripsService.findAll({ limit: 50 });
            const formatted: TripDisplay[] = data.map(trip => {
                const actualFare = trip.actual_fare ? parseFloat(String(trip.actual_fare)) : 0;
                const estimatedFare = trip.estimated_fare ? parseFloat(String(trip.estimated_fare)) : 0;
                const fare = actualFare || estimatedFare || 0;

                return {
                    id: trip.id,
                    date: trip.created_at,
                    pickup: trip.pickup_address,
                    destination: trip.destination_address,
                    customer: {
                        name: trip.customer ? `${trip.customer.first_name} ${trip.customer.last_name}` : 'Customer',
                        rating: trip.customer_rating || 0,
                    },
                    fare: fare,
                    distance: parseFloat(String(trip.distance_km)) || 0,
                    duration: parseInt(String(trip.estimated_duration_minutes)) || 0,
                    status: trip.status === 'cancelled' ? 'cancelled' : 'completed',
                    rating: trip.driver_rating,
                    tip: 0,
                    paymentMethod: 'Cash',
                    cancellationReason: trip.cancellation_reason,
                };
            });
            setTrips(formatted);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips, dateFilter]);

    const filteredTrips = trips.filter((trip) => {
        if (activeTab === 'completed') return trip.status === 'completed';
        if (activeTab === 'cancelled') return trip.status === 'cancelled';
        return true;
    });

    const completedTrips = trips.filter((t) => t.status === 'completed');
    const cancelledCount = trips.filter((t) => t.status === 'cancelled').length;
    const totalEarnings = completedTrips.reduce((acc, t) => acc + t.fare + (t.tip || 0), 0);
    const totalDistance = completedTrips.reduce((acc, t) => acc + t.distance, 0);
    const avgRating = completedTrips.length > 0 ? completedTrips.reduce((acc, t) => acc + (t.rating || 0), 0) / completedTrips.length : 0;

    return {
        // State
        activeTab,
        dateFilter,
        trips,
        filteredTrips,
        isLoading,
        // Computed
        completedCount: completedTrips.length,
        cancelledCount,
        totalEarnings,
        totalDistance,
        avgRating,
        totalTrips: trips.length,
        // Actions
        setActiveTab,
        setDateFilter,
    };
}
