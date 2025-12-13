import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car,
    Phone,
    Star,
    CheckCircle,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { cn, formatCurrency } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import { useTripStatusSocket } from '@/shared/hooks';

interface DriverCab {
    make: string;
    model: string;
    color: string;
    registrationNumber: string;
}
interface Driver {
    id: string;
    name: string;
    photo: string | null;
    rating: number;
    totalTrips: number;
    cab: DriverCab;
    eta: number;
    phone: string;
}

type SearchState = 'searching' | 'found' | 'arriving' | 'arrived';

export function DriverSearch() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchState, setSearchState] = useState<SearchState>('searching');
    const [searchProgress, setSearchProgress] = useState(0);
    const [driver, setDriver] = useState<Driver | null>(null);

    const { pickup, destination, cabType, fare, tripId } = location.state || {};

    // WebSocket connection for trip status updates
    const {
        tripStatus: wsTripStatus,
        driver: wsDriver,
        eta: wsEta,
        isConnected: wsConnected,
    } = useTripStatusSocket(tripId);

    // Handle WebSocket driver assignment
    useEffect(() => {
        if (wsTripStatus?.type === 'driver_assigned' && wsDriver) {
            // Map WebSocket driver data to local Driver format
            const assignedDriver: Driver = {
                id: wsDriver.id,
                name: wsDriver.name,
                photo: wsDriver.photo,
                rating: wsDriver.rating,
                totalTrips: wsDriver.totalTrips,
                cab: {
                    make: wsDriver.cab.make,
                    model: wsDriver.cab.model,
                    color: wsDriver.cab.color,
                    registrationNumber: wsDriver.cab.registrationNumber,
                },
                eta: wsEta || 5,
                phone: wsDriver.phone,
            };
            setDriver(assignedDriver);
            setSearchState('found');
        } else if (wsTripStatus?.type === 'driver_en_route') {
            setSearchState('arriving');
        } else if (wsTripStatus?.type === 'driver_arrived') {
            setSearchState('arrived');
        }
    }, [wsTripStatus, wsDriver, wsEta]);

    // Simulate driver search progress (visual feedback)
    useEffect(() => {
        if (searchState === 'searching') {
            const progressInterval = setInterval(() => {
                setSearchProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);

            // Fallback: If WebSocket is not connected, simulate finding a driver
            // This allows demo mode to work without a backend
            let findTimer: ReturnType<typeof setTimeout> | null = null;
            if (!wsConnected) {
                findTimer = setTimeout(() => {
                    // Create a demo driver for simulation
                    const demoDriver: Driver = {
                        id: 'demo-driver-1',
                        name: 'Rajesh Kumar',
                        photo: null,
                        rating: 4.8,
                        totalTrips: 1250,
                        cab: {
                            make: 'Maruti',
                            model: 'Swift Dzire',
                            color: 'White',
                            registrationNumber: 'KA 01 AB 1234',
                        },
                        eta: 5,
                        phone: '+91 98765 43210',
                    };
                    setDriver(demoDriver);
                    setSearchState('found');
                }, 3000);
            }

            return () => {
                clearInterval(progressInterval);
                if (findTimer) clearTimeout(findTimer);
            };
        }
    }, [searchState, wsConnected]);

    // Progress through states
    useEffect(() => {
        if (searchState === 'found') {
            const timer = setTimeout(() => setSearchState('arriving'), 2000);
            return () => clearTimeout(timer);
        }
        if (searchState === 'arriving') {
            const timer = setTimeout(() => setSearchState('arrived'), 3000);
            return () => clearTimeout(timer);
        }
        if (searchState === 'arrived' && driver) {
            const timer = setTimeout(() => {
                navigate(ROUTES.CUSTOMER.BOOK_TRACKING, {
                    state: { pickup, destination, cabType, fare, driver },
                });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [searchState, navigate, pickup, destination, cabType, fare]);

    const handleCancel = () => {
        navigate(ROUTES.CUSTOMER.BOOK_SELECT_CAB, {
            state: { pickup, destination },
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {/* Searching state */}
                {searchState === 'searching' && (
                    <motion.div
                        key="searching"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                    >
                        {/* Animated search indicator */}
                        <div className="relative w-40 h-40 mx-auto mb-8">
                            {/* Pulsing rings */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 rounded-full border-2 border-primary-400"
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.6,
                                        ease: 'easeOut',
                                    }}
                                />
                            ))}

                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Car className="w-10 h-10 text-primary-600" />
                                </motion.div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Finding your driver
                        </h2>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {wsConnected ? (
                                <Wifi className="w-4 h-4 text-success-500" />
                            ) : (
                                <WifiOff className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={cn(
                                "text-xs",
                                wsConnected ? "text-success-600" : "text-gray-400"
                            )}>
                                {wsConnected ? 'Live Connection' : 'Demo Mode'}
                            </span>
                        </div>
                        <p className="text-gray-500 mb-6">
                            Please wait while we connect you with a nearby driver
                        </p>

                        {/* Progress bar */}
                        <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 overflow-hidden">
                            <motion.div
                                className="h-full bg-primary-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${searchProgress}%` }}
                            />
                        </div>

                        {/* Trip summary */}
                        <Card padding="md" className="text-left mb-6">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-success-500" />
                                        <p className="text-sm text-gray-600 truncate">
                                            {pickup?.address || 'Pickup location'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-error-500" />
                                        <p className="text-sm text-gray-600 truncate">
                                            {destination?.address || 'Destination'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                        {formatCurrency(fare?.total || 250)}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {cabType || 'Economy'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Button variant="outline" onClick={handleCancel}>
                            Cancel Search
                        </Button>
                    </motion.div>
                )}

                {/* Driver found / arriving / arrived states */}
                {(searchState === 'found' || searchState === 'arriving' || searchState === 'arrived') && driver && (
                    <motion.div
                        key="found"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Status header */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                'text-center py-6 rounded-2xl mb-6',
                                searchState === 'found' && 'bg-primary-50',
                                searchState === 'arriving' && 'bg-info-50',
                                searchState === 'arrived' && 'bg-success-50'
                            )}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-white shadow-lg"
                            >
                                {searchState === 'found' && (
                                    <CheckCircle className="w-8 h-8 text-primary-600" />
                                )}
                                {searchState === 'arriving' && (
                                    <Car className="w-8 h-8 text-info-600" />
                                )}
                                {searchState === 'arrived' && (
                                    <CheckCircle className="w-8 h-8 text-success-600" />
                                )}
                            </motion.div>

                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {searchState === 'found' && 'Driver Found!'}
                                {searchState === 'arriving' && 'Driver is on the way'}
                                {searchState === 'arrived' && 'Driver has arrived!'}
                            </h2>
                            <p className="text-gray-600">
                                {searchState === 'found' && 'Your driver is being notified'}
                                {searchState === 'arriving' && `Arriving in ${driver.eta} minutes`}
                                {searchState === 'arrived' && 'Meet your driver at the pickup point'}
                            </p>
                        </motion.div>

                        {/* Driver card */}
                        <Card padding="lg" className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar
                                    size="xl"
                                    src={driver.photo}
                                    name={driver.name}
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {driver.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                            {driver.rating}
                                        </span>
                                        <span>•</span>
                                        <span>{driver.totalTrips} trips</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => window.open(`tel:${driver.phone}`)}
                                >
                                    <Phone className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Cab details */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-2xl">
                                    🚗
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {driver.cab.color} {driver.cab.make} {driver.cab.model}
                                    </p>
                                    <p className="text-sm font-mono text-gray-600">
                                        {driver.cab.registrationNumber}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Trip details */}
                        <Card padding="md" className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">Trip Details</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                    {cabType || 'Economy'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success-500" />
                                    <p className="text-sm text-gray-700 truncate flex-1">
                                        {pickup?.address || 'Pickup location'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-error-500" />
                                    <p className="text-sm text-gray-700 truncate flex-1">
                                        {destination?.address || 'Destination'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-gray-500">Total Fare</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(fare?.total || 250)}
                                </span>
                            </div>
                        </Card>

                        {/* Action buttons */}
                        {searchState === 'arrived' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={() => navigate(ROUTES.CUSTOMER.BOOK_TRACKING, {
                                        state: { pickup, destination, cabType, fare, driver },
                                    })}
                                >
                                    Start Trip
                                </Button>
                            </motion.div>
                        )}

                        {searchState !== 'arrived' && (
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={handleCancel}
                            >
                                Cancel Booking
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
