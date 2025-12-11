import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Car,
    AlertTriangle,
    Settings,
    LogOut,
    BarChart3,
    Shield,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/drivers', icon: Car, label: 'Drivers' },
    { path: '/admin/cabs', icon: Car, label: 'Vehicles' },
    { path: '/admin/disputes', icon: AlertTriangle, label: 'Disputes', badge: 5 },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/verification', icon: Shield, label: 'Verification' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
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
                    'fixed left-0 top-0 h-full bg-gray-900 dark:bg-gray-900 text-white transition-all duration-300 z-40',
                    // Mobile: full width sidebar that slides in/out
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    // Desktop: expandable sidebar
                    'lg:translate-x-0',
                    sidebarExpanded ? 'lg:w-64' : 'lg:w-20'
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {(sidebarExpanded || sidebarOpen) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">JC</span>
                            </div>
                            <span className="font-bold text-lg">Admin Portal</span>
                        </motion.div>
                    )}
                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {/* Desktop expand/collapse button */}
                    <button
                        onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        className="hidden lg:block p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {sidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {(sidebarExpanded || sidebarOpen) && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {(sidebarExpanded || sidebarOpen) && item.badge && (
                                <Badge variant="error" size="sm">
                                    {item.badge}
                                </Badge>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <Avatar size="sm" name={user ? `${user.firstName} ${user.lastName}` : 'Admin'} />
                        {(sidebarExpanded || sidebarOpen) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </motion.div>
                        )}
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn('transition-all duration-300', sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20')}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Search */}
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users, drivers, vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Page title - mobile */}
                    <div className="lg:hidden">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {navItems.find((item) => item.end ? location.pathname === item.path : location.pathname.startsWith(item.path))?.label || 'Admin'}
                        </h1>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2 lg:gap-4">

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error-500" />
                        </button>

                        {/* User menu */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Avatar
                                    size="sm"
                                    name={user ? `${user.firstName} ${user.lastName}` : 'Admin'}
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
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg py-1"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <NavLink
                                                to="/admin/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </NavLink>
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

                {/* Page Content */}
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
