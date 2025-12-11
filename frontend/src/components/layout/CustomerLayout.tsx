import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Home,
    Map,
    Car,
    Clock,
    CreditCard,
    User,
    LogOut,
    Bell,
    Settings,
    HelpCircle,
    ChevronDown,
    Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

import { ROUTES } from '../../lib/constants';

// Navigation items for customer
const customerNavItems = [
    { path: ROUTES.CUSTOMER.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.CUSTOMER.BOOK, label: 'Book a Ride', icon: Map },
    { path: ROUTES.CUSTOMER.RENTALS, label: 'Rentals', icon: Car },
    { path: ROUTES.CUSTOMER.TRIPS, label: 'Trip History', icon: Clock },
    { path: ROUTES.CUSTOMER.PAYMENTS, label: 'Payments', icon: CreditCard },
    { path: ROUTES.CUSTOMER.PROFILE, label: 'Profile', icon: User },
];

export function CustomerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                    <Link to={ROUTES.CUSTOMER.DASHBOARD} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Jez Cabs
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {customerNavItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            location.pathname.startsWith(item.path + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                )}
                            >
                                <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600 dark:text-primary-400' : '')} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Emergency Button */}
                <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        variant="danger"
                        fullWidth
                        leftIcon={<Shield className="w-4 h-4" />}
                        onClick={() => navigate('/customer/book/tracking')}
                    >
                        Emergency SOS
                    </Button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title - shown on desktop */}
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {customerNavItems.find((item) =>
                                location.pathname === item.path ||
                                location.pathname.startsWith(item.path + '/')
                            )?.label || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">

                        {/* Notifications */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full animate-pulse" />
                        </motion.button>

                        {/* Help */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Avatar
                                    size="sm"
                                    src={user?.avatar}
                                    name={`${user?.firstName} ${user?.lastName}`}
                                />
                                <ChevronDown className="w-4 h-4 text-gray-500" />
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
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg py-1"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user?.firstName} {user?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <Link
                                                to={ROUTES.CUSTOMER.PROFILE}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>

                                            <button
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>

                                            <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-950 w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
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
