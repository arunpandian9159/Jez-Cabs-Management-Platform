import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    MapPin,
    Car,
    Clock,
    CreditCard,
    ArrowRight,
    Star,
    Navigation,
    Calendar,
    Wallet,
    Route,
    Zap,
    Shield,
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

// Mock data - In a real app, this would come from API
const quickActions = [
    {
        icon: MapPin,
        title: 'Book a Ride',
        description: 'Get a cab to your destination',
        path: ROUTES.CUSTOMER.BOOK_LOCATION,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-500/10 to-cyan-500/10',
        iconColor: 'text-blue-500',
        hoverGlow: 'hover:shadow-blue-500/25',
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

// TODO: Fetch recent trips from API
// API endpoint: GET /api/v1/trips?limit=3&status=completed
interface RecentTrip {
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
const recentTrips: RecentTrip[] = [];

// TODO: Fetch saved addresses from API
// API endpoint: GET /api/v1/users/addresses
interface SavedAddress {
    id: string;
    label: string;
    address: string;
    icon: string;
    color: string;
}
const savedAddresses: SavedAddress[] = [];

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
}

// Stats card component with animated counter
function StatCard({
    icon: Icon,
    value,
    label,
    suffix = '',
    prefix = '',
    gradient,
    delay = 0
}: {
    icon: React.ElementType;
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    gradient: string;
    delay?: number;
}) {
    const animatedValue = useAnimatedCounter(value, 2000);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative group"
        >
            <div className={cn(
                "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500",
                "bg-gradient-to-r",
                gradient
            )} />
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 hover:border-gray-300 transition-all duration-300">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    "bg-gradient-to-r",
                    gradient
                )}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {prefix}{animatedValue.toLocaleString()}{suffix}
                </p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
        </motion.div>
    );
}

export function CustomerDashboard() {
    const { user } = useAuth();
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);
    const currentHour = new Date().getHours();

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

            {/* Stats Overview */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">This Month's Activity</h2>
                    <Link to={ROUTES.CUSTOMER.TRIPS}>
                        <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                            View Details
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Route}
                        value={12}
                        label="Total Trips"
                        gradient="from-blue-500 to-cyan-500"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Wallet}
                        value={4850}
                        label="Amount Spent"
                        prefix="₹"
                        gradient="from-violet-500 to-purple-500"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Navigation}
                        value={142}
                        label="Distance Traveled"
                        suffix=" km"
                        gradient="from-emerald-500 to-teal-500"
                        delay={0.3}
                    />
                    <StatCard
                        icon={Zap}
                        value={320}
                        label="Savings"
                        prefix="₹"
                        gradient="from-amber-500 to-orange-500"
                        delay={0.4}
                    />
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onHoverStart={() => setHoveredAction(action.title)}
                            onHoverEnd={() => setHoveredAction(null)}
                        >
                            <Link to={action.path}>
                                <div className={cn(
                                    "relative group h-full bg-white rounded-2xl border border-gray-200 p-5 transition-all duration-300",
                                    "hover:border-transparent hover:shadow-xl",
                                    action.hoverGlow
                                )}>
                                    {/* Gradient border on hover */}
                                    <div className={cn(
                                        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10",
                                        "bg-gradient-to-r",
                                        action.gradient,
                                        "blur-xl"
                                    )} />

                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                                        "bg-gradient-to-r",
                                        action.bgGradient,
                                        "group-hover:scale-110"
                                    )}>
                                        <action.icon className={cn("w-7 h-7 transition-colors", action.iconColor)} />
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-900">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                        {action.description}
                                    </p>

                                    <motion.div
                                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        animate={hoveredAction === action.title ? { x: [0, 5, 0] } : {}}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className={cn("w-5 h-5", action.iconColor)} />
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

                    {/* Safety Features */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-gray-700 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                            <CardContent className="p-5 relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <span className="font-semibold">Safety First</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    Your safety is our priority. Access safety features anytime during your ride.
                                </p>
                                <Link to={ROUTES.CUSTOMER.SAFETY}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
                                        rightIcon={<ArrowRight className="w-4 h-4" />}
                                    >
                                        Safety Center
                                    </Button>
                                </Link>
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
