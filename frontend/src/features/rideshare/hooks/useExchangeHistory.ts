import { useState, useEffect, useCallback } from 'react';
import { rideshareService, ExchangeHistoryItem as APIExchangeHistoryItem } from '@/services';

export interface ExchangeHistoryDisplay {
    id: string;
    type: 'booked' | 'hosted';
    status: 'completed' | 'cancelled' | 'upcoming';
    trip: { from: string; to: string; date: string; time: string };
    host?: { name: string; rating: number };
    passengers?: Array<{ name: string; rating: number }>;
    price?: number;
    earnings?: number;
    seatsBooked?: number;
    seatsOffered?: number;
    seatsFilled?: number;
    rating?: number;
    cancelReason?: string;
}

export function useExchangeHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistoryDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalSaved, setTotalSaved] = useState(0);

    const fetchExchangeHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const history = await rideshareService.getExchangeHistory();
            const formatted: ExchangeHistoryDisplay[] = history.map((item: APIExchangeHistoryItem) => ({
                id: item.id, type: item.type, status: item.status,
                trip: { from: item.trip.from, to: item.trip.to, date: item.trip.date, time: item.trip.time },
                host: item.host ? { name: item.host.name, rating: item.host.rating } : undefined,
                passengers: item.passengers?.map(p => ({ name: p.name, rating: p.rating })),
                price: item.price, earnings: item.earnings, seatsBooked: item.seats_booked,
                seatsOffered: item.seats_offered, seatsFilled: item.seats_filled, rating: item.rating, cancelReason: item.cancel_reason,
            }));
            setExchangeHistory(formatted);
            setTotalEarnings(formatted.filter(e => e.type === 'hosted' && e.status === 'completed').reduce((sum, e) => sum + (e.earnings || 0), 0));
            setTotalSaved(formatted.filter(e => e.type === 'booked' && e.status === 'completed').reduce((sum, e) => sum + (e.price || 0), 0));
        } catch (err) {
            console.error('Error fetching exchange history:', err);
            setError('Unable to load exchange history. Please try again later.');
            setExchangeHistory([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchExchangeHistory(); }, [fetchExchangeHistory]);

    const filteredHistory = exchangeHistory.filter((item) => activeTab === 'all' || item.type === activeTab);
    const bookedCount = exchangeHistory.filter(e => e.type === 'booked').length;
    const hostedCount = exchangeHistory.filter(e => e.type === 'hosted').length;

    return {
        activeTab, exchangeHistory, filteredHistory, isLoading, error, totalEarnings, totalSaved,
        bookedCount, hostedCount, totalCount: exchangeHistory.length, setActiveTab,
    };
}
