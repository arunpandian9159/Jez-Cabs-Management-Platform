import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    MapPin,
    Car,
    Clock,
    CreditCard,
    ArrowRight,
    ArrowUpRight,
    Star,
    Navigation,
    Calendar,
    Wallet,
    Route,
    Heart,
    ChevronRight,
    Sparkles,
    Gift,
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../lib/constants';
import { formatCurrency, formatRelativeTime, cn } from '../../lib/utils';
import { tripsService, usersService } from '../../services';

// Types for dashboard data
interface RecentTripDisplay {
    id: string;
    pickup: string;
    destination: string;
    date: string;
    fare: number;
    status: string;
    driverName: string;
    driverRating: number;
    cabType: string;
    distance: string;
    duration?: string;
}

interface DashboardStats {
    totalTrips: number;
    completedTrips: number;
    totalSpent: number;
    totalDistance: number;
}

interface SavedAddressDisplay {
    id: string;
    label: string;
    address: string;
    icon: string;
    color: string;
}

// Quick actions data
const quickActions = [
    {
        icon: MapPin,
        title: 'Book a Ride',
        description: 'Get a cab to your destination',
        path: ROUTES.CUSTOMER.BOOK_LOCATION,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-500/10 to-cyan-500/10',
        hoverBgGradient: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-500',
        hoverGlow: 'hover:shadow-blue-500/25',
        // Inline style colors for gradient
        startColor: 'rgba(59, 130, 246, 0.10)',
        endColor: 'rgba(6, 182, 212, 0.10)',
        hoverStartColor: 'rgba(59, 130, 246, 0.20)',
        hoverEndColor: 'rgba(6, 182, 212, 0.20)',
    },
    {
        icon: Car,
        title: 'Rent a Cab',
        description: 'Rent for hours, days, or weeks',
        path: ROUTES.CUSTOMER.RENTALS_BROWSE,
        gradient: 'from-orange-500 to-amber-500',
        bgGradient: 'from-orange-500/10 to-amber-500/10',
        hoverBgGradient: 'from-orange-500/20 to-amber-500/20',
        iconColor: 'text-orange-500',
        hoverGlow: 'hover:shadow-orange-500/25',
        startColor: 'rgba(249, 115, 22, 0.10)',
        endColor: 'rgba(245, 158, 11, 0.10)',
        hoverStartColor: 'rgba(249, 115, 22, 0.20)',
        hoverEndColor: 'rgba(245, 158, 11, 0.20)',
    },
    {
        icon: Clock,
        title: 'Trip History',
        description: 'View your past trips',
        path: ROUTES.CUSTOMER.TRIPS,
        gradient: 'from-emerald-500 to-teal-500',
        bgGradient: 'from-emerald-500/10 to-teal-500/10',
        hoverBgGradient: 'from-emerald-500/20 to-teal-500/20',
        iconColor: 'text-emerald-500',
        hoverGlow: 'hover:shadow-emerald-500/25',
        startColor: 'rgba(16, 185, 129, 0.10)',
        endColor: 'rgba(20, 184, 166, 0.10)',
        hoverStartColor: 'rgba(16, 185, 129, 0.20)',
        hoverEndColor: 'rgba(20, 184, 166, 0.20)',
    },
    {
        icon: CreditCard,
        title: 'Payments',
        description: 'Manage payment methods',
        path: ROUTES.CUSTOMER.PAYMENTS,
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-500/10 to-pink-500/10',
        hoverBgGradient: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-500',
        hoverGlow: 'hover:shadow-purple-500/25',
        startColor: 'rgba(168, 85, 247, 0.10)',
        endColor: 'rgba(236, 72, 153, 0.10)',
        hoverStartColor: 'rgba(168, 85, 247, 0.20)',
        hoverEndColor: 'rgba(236, 72, 153, 0.20)',
    },
];


export function CustomerDashboard() {
    const { user } = useAuth();
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);
    const [recentTrips, setRecentTrips] = useState<RecentTripDisplay[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddressDisplay[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalTrips: 0,
        completedTrips: 0,
        totalSpent: 0,
        totalDistance: 0,
    });
    const [_isLoading, setIsLoading] = useState(true);
    const currentHour = new Date().getHours();

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);

            // Fetch all trips and calculate stats
            try {
                const allTrips = await tripsService.findAll();

                // Calculate stats from real data
                const completedTrips = allTrips.filter(t => t.status === 'completed');
                const totalSpent = completedTrips.reduce((acc, t) =>
                    acc + (Number(t.actual_fare) || Number(t.estimated_fare) || 0), 0
                );
                const totalDistance = completedTrips.reduce((acc, t) =>
                    acc + (Number(t.distance_km) || 0), 0
                );

                setStats({
                    totalTrips: allTrips.length,
                    completedTrips: completedTrips.length,
                    totalSpent: totalSpent,
                    totalDistance: totalDistance,
                });

                // Get recent 3 completed trips for display
                const recentCompleted = completedTrips.slice(0, 3);
                const formattedTrips: RecentTripDisplay[] = recentCompleted.map(trip => ({
                    id: trip.id,
                    pickup: trip.pickup_address,
                    destination: trip.destination_address,
                    date: trip.created_at,
                    fare: Number(trip.actual_fare) || Number(trip.estimated_fare) || 0,
                    status: trip.status,
                    driverName: trip.driver ? `${trip.driver.first_name} ${trip.driver.last_name}` : 'Driver',
                    driverRating: trip.driver?.rating || 4.5,
                    cabType: trip.cab?.cab_type || 'Sedan',
                    distance: `${trip.distance_km} km`,
                }));
                setRecentTrips(formattedTrips);
            } catch (error) {
                console.warn('Could not fetch trips (API may not be implemented yet):', error);
                setRecentTrips([]);
            }

            // Fetch saved addresses - handle gracefully if API not available
            try {
                const addresses = await usersService.getSavedAddresses();
                const formattedAddresses: SavedAddressDisplay[] = addresses.map(addr => ({
                    id: addr.id,
                    label: addr.label,
                    address: addr.address,
                    icon: addr.icon || '📍',
                    color: 'bg-gray-100',
                }));
                setSavedAddresses(formattedAddresses);
            } catch (error) {
                console.warn('Could not fetch saved addresses (API may not be implemented yet):', error);
                // Provide some default addresses for demo purposes
                setSavedAddresses([
                    { id: '1', label: 'Home', address: 'Add your home address', icon: '🏠', color: 'bg-blue-100' },
                    { id: '2', label: 'Work', address: 'Add your work address', icon: '💼', color: 'bg-green-100' },
                ]);
            }

            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    const getGreeting = () => {
        if (currentHour < 12) return 'Good morning';
        if (currentHour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="space-y-8 pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Welcome Section */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl"
            >
                {/* Animated background gradient - using inline style for proper color rendering */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #0288d1 0%, #0177c6 50%, #ff6b35 100%)'
                    }}
                />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

                {/* Floating orbs */}
                <motion.div
                    className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 left-20 w-24 h-24 bg-accent-400/20 rounded-full blur-2xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="relative p-8 flex items-center justify-between">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Sparkles className="w-5 h-5 text-warning-300" />
                                </motion.div>
                                <span className="text-white/80 text-sm font-medium">Welcome to Jez Cabs</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {getGreeting()}, {user?.firstName}! 👋
                            </h1>
                            <p className="text-white/70 text-lg">Where would you like to go today?</p>
                        </motion.div>

                        {/* Quick search bar */}
                        <motion.div
                            className="mt-6 max-w-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link to={ROUTES.CUSTOMER.BOOK_LOCATION}>
                                <div className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 cursor-pointer transition-all duration-300 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Navigation className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white/90 font-medium flex-1">Where to?</span>
                                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Lottie animation */}
                    <motion.div
                        className="hidden lg:block w-64 h-64"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <DotLottieReact
                            src="/Man waiting car.lottie"
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </motion.div>

                    {/* User stats mini card */}
                    <motion.div
                        className="hidden md:flex flex-col items-end gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-white/70 mb-1">Your Rating</p>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-warning-400 text-warning-400" />
                                <span className="text-2xl font-bold text-white">4.9</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-white/70 mb-1">Loyalty Points</p>
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-accent-300" />
                                <span className="text-2xl font-bold text-white">2,450</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Overview - Trip Statistics */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Trip Statistics</h2>
                    <Link to={ROUTES.CUSTOMER.TRIPS}>
                        <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                            View Details
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Trips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative group"
                    >
                        <div className="bg-white rounded-2xl p-5 border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Trips</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Car className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Route className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-500 text-xs">All time bookings</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Distance Traveled */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="bg-white rounded-2xl p-5 border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Distance Traveled</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalDistance.toFixed(0)} km</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Navigation className="w-6 h-6 text-orange-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span className="text-gray-500 text-xs">Total kilometers</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Completed Trips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group"
                    >
                        <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Completed</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.completedTrips}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Route className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                <span className="text-gray-500 text-xs">Successful trips</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Total Spent */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group"
                    >
                        <div className="bg-white rounded-2xl p-5 border-l-4 border-purple-400 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Spent</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <CreditCard className="w-4 h-4 text-purple-500" />
                                <span className="text-gray-500 text-xs">All time spending</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            onHoverStart={() => setHoveredAction(action.title)}
                            onHoverEnd={() => setHoveredAction(null)}
                        >
                            <Link to={action.path}>
                                <div
                                    className={cn(
                                        "relative group h-full rounded-2xl border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-xl overflow-hidden",
                                        action.hoverGlow
                                    )}
                                    style={{
                                        background: `linear-gradient(to bottom right, ${action.startColor}, ${action.endColor})`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(to bottom right, ${action.hoverStartColor}, ${action.hoverEndColor})`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(to bottom right, ${action.startColor}, ${action.endColor})`;
                                    }}
                                >

                                    {/* Icon container */}
                                    <div className="relative mb-4">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                                            "bg-gradient-to-br",
                                            action.bgGradient,
                                            "group-hover:scale-110 group-hover:rotate-3"
                                        )}>
                                            <action.icon className={cn("w-8 h-8 transition-colors", action.iconColor)} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-gray-900">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600">
                                            {action.description}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <motion.div
                                        className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        animate={hoveredAction === action.title ? { x: [0, 4, 0] } : {}}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            "bg-gradient-to-br",
                                            action.bgGradient
                                        )}>
                                            <ArrowRight className={cn("w-4 h-4", action.iconColor)} />
                                        </div>
                                    </motion.div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Promo Banner */}
            <motion.div variants={itemVariants}>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-500 to-primary-500 p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="w-5 h-5 text-white" />
                                <span className="text-white/90 font-medium">Special Offer</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Get 20% off your next ride!</h3>
                            <p className="text-white/70">Use code <span className="font-mono bg-white/20 px-2 py-0.5 rounded">RIDE20</span> at checkout</p>
                        </div>
                        <Link to={ROUTES.CUSTOMER.BOOK_LOCATION}>
                            <Button
                                className="bg-white text-primary-600 hover:bg-white/90 shadow-lg"
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Trips */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-lg text-gray-900">Recent Trips</CardTitle>
                            </div>
                            <Link to={ROUTES.CUSTOMER.TRIPS}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                >
                                    View All
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <AnimatePresence>
                                {recentTrips.map((trip, index) => (
                                    <motion.div
                                        key={trip.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "group flex items-center gap-4 p-5 hover:bg-gray-50/80 transition-all duration-300 cursor-pointer",
                                            index !== recentTrips.length - 1 && 'border-b border-gray-100'
                                        )}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                <MapPin className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success-500 flex items-center justify-center border-2 border-white">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900 truncate">{trip.pickup}</span>
                                                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="font-medium text-gray-900 truncate">{trip.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span>{formatRelativeTime(trip.date)}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>{trip.cabType}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>{trip.distance}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                                                    <span>{trip.driverRating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="font-semibold text-gray-900 text-lg">
                                                {formatCurrency(trip.fare)}
                                            </p>
                                            <Badge
                                                variant="success"
                                                size="sm"
                                                className="bg-success-100 text-success-700 border-success-200"
                                            >
                                                Completed
                                            </Badge>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Saved Addresses */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
                            <CardHeader className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <CardTitle className="text-lg text-gray-900">Saved Places</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {savedAddresses.map((address, index) => (
                                    <Link
                                        key={address.id}
                                        to={ROUTES.CUSTOMER.BOOK_LOCATION}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={cn(
                                                "group flex items-center gap-3 p-4 hover:bg-gray-50 transition-all duration-300",
                                                index !== savedAddresses.length - 1 && 'border-b border-gray-100'
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                                                address.color,
                                                "shadow-sm group-hover:scale-110 transition-transform duration-300"
                                            )}>
                                                {address.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{address.label}</p>
                                                <p className="text-sm text-gray-500 truncate">{address.address}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        </motion.div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>


                    {/* Upcoming Features Teaser */}
                    <motion.div variants={itemVariants}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/50 p-5">
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-violet-500 text-white border-0">Coming Soon</Badge>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900">Schedule Rides</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Book rides in advance for your important appointments.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
