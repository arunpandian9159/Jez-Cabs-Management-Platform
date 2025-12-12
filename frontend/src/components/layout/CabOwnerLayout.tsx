import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Car,
    Users,
    DollarSign,
    FileText,
    Settings,
    TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar, NavItem, QuickStat } from './Sidebar';
import { Navbar } from './Navbar';

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard, end: true },
    { name: 'My Cabs', href: '/owner/cabs', icon: Car },
    { name: 'Drivers', href: '/owner/drivers', icon: Users },
    { name: 'Earnings', href: '/owner/earnings', icon: DollarSign },
    { name: 'Contracts', href: '/owner/contracts', icon: FileText },
    { name: 'Settings', href: '/owner/settings', icon: Settings },
];

// Quick stats to show in sidebar
const quickStats: QuickStat[] = [
    { icon: Car, label: 'Cabs', value: 12, color: 'primary' },
    { icon: TrendingUp, label: 'Active', value: 8, color: 'success' },
];

export function CabOwnerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Get current page title
    const currentPageTitle = navigation.find((item) =>
        item.end ? location.pathname === item.href : location.pathname === item.href
    )?.name || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Unified Sidebar Component */}
            <Sidebar
                portalType="owner"
                portalLabel="Fleet Owner Portal"
                dashboardPath="/owner"
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                navigation={navigation}
                user={user}
                onLogout={logout}
                quickStats={quickStats}
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
