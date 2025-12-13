import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Star,
    ChevronRight,
    Download,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime, formatDuration } from '@/shared/utils';
import { tripsService } from '@/services';

// Types for driver trip display
interface TripDisplay {
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

export function TripHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [dateFilter, setDateFilter] = useState('today');
    const [trips, setTrips] = useState<TripDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch trips on mount
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setIsLoading(true);
                const data = await tripsService.findAll({ limit: 50 });
                const formatted: TripDisplay[] = data.map(trip => {
                    // Parse fare values properly to handle potential string/null values
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
                        paymentMethod: 'Cash', // Payment method not available in Trip type
                        cancellationReason: trip.cancellation_reason,
                    };
                });
                setTrips(formatted);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, [dateFilter]);

    const filteredTrips = trips.filter((trip) => {
        if (activeTab === 'completed') return trip.status === 'completed';
        if (activeTab === 'cancelled') return trip.status === 'cancelled';
        return true;
    });

    const completedTrips = trips.filter((t) => t.status === 'completed');
    const totalEarnings = completedTrips.reduce((acc, t) => acc + t.fare + (t.tip || 0), 0);
    const totalDistance = completedTrips.reduce((acc, t) => acc + t.distance, 0);
    const avgRating = completedTrips.length > 0 ? completedTrips.reduce((acc, t) => acc + (t.rating || 0), 0) / completedTrips.length : 0;

    if (isLoading) {
        return <PageLoader message="Loading trip history..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Trip History</h1>
                    <p className="text-gray-500">View and manage your completed trips</p>
                </div>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                    Export
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{completedTrips.length}</p>
                    <p className="text-sm text-gray-500">Trips</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-success-600">{formatCurrency(totalEarnings)}</p>
                    <p className="text-sm text-gray-500">Earnings</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
                    <p className="text-sm text-gray-500">Distance</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                        <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    </div>
                    <p className="text-sm text-gray-500">Avg Rating</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="all">All ({trips.length})</TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({trips.filter((t) => t.status === 'completed').length})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled">
                                Cancelled ({trips.filter((t) => t.status === 'cancelled').length})
                            </TabsTrigger>
                        </TabsList>

                        <Select
                            options={[
                                { value: 'today', label: 'Today' },
                                { value: 'week', label: 'This Week' },
                                { value: 'month', label: 'This Month' },
                                { value: 'all', label: 'All Time' },
                            ]}
                            value={dateFilter}
                            onValueChange={setDateFilter}
                        />
                    </div>

                    <TabsContent value={activeTab} className="mt-4">
                        <div className="space-y-3">
                            {filteredTrips.map((trip, index) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="md" interactive>
                                        <div className="flex items-start gap-4">
                                            {/* Status Icon */}
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${trip.status === 'completed' ? 'bg-success-100' : 'bg-error-100'
                                                }`}>
                                                {trip.status === 'completed' ? (
                                                    <CheckCircle className="w-6 h-6 text-success-600" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-error-600" />
                                                )}
                                            </div>

                                            {/* Trip Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {trip.pickup} → {trip.destination}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(trip.date)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatTime(trip.date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <StatusBadge status={trip.status} />
                                                </div>

                                                {trip.status === 'completed' ? (
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-gray-600">{trip.customer.name}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600">{trip.distance} km</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600">{formatDuration(trip.duration)}</span>
                                                        {trip.rating && (
                                                            <>
                                                                <span className="text-gray-400">•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                                                    {trip.rating}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-error-600">{trip.cancellationReason}</p>
                                                )}
                                            </div>

                                            {/* Fare */}
                                            {trip.status === 'completed' && (
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{formatCurrency(trip.fare)}</p>
                                                    {(trip.tip ?? 0) > 0 && (
                                                        <p className="text-xs text-success-600">+{formatCurrency(trip.tip ?? 0)} tip</p>
                                                    )}
                                                    <p className="text-xs text-gray-500">{trip.paymentMethod}</p>
                                                </div>
                                            )}

                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}
