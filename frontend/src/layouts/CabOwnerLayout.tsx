import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Car,
    Users,
    DollarSign,
    FileText,
    Settings,
    CheckCircle,
    Navigation,
    Wrench,
    XCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { Sidebar, NavItem, QuickStat } from './Sidebar/Sidebar';
import { Navbar } from './Navbar';
import { cabsService, CabStatistics } from '@/services/cabs.service';


const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard, end: true },
    { name: 'My Cabs', href: '/owner/cabs', icon: Car },
    { name: 'Drivers', href: '/owner/drivers', icon: Users },
    { name: 'Earnings', href: '/owner/earnings', icon: DollarSign },
    { name: 'Contracts', href: '/owner/contracts', icon: FileText },
    { name: 'Settings', href: '/owner/settings', icon: Settings },
];

export function CabOwnerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cabStats, setCabStats] = useState<CabStatistics>({
        total: 0,
        available: 0,
        onTrip: 0,
        maintenance: 0,
        inactive: 0,
    });
    const location = useLocation();
    const { user, logout } = useAuth();

    // Fetch cab statistics on mount
    useEffect(() => {
        const fetchCabStats = async () => {
            try {
                const stats = await cabsService.getStatistics();
                setCabStats(stats);
            } catch (error) {
                console.error('Failed to fetch cab statistics:', error);
            }
        };

        fetchCabStats();
    }, []);

    // Quick stats to show in sidebar
    const quickStats: QuickStat[] = [
        { icon: CheckCircle, label: 'Available', value: cabStats.available, color: 'success' },
        { icon: Navigation, label: 'On Trip', value: cabStats.onTrip, color: 'primary' },
        { icon: Wrench, label: 'Maintenance', value: cabStats.maintenance, color: 'warning' },
        { icon: XCircle, label: 'Inactive', value: cabStats.inactive, color: 'error' },
    ];

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
