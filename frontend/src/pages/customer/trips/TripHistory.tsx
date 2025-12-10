import { useState } from 'react';
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

// Mock trip history
const trips = [
    {
        id: 't1',
        type: 'instant',
        pickup: 'Koramangala, Bangalore',
        destination: 'Whitefield, Bangalore',
        date: '2025-12-10T14:30:00',
        driver: {
            name: 'Rajesh Kumar',
            rating: 4.8,
        },
        cab: {
            make: 'Maruti',
            model: 'Swift Dzire',
            registrationNumber: 'KA 01 AB 1234',
        },
        status: 'completed',
        fare: 320,
        distance: 15.2,
        duration: 45,
        rating: 5,
    },
    {
        id: 't2',
        type: 'instant',
        pickup: 'Indiranagar, Bangalore',
        destination: 'Electronic City, Bangalore',
        date: '2025-12-08T09:00:00',
        driver: {
            name: 'Suresh R',
            rating: 4.5,
        },
        cab: {
            make: 'Hyundai',
            model: 'Xcent',
            registrationNumber: 'KA 05 CD 5678',
        },
        status: 'completed',
        fare: 450,
        distance: 22.5,
        duration: 62,
        rating: 4,
    },
    {
        id: 't3',
        type: 'planned',
        pickup: 'Bangalore',
        destination: 'Mysore',
        date: '2025-12-05T06:00:00',
        driver: {
            name: 'Mahesh K',
            rating: 4.9,
        },
        cab: {
            make: 'Toyota',
            model: 'Innova',
            registrationNumber: 'KA 09 EF 9012',
        },
        status: 'completed',
        fare: 2800,
        distance: 145,
        duration: 180,
        rating: 5,
    },
    {
        id: 't4',
        type: 'instant',
        pickup: 'MG Road, Bangalore',
        destination: 'Airport',
        date: '2025-12-01T04:30:00',
        driver: null,
        cab: null,
        status: 'cancelled',
        fare: 0,
        distance: 0,
        duration: 0,
        cancellationReason: 'No drivers available',
        refundAmount: 50,
    },
];

export function TripHistory() {
    const [activeTab, setActiveTab] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const filteredTrips = trips.filter((trip) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'completed') return trip.status === 'completed';
        if (activeTab === 'cancelled') return trip.status === 'cancelled';
        return true;
    });

    const completedTrips = trips.filter((t) => t.status === 'completed');
    const totalSpent = completedTrips.reduce((acc, t) => acc + t.fare, 0);
    const totalDistance = completedTrips.reduce((acc, t) => acc + t.distance, 0);

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
                    <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(0)} km</p>
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
