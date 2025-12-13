import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Map,
    Car,
    Clock,
    CreditCard,
    User,
    Shield,
    MapPin,
    Phone,
    X,
    AlertTriangle,
    Users,
    Siren,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from './Navbar';
import { Sidebar, NavItem } from './Sidebar/Sidebar';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';


// Navigation items for customer
const customerNavItems: NavItem[] = [
    { name: 'Dashboard', href: ROUTES.CUSTOMER.DASHBOARD, icon: Home },
    { name: 'Book a Ride', href: ROUTES.CUSTOMER.BOOK, icon: Map },
    { name: 'Tracking', href: ROUTES.CUSTOMER.BOOK_TRACKING, icon: MapPin },
    { name: 'Rentals', href: ROUTES.CUSTOMER.RENTALS, icon: Car },
    { name: 'Trip History', href: ROUTES.CUSTOMER.TRIPS, icon: Clock },
    { name: 'Payments', href: ROUTES.CUSTOMER.PAYMENTS, icon: CreditCard },
    { name: 'Profile', href: ROUTES.CUSTOMER.PROFILE, icon: User },
];

// Emergency contact options
const emergencyOptions = [
    {
        id: 'trusted',
        label: 'Trusted Contact',
        description: 'Call your emergency contact',
        icon: Users,
        phone: '+919876543210', // This would come from user settings
        color: 'bg-blue-500',
        hoverColor: 'hover:bg-blue-600',
    },
    {
        id: 'services',
        label: 'Emergency Services',
        description: 'Call ambulance (108)',
        icon: Phone,
        phone: '108',
        color: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
    },
    {
        id: 'police',
        label: 'Police',
        description: 'Call police (100)',
        icon: Siren,
        phone: '100',
        color: 'bg-red-600',
        hoverColor: 'hover:bg-red-700',
    },
];

export function CustomerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Get current page title
    const currentPageTitle = customerNavItems.find((item) =>
        location.pathname === item.href ||
        location.pathname.startsWith(item.href + '/')
    )?.name || 'Dashboard';

    // Handle emergency call
    const handleEmergencyCall = useCallback((phone: string) => {
        window.open(`tel:${phone}`);
        setShowEmergencyPopup(false);
        setIsCountdownActive(false);
        setCountdown(10);
        setSelectedEmergency(null);
    }, []);

    // Countdown effect
    useEffect(() => {
        if (isCountdownActive && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isCountdownActive && countdown === 0) {
            // Auto-call when countdown reaches 0
            const option = emergencyOptions.find(o => o.id === selectedEmergency);
            if (option) {
                handleEmergencyCall(option.phone);
            }
        }
    }, [isCountdownActive, countdown, selectedEmergency, handleEmergencyCall]);

    // Handle emergency option selection
    const handleEmergencySelect = (optionId: string) => {
        setSelectedEmergency(optionId);
        setIsCountdownActive(true);
        setCountdown(10);
    };

    // Cancel emergency
    const cancelEmergency = () => {
        setShowEmergencyPopup(false);
        setIsCountdownActive(false);
        setCountdown(10);
        setSelectedEmergency(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Emergency SOS Popup */}
            <AnimatePresence>
                {showEmergencyPopup && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                            onClick={cancelEmergency}
                        />

                        {/* Popup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative">
                                    <button
                                        onClick={cancelEmergency}
                                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Emergency SOS</h2>
                                            <p className="text-white/80 text-sm">Select who to contact</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="p-6 space-y-3">
                                    {emergencyOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = selectedEmergency === option.id;

                                        return (
                                            <motion.button
                                                key={option.id}
                                                onClick={() => handleEmergencySelect(option.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center text-white`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-gray-900">{option.label}</p>
                                                    <p className="text-sm text-gray-500">{option.description}</p>
                                                </div>
                                                {isSelected && isCountdownActive && (
                                                    <div className="relative">
                                                        <svg className="w-12 h-12 transform -rotate-90">
                                                            <circle
                                                                cx="24"
                                                                cy="24"
                                                                r="20"
                                                                fill="none"
                                                                stroke="#fee2e2"
                                                                strokeWidth="4"
                                                            />
                                                            <circle
                                                                cx="24"
                                                                cy="24"
                                                                r="20"
                                                                fill="none"
                                                                stroke="#ef4444"
                                                                strokeWidth="4"
                                                                strokeDasharray={`${(countdown / 10) * 125.6} 125.6`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-red-600">
                                                            {countdown}
                                                        </span>
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6 space-y-3">
                                    {isCountdownActive && selectedEmergency && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center"
                                        >
                                            <p className="text-sm text-gray-600 mb-3">
                                                Calling in <span className="font-bold text-red-600">{countdown}</span> seconds...
                                            </p>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    fullWidth
                                                    onClick={cancelEmergency}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    fullWidth
                                                    onClick={() => {
                                                        const option = emergencyOptions.find(o => o.id === selectedEmergency);
                                                        if (option) handleEmergencyCall(option.phone);
                                                    }}
                                                >
                                                    Call Now
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                    {!isCountdownActive && (
                                        <p className="text-xs text-gray-400 text-center">
                                            Tap an option to start countdown. Your location will be shared with emergency services.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Unified Sidebar Component */}
            <Sidebar
                portalType="customer"
                portalLabel="Customer Portal"
                dashboardPath={ROUTES.CUSTOMER.DASHBOARD}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                navigation={customerNavItems}
                user={user}
                onLogout={logout}
                footerContent={
                    <Button
                        variant="danger"
                        fullWidth
                        leftIcon={<Shield className="w-4 h-4" />}
                        onClick={() => setShowEmergencyPopup(true)}
                    >
                        Emergency SOS
                    </Button>
                }
            />

            {/* Main content area */}
            <div className="lg:pl-72">
                <Navbar
                    variant="dashboard"
                    title={currentPageTitle}
                    onSidebarOpen={() => setSidebarOpen(true)}
                />

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
