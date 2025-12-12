import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    Map,
    Car,
    Clock,
    CreditCard,
    User,
    Shield,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Navbar } from './Navbar';
import { Sidebar, NavItem } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../lib/constants';

// Navigation items for customer
const customerNavItems: NavItem[] = [
    { name: 'Dashboard', href: ROUTES.CUSTOMER.DASHBOARD, icon: Home },
    { name: 'Book a Ride', href: ROUTES.CUSTOMER.BOOK, icon: Map },
    { name: 'Rentals', href: ROUTES.CUSTOMER.RENTALS, icon: Car },
    { name: 'Trip History', href: ROUTES.CUSTOMER.TRIPS, icon: Clock },
    { name: 'Payments', href: ROUTES.CUSTOMER.PAYMENTS, icon: CreditCard },
    { name: 'Profile', href: ROUTES.CUSTOMER.PROFILE, icon: User },
];

export function CustomerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Get current page title
    const currentPageTitle = customerNavItems.find((item) =>
        location.pathname === item.href ||
        location.pathname.startsWith(item.href + '/')
    )?.name || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50">
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
                        onClick={() => navigate('/customer/book/tracking')}
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
