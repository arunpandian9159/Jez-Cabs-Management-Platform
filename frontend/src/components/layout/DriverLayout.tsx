import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Menu,
    X,
    Bell,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                    <Link to="/driver" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white">Jez Cabs</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Driver Portal</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Online Status Toggle */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <motion.button
                        onClick={() => setIsOnline(!isOnline)}
                        className={cn(
                            'w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300',
                            isOnline
                                ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400 border-2 border-success-200 dark:border-success-800'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <span className="flex items-center gap-2">
                            <Power className="w-5 h-5" />
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <span className={cn(
                            'w-3 h-3 rounded-full animate-pulse',
                            isOnline ? 'bg-success-500' : 'bg-gray-400'
                        )} />
                    </motion.button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                            >
                                <item.icon className={cn('w-5 h-5', isActive ? 'text-primary-600 dark:text-primary-400' : '')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar
                            size="md"
                            src={user?.avatar}
                            name={user?.email || 'Driver'}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                {user?.email?.split('@')[0] || 'Driver'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Page title - shown on desktop */}
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {navigation.find((item) => location.pathname === item.href)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">
                        {/* Online status indicator - mobile */}
                        <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                            <span className={cn(
                                'w-2 h-2 rounded-full',
                                isOnline ? 'bg-success-500 animate-pulse' : 'bg-gray-400'
                            )} />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg py-1"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user?.email?.split('@')[0] || 'Driver'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/driver/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/driver/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                                                <button
                                                    onClick={logout}
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
