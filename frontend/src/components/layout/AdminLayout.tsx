import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40',
                    sidebarOpen ? 'w-64' : 'w-20'
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">JC</span>
                            </div>
                            <span className="font-bold text-lg">Admin Portal</span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {sidebarOpen && item.badge && (
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
                        {sidebarOpen && (
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
            <div className={cn('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users, drivers, vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error-500" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
