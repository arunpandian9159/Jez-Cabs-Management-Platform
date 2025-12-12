import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Car,
    Star,
    ChevronRight,
    Download
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge, StatusBadge } from '../../../components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Select } from '../../../components/ui/Select';
import { formatCurrency, formatDate, formatTime, formatDuration } from '../../../lib/utils';
import { tripsService } from '../../../services';

// Types for trip history display
interface TripDriverDisplay {
    name: string;
    rating: number;
}
interface TripCabDisplay {
    make: string;
    model: string;
    registrationNumber: string;
}
interface TripDisplay {
    id: string;
    type: string;
    pickup: string;
    destination: string;
    date: string;
    driver: TripDriverDisplay | null;
    cab: TripCabDisplay | null;
    status: string;
    fare: number;
    distance: number;
    duration: number;
    rating?: number;
    cancellationReason?: string;
    refundAmount?: number;
}

export function TripHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [trips, setTrips] = useState<TripDisplay[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    // Fetch trips on mount
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setIsLoading(true);
                const data = await tripsService.findAll();
                const formatted: TripDisplay[] = data.map(trip => ({
                    id: trip.id,
                    type: trip.scheduled_at ? 'planned' : 'instant',
                    pickup: trip.pickup_address,
                    destination: trip.destination_address,
                    date: trip.created_at,
                    driver: trip.driver ? {
                        name: `${trip.driver.first_name} ${trip.driver.last_name}`,
                        rating: trip.driver.rating || 4.5,
                    } : null,
                    cab: trip.cab ? {
                        make: trip.cab.make,
                        model: trip.cab.model,
                        registrationNumber: trip.cab.registration_number,
                    } : null,
                    status: trip.status,
                    fare: trip.actual_fare || trip.estimated_fare,
                    distance: Number(trip.distance_km) || 0,
                    duration: trip.estimated_duration_minutes,
                    rating: trip.customer_rating,
                    cancellationReason: trip.cancellation_reason,
                    refundAmount: undefined,
                }));
                setTrips(formatted);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const filteredTrips = trips.filter((trip) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'completed') return trip.status === 'completed';
        if (activeTab === 'cancelled') return trip.status === 'cancelled';
        return true;
    });

    const completedTrips = trips.filter((t) => t.status === 'completed');
    const totalSpent = completedTrips.reduce((acc, t) => acc + t.fare, 0);
    const totalDistance = completedTrips.reduce((acc, t) => acc + (Number(t.distance) || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Trip History
                    </h1>
                    <p className="text-gray-500">
                        View all your past trips
                    </p>
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
                className="grid grid-cols-3 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{completedTrips.length}</p>
                    <p className="text-sm text-gray-500">Total Trips</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{(totalDistance || 0).toFixed(0)} km</p>
                    <p className="text-sm text-gray-500">Distance Traveled</p>
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
                                { value: 'date', label: 'Sort by Date' },
                                { value: 'fare', label: 'Sort by Fare' },
                                { value: 'distance', label: 'Sort by Distance' },
                            ]}
                            value={sortBy}
                            onValueChange={setSortBy}
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
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${trip.status === 'completed'
                                                ? 'bg-success-100'
                                                : 'bg-error-100'
                                                }`}>
                                                <Car className={`w-6 h-6 ${trip.status === 'completed'
                                                    ? 'text-success-600'
                                                    : 'text-error-600'
                                                    }`} />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium text-gray-900 truncate">
                                                                {trip.pickup} → {trip.destination}
                                                            </p>
                                                            <Badge variant={trip.type === 'instant' ? 'primary' : 'info'} size="sm">
                                                                {trip.type === 'instant' ? 'Instant' : 'Planned'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500">
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

                                                {trip.status === 'completed' && trip.driver && (
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-gray-600">
                                                            {trip.driver.name}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                                            {trip.rating}
                                                        </span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600">
                                                            {trip.distance} km
                                                        </span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600">
                                                            {formatDuration(trip.duration)}
                                                        </span>
                                                    </div>
                                                )}

                                                {trip.status === 'cancelled' && (
                                                    <p className="text-sm text-error-600">
                                                        {trip.cancellationReason}
                                                        {trip.refundAmount && (
                                                            <span className="text-success-600 ml-2">
                                                                (Refund: {formatCurrency(trip.refundAmount)})
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Fare */}
                                            <div className="text-right">
                                                {trip.status === 'completed' && (
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(trip.fare)}
                                                    </p>
                                                )}
                                            </div>

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
