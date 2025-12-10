import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Car,
    Clock,
    CreditCard,
    ArrowRight,
    TrendingUp,
    Star,
    Navigation,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../lib/constants';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';

// Mock data - In a real app, this would come from API
const quickActions = [
    {
        icon: MapPin,
        title: 'Book a Ride',
        description: 'Get a cab to your destination',
        path: ROUTES.CUSTOMER.BOOK_LOCATION,
        color: 'bg-primary-100 text-primary-600',
    },
    {
        icon: Car,
        title: 'Rent a Cab',
        description: 'Rent for hours, days, or weeks',
        path: ROUTES.CUSTOMER.RENTALS_BROWSE,
        color: 'bg-accent-100 text-accent-600',
    },
    {
        icon: Clock,
        title: 'Trip History',
        description: 'View your past trips',
        path: ROUTES.CUSTOMER.TRIPS,
        color: 'bg-success-100 text-success-600',
    },
    {
        icon: CreditCard,
        title: 'Payments',
        description: 'Manage payment methods',
        path: ROUTES.CUSTOMER.PAYMENTS,
        color: 'bg-warning-100 text-warning-600',
    },
];

const recentTrips = [
    {
        id: '1',
        pickup: 'MG Road Metro Station',
        destination: 'Kempegowda Airport',
        date: '2025-12-10T10:30:00',
        fare: 850,
        status: 'completed',
        driverName: 'Rajesh Kumar',
        driverRating: 4.8,
        cabType: 'Comfort',
    },
    {
        id: '2',
        pickup: 'Indiranagar',
        destination: 'Electronic City',
        date: '2025-12-09T09:00:00',
        fare: 420,
        status: 'completed',
        driverName: 'Suresh Patel',
        driverRating: 4.9,
        cabType: 'Economy',
    },
    {
        id: '3',
        pickup: 'Koramangala',
        destination: 'Whitefield',
        date: '2025-12-08T18:15:00',
        fare: 580,
        status: 'completed',
        driverName: 'Amit Singh',
        driverRating: 4.7,
        cabType: 'Premium',
    },
];

const savedAddresses = [
    { id: '1', label: 'Home', address: '123, 4th Cross, Koramangala, Bangalore' },
    { id: '2', label: 'Work', address: 'Tech Park, Outer Ring Road, Marathahalli' },
    { id: '3', label: 'Gym', address: 'Gold\'s Gym, Indiranagar' },
];

export function CustomerDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            Welcome back, {user?.firstName}! 👋
                        </h1>
                        <p className="text-white/80">Where would you like to go today?</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-white/70">Your Rating</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-warning-400 text-warning-400" />
                                <span className="text-xl font-bold">4.9</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick search */}
                <div className="mt-6">
                    <Link to={ROUTES.CUSTOMER.BOOK_LOCATION}>
                        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 cursor-pointer transition-colors">
                            <Navigation className="w-5 h-5" />
                            <span className="text-white/80">Where to?</span>
                            <ArrowRight className="w-5 h-5 ml-auto" />
                        </div>
                    </Link>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={action.path}>
                            <Card
                                interactive
                                padding="md"
                                className="h-full hover:border-primary-200"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}
                                >
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-500">{action.description}</p>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Trips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
                            <CardTitle className="text-lg">Recent Trips</CardTitle>
                            <Link to={ROUTES.CUSTOMER.TRIPS}>
                                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    View All
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentTrips.map((trip, index) => (
                                <div
                                    key={trip.id}
                                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${index !== recentTrips.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900 truncate">
                                                {trip.pickup}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="font-medium text-gray-900 truncate">
                                                {trip.destination}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span>{formatRelativeTime(trip.date)}</span>
                                            <span>•</span>
                                            <span>{trip.cabType}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                                                <span>{trip.driverRating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(trip.fare)}
                                        </p>
                                        <Badge variant="success" size="sm">
                                            Completed
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Saved Addresses & Stats */}
                <div className="space-y-6">
                    {/* Saved Addresses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="p-4 border-b border-gray-100">
                                <CardTitle className="text-lg">Saved Addresses</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {savedAddresses.map((address, index) => (
                                    <Link
                                        key={address.id}
                                        to={ROUTES.CUSTOMER.BOOK_LOCATION}
                                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${index !== savedAddresses.length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900">{address.label}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {address.address}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-primary-400" />
                                    <span className="font-medium">This Month</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold">12</p>
                                        <p className="text-sm text-gray-400">Trips</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">₹4,850</p>
                                        <p className="text-sm text-gray-400">Spent</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">142 km</p>
                                        <p className="text-sm text-gray-400">Traveled</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">₹320</p>
                                        <p className="text-sm text-gray-400">Saved</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
