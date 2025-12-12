import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Navigation,
    History,
    Wallet,
    User,
    Settings,
    Bell,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Sidebar, NavItem } from './Sidebar';
import { cn } from '../../lib/utils';
import { driverService } from '../../services';

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/driver', icon: LayoutDashboard, end: true },
    { name: 'Active Trip', href: '/driver/trip', icon: Navigation },
    { name: 'Trip History', href: '/driver/trips', icon: History },
    { name: 'Earnings', href: '/driver/earnings', icon: Wallet },
    { name: 'Profile', href: '/driver/profile', icon: User },
    { name: 'Settings', href: '/driver/settings', icon: Settings },
];

export function DriverLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Fetch driver profile to get initial online status
    useEffect(() => {
        const fetchDriverProfile = async () => {
            try {
                const profile = await driverService.getProfile();
                setIsOnline(profile.is_online || false);
            } catch (error) {
                console.error('Error fetching driver profile:', error);
            }
        };

        fetchDriverProfile();
    }, []);

    // Handle online/offline toggle with API call
    const handleToggleOnline = async () => {
        try {
            if (isOnline) {
                await driverService.goOffline();
                setIsOnline(false);
            } else {
                await driverService.goOnline();
                setIsOnline(true);
            }
        } catch (error) {
            console.error('Error toggling online status:', error);
            // Optionally show an error toast to the user
        }
    };

    // Get current page title
    const currentPageTitle = navigation.find((item) =>
        item.end ? location.pathname === item.href : location.pathname === item.href
    )?.name || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Unified Sidebar Component */}
            <Sidebar
                portalType="driver"
                portalLabel="Driver Portal"
                dashboardPath="/driver"
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                navigation={navigation}
                user={user}
                onLogout={logout}
                showOnlineToggle
                isOnline={isOnline}
                onToggleOnline={handleToggleOnline}
            />

            {/* Main content area */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Page title - shown on desktop */}
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {currentPageTitle}
                        </h1>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">
                        {/* Online status indicator - mobile */}
                        <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                            <span className={cn(
                                'w-2 h-2 rounded-full',
                                isOnline ? 'bg-success-500 animate-pulse' : 'bg-gray-400'
                            )} />
                            <span className="text-xs font-medium text-gray-600">
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Avatar
                                    size="sm"
                                    src={user?.avatar}
                                    name={user?.email || 'Driver'}
                                />
                                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg py-1"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user?.email?.split('@')[0] || 'Driver'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <a
                                                href="/driver/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </a>
                                            <a
                                                href="/driver/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </a>
                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={logout}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 w-full"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

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
