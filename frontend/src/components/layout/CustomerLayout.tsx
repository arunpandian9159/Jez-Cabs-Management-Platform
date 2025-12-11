import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Home,
    Map,
    Car,
    Clock,
    CreditCard,
    User,
    Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Navbar } from './Navbar';

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
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 ">
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
                    'fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 ">
                    <Link to={ROUTES.CUSTOMER.DASHBOARD} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 ">
                            Jez Cabs
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 "
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
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 '
                                )}
                            >
                                <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600 ' : '')} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Emergency Button */}
                <div className="px-3 py-4 border-t border-gray-200 ">
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
                <Navbar
                    variant="dashboard"
                    title={customerNavItems.find((item) =>
                        location.pathname === item.path ||
                        location.pathname.startsWith(item.path + '/')
                    )?.label || 'Dashboard'}
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
