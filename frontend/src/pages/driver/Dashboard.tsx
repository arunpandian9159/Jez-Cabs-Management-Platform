import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Car,
    Clock,
    DollarSign,
    Star,
    Navigation,
    Power,
    TrendingUp,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { cn, formatCurrency } from '../../lib/utils';

// Mock driver data
const driverStats = {
    todayEarnings: 2450,
    weeklyEarnings: 18500,
    monthlyEarnings: 72000,
    totalTrips: 1248,
    rating: 4.8,
    acceptanceRate: 92,
    completionRate: 98,
    onlineHours: 8.5,
};

const pendingRequests = [
    {
        id: 'req1',
        pickup: 'Koramangala 4th Block',
        destination: 'Whitefield Tech Park',
        distance: 18.5,
        estimatedFare: 380,
        estimatedTime: 45,
        customerName: 'Rahul S.',
        customerRating: 4.7,
        tripType: 'instant',
        expiresIn: 25,
    },
];

const recentTrips = [
    {
        id: 't1',
        pickup: 'Indiranagar',
        destination: 'Electronic City',
        fare: 520,
        distance: 22,
        time: '09:30 AM',
        rating: 5,
        status: 'completed',
    },
    {
        id: 't2',
        pickup: 'MG Road',
        destination: 'Hebbal',
        fare: 280,
        distance: 12,
        time: '08:15 AM',
        rating: 4,
        status: 'completed',
    },
    {
        id: 't3',
        pickup: 'Jayanagar',
        destination: 'Bellandur',
        fare: 0,
        distance: 15,
        time: '07:00 AM',
        rating: null,
        status: 'cancelled',
    },
];

export function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const [showTripRequest, setShowTripRequest] = useState(pendingRequests.length > 0);

    const currentRequest = pendingRequests[0];

    return (
        <div className="space-y-6">
            {/* Header with Online Toggle */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome back, Driver!
                    </h1>
                    <p className="text-gray-500">
                        {isOnline ? "You're online and ready for trips" : "You're currently offline"}
                    </p>
                </div>
                <Button
                    variant={isOnline ? 'primary' : 'outline'}
                    size="lg"
                    leftIcon={<Power className="w-5 h-5" />}
                    onClick={() => setIsOnline(!isOnline)}
                    className={cn(
                        isOnline && 'bg-success-500 hover:bg-success-600'
                    )}
                >
                    {isOnline ? 'Online' : 'Go Online'}
                </Button>
            </motion.div>

            {/* Trip Request Popup */}
            {showTripRequest && currentRequest && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card padding="lg" className="border-2 border-primary-500 bg-primary-50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                                    <Navigation className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">New Trip Request</h3>
                                    <p className="text-sm text-gray-500">
                                        Expires in {currentRequest.expiresIn}s
                                    </p>
                                </div>
                            </div>
                            <Badge variant="primary">{currentRequest.tripType}</Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-success-500 mt-1.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Pickup</p>
                                    <p className="font-medium text-gray-900">{currentRequest.pickup}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-error-500 mt-1.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Destination</p>
                                    <p className="font-medium text-gray-900">{currentRequest.destination}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white rounded-lg">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(currentRequest.estimatedFare)}
                                </p>
                                <p className="text-xs text-gray-500">Est. Fare</p>
                            </div>
                            <div className="text-center border-x border-gray-100">
                                <p className="text-lg font-bold text-gray-900">
                                    {currentRequest.distance} km
                                </p>
                                <p className="text-xs text-gray-500">Distance</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">
                                    {currentRequest.estimatedTime} min
                                </p>
                                <p className="text-xs text-gray-500">Duration</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg">
                            <Avatar size="md" name={currentRequest.customerName} />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{currentRequest.customerName}</p>
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                    <span>{currentRequest.customerRating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                fullWidth
                                leftIcon={<XCircle className="w-5 h-5" />}
                                onClick={() => setShowTripRequest(false)}
                            >
                                Decline
                            </Button>
                            <Button
                                fullWidth
                                leftIcon={<CheckCircle className="w-5 h-5" />}
                                className="bg-success-500 hover:bg-success-600"
                            >
                                Accept
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-success-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(driverStats.todayEarnings)}
                            </p>
                            <p className="text-xs text-gray-500">Today's Earnings</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Car className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {driverStats.totalTrips}
                            </p>
                            <p className="text-xs text-gray-500">Total Trips</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                            <Star className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {driverStats.rating}
                            </p>
                            <p className="text-xs text-gray-500">Rating</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {driverStats.onlineHours}h
                            </p>
                            <p className="text-xs text-gray-500">Online Today</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Earnings Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Earnings Overview</h3>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-white/70 text-sm">Today</p>
                            <p className="text-2xl font-bold">{formatCurrency(driverStats.todayEarnings)}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">This Week</p>
                            <p className="text-2xl font-bold">{formatCurrency(driverStats.weeklyEarnings)}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">This Month</p>
                            <p className="text-2xl font-bold">{formatCurrency(driverStats.monthlyEarnings)}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 gap-4"
            >
                <Card padding="md">
                    <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Acceptance Rate</span>
                                <span className="font-medium text-gray-900">{driverStats.acceptanceRate}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-success-500 rounded-full"
                                    style={{ width: `${driverStats.acceptanceRate}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="font-medium text-gray-900">{driverStats.completionRate}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{ width: `${driverStats.completionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Trips</h3>
                        <Link to="/driver/trips" className="text-sm text-primary-600 hover:text-primary-700">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentTrips.map((trip) => (
                            <div
                                key={trip.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center',
                                        trip.status === 'completed' ? 'bg-success-100' : 'bg-error-100'
                                    )}>
                                        {trip.status === 'completed' ? (
                                            <CheckCircle className="w-4 h-4 text-success-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-error-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {trip.pickup} → {trip.destination}
                                        </p>
                                        <p className="text-xs text-gray-500">{trip.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {trip.status === 'completed' ? (
                                        <>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(trip.fare)}
                                            </p>
                                            {trip.rating && (
                                                <div className="flex items-center gap-1 justify-end">
                                                    <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                                    <span className="text-xs text-gray-500">{trip.rating}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Badge variant="error" size="sm">Cancelled</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
