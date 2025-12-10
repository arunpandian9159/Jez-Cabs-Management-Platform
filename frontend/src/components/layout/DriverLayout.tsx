import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Navigation,
    History,
    Wallet,
    User,
    Settings,
    LogOut,
    Car,
    Power,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/driver', icon: LayoutDashboard },
    { name: 'Active Trip', href: '/driver/trip', icon: Navigation },
    { name: 'Trip History', href: '/driver/trips', icon: History },
    { name: 'Earnings', href: '/driver/earnings', icon: Wallet },
    { name: 'Profile', href: '/driver/profile', icon: User },
    { name: 'Settings', href: '/driver/settings', icon: Settings },
];

export function DriverLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-gray-200">
                    <Link to="/driver" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900">Jez Cabs</h1>
                            <p className="text-xs text-gray-500">Driver Portal</p>
                        </div>
                    </Link>
                </div>

                {/* User info */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size="lg"
                            src={user?.avatar}
                            name={user?.email || 'Driver'}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {user?.email?.split('@')[0] || 'Driver'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<Power className="w-4 h-4" />}
                        className="justify-start"
                    >
                        Go Online
                    </Button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
