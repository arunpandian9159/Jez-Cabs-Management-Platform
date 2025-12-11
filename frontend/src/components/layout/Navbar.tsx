import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ChevronRight,
    Bell,
    Search,
    LogOut,
    Settings,
    User as UserIcon,
    HelpCircle,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import { ROUTES } from '../../lib/constants';
import { useAuthModal } from '../auth';
import { useAuth } from '../../contexts/AuthContext';

interface NavLink {
    path: string;
    label: string;
}

interface NavbarProps {
    variant?: 'public' | 'dashboard';
    title?: string;
    onSidebarOpen?: () => void;
    showSearch?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    publicLinks?: NavLink[]; // Only for public variant
}

export function Navbar({
    variant = 'public',
    title,
    onSidebarOpen,
    showSearch = false,
    searchQuery = '',
    onSearchChange,
    publicLinks = []
}: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { modalType, openLogin, openRegister, closeModal } = useAuthModal();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Handle scroll effect for public navbar
    useEffect(() => {
        if (variant !== 'public') return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [location]);

    // Close auth modal when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated && modalType !== null) {
            closeModal();
        }
    }, [isAuthenticated, modalType, closeModal]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        if (path.startsWith('/#')) {
            e.preventDefault();
            const elementId = path.replace('/#', '');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setMobileMenuOpen(false);
        }
    };

    const handleOpenLogin = () => {
        setMobileMenuOpen(false);
        openLogin();
    };

    const handleOpenRegister = () => {
        setMobileMenuOpen(false);
        openRegister();
    };

    // Public Navbar Content
    if (variant === 'public') {
        return (
            <motion.header
                className="fixed top-0 left-0 right-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div
                    className={cn(
                        'transition-all duration-500',
                        scrolled
                            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100'
                            : 'bg-transparent'
                    )}
                >
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* Logo */}
                            <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative"
                                >
                                    <Logo size="lg" className="drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300" />
                                </motion.div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                                        Jez Cabs
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase hidden md:block">
                                        Your Trusted Ride
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center">
                                <div className="flex items-center bg-gray-100/80 rounded-full p-1.5">
                                    {publicLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={(e) => handleNavClick(e, link.path)}
                                            className={cn(
                                                'relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full no-underline hover:no-underline hover:bg-[#0177c6] hover:text-white',
                                                location.pathname === link.path || (location.pathname === '/' && link.path.startsWith('/#'))
                                                    ? 'text-primary-700'
                                                    : 'text-gray-600'
                                            )}
                                        >
                                            {link.label}
                                            {location.pathname === link.path && (
                                                <motion.div
                                                    layoutId="activeNavPill"
                                                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </nav>

                            {/* Right side actions */}
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Auth buttons - Desktop */}
                                <div className="hidden md:flex items-center gap-3">
                                    <button
                                        onClick={handleOpenLogin}
                                        className="h-9 px-4 text-sm font-medium rounded-lg border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                                    >
                                        Sign In
                                    </button>
                                    <motion.button
                                        onClick={handleOpenRegister}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="h-9 px-6 text-sm font-medium rounded-lg text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                        style={{
                                            backgroundColor: '#0177c6',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025fa1'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0177c6'}
                                    >
                                        Get Started
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                {/* Mobile menu button */}
                                <motion.button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={cn(
                                        "lg:hidden p-2.5 rounded-xl transition-all duration-300",
                                        mobileMenuOpen
                                            ? "bg-primary-50 text-primary-600"
                                            : "hover:bg-gray-100 text-gray-700"
                                    )}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {mobileMenuOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <X className="w-6 h-6" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ rotate: 90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: -90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Menu className="w-6 h-6" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
                                <nav className="container mx-auto px-4 py-6 space-y-2">
                                    {publicLinks.map((link, index) => (
                                        <motion.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <Link
                                                to={link.path}
                                                onClick={(e) => handleNavClick(e, link.path)}
                                                className={cn(
                                                    'flex items-center justify-between py-3.5 px-4 rounded-xl transition-all no-underline hover:no-underline',
                                                    location.pathname === link.path
                                                        ? 'bg-primary-50 text-primary-600'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                )}
                                            >
                                                <span className="font-medium">{link.label}</span>
                                                <ChevronRight className="w-4 h-4 opacity-50" />
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        className="pt-4 mt-4 border-t border-gray-100 space-y-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                            onClick={handleOpenLogin}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            fullWidth
                                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                                            onClick={handleOpenRegister}
                                        >
                                            Get Started Free
                                        </Button>
                                    </motion.div>
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        );
    }

    // State for notifications panel
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Sample notifications (in a real app, these would come from an API)
    const notifications = [
        { id: 1, type: 'trip', title: 'Trip Completed', message: 'Your ride to Airport has been completed', time: '2 min ago', unread: true },
        { id: 2, type: 'promo', title: 'Special Offer!', message: 'Get 20% off on your next ride', time: '1 hour ago', unread: true },
        { id: 3, type: 'system', title: 'Payment Received', message: 'Your payment of ₹350 was successful', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    // Get role display info
    const getRoleInfo = (role?: string) => {
        switch (role) {
            case 'admin':
                return { label: 'Administrator', gradient: 'from-purple-500 to-indigo-600', bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
            case 'driver':
                return { label: 'Driver', gradient: 'from-green-500 to-emerald-600', bgColor: 'bg-green-100', textColor: 'text-green-700' };
            case 'cab_owner':
                return { label: 'Cab Owner', gradient: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
            case 'customer':
            default:
                return { label: 'Customer', gradient: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
        }
    };

    const roleInfo = getRoleInfo(user?.role);

    // Dashboard Navbar Content
    return (
        <header className="sticky top-0 z-30">
            {/* Gradient accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600" />

            <div className="flex items-center justify-between h-16 px-4 lg:px-6 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm shadow-gray-100/50">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button / Sidebar Toggle */}
                    <motion.button
                        onClick={onSidebarOpen}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(1, 119, 198, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        className="lg:hidden p-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </motion.button>

                    {/* Page title with gradient accent */}
                    <div className={`hidden ${showSearch ? 'sm:flex' : 'lg:flex'} items-center gap-3`}>
                        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-lg font-bold text-gray-900 tracking-tight"
                            >
                                {title || 'Dashboard'}
                            </motion.h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Welcome back, {user?.firstName || 'User'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Enhanced */}
                {showSearch && (
                    <motion.div
                        className="hidden sm:flex items-center flex-1 max-w-xl mx-4 lg:mx-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className={cn(
                            "relative w-full transition-all duration-300",
                            searchFocused && "transform scale-[1.02]"
                        )}>
                            <motion.div
                                className={cn(
                                    "absolute inset-0 rounded-xl transition-all duration-300",
                                    searchFocused
                                        ? "bg-gradient-to-r from-primary-500/20 to-primary-400/20 blur-xl"
                                        : "bg-transparent"
                                )}
                            />
                            <div className="relative">
                                <Search className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
                                    searchFocused ? "text-primary-500" : "text-gray-400"
                                )} />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className={cn(
                                        "w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300",
                                        "bg-gray-50/80 border-2 text-gray-900 placeholder-gray-400",
                                        "focus:outline-none",
                                        searchFocused
                                            ? "border-primary-400 bg-white shadow-lg shadow-primary-500/10"
                                            : "border-gray-200/80 hover:border-gray-300"
                                    )}
                                />
                                <div className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-400 font-medium transition-opacity",
                                    searchFocused ? "opacity-0" : "opacity-100"
                                )}>
                                    <span>⌘</span>
                                    <span>K</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Right section */}
                <div className="flex items-center gap-1 lg:gap-2 ml-auto">
                    {/* Help - mainly for customer, but useful for all */}
                    {user?.role === 'customer' && (
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(1, 119, 198, 0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2.5 rounded-xl transition-all duration-200 group"
                        >
                            <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Help Center
                            </span>
                        </motion.button>
                    )}

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(1, 119, 198, 0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative p-2.5 rounded-xl transition-all duration-200",
                                notificationsOpen && "bg-primary-50"
                            )}
                        >
                            <Bell className={cn(
                                "w-5 h-5 transition-colors",
                                notificationsOpen ? "text-primary-600" : "text-gray-500"
                            )} />
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Notifications Panel */}
                        <AnimatePresence>
                            {notificationsOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setNotificationsOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                        className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Bell className="w-4 h-4 text-primary-600" />
                                                    <span className="font-semibold text-gray-900">Notifications</span>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                                        {unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notification, index) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={cn(
                                                        "px-4 py-3 border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer",
                                                        notification.unread && "bg-primary-50/30"
                                                    )}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                            notification.type === 'trip' && "bg-green-100",
                                                            notification.type === 'promo' && "bg-orange-100",
                                                            notification.type === 'system' && "bg-blue-100"
                                                        )}>
                                                            {notification.type === 'trip' && <ChevronRight className="w-5 h-5 text-green-600" />}
                                                            {notification.type === 'promo' && <span className="text-lg">🎉</span>}
                                                            {notification.type === 'system' && <span className="text-lg">💳</span>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                                                                {notification.unread && (
                                                                    <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 truncate mt-0.5">{notification.message}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
                                            <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block h-8 w-px bg-gray-200 mx-2" />

                    {/* User menu - Enhanced */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            whileHover={{ backgroundColor: 'rgba(1, 119, 198, 0.05)' }}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-xl transition-all duration-200",
                                userMenuOpen && "bg-primary-50/50"
                            )}
                        >
                            {/* Avatar with status indicator */}
                            <div className="relative">
                                <Avatar
                                    size="sm"
                                    src={user?.avatar}
                                    name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>

                            {/* User info - Desktop only */}
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">
                                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                                </p>
                                <p className="text-xs text-gray-500">{roleInfo.label}</p>
                            </div>

                            <motion.div
                                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </motion.div>
                        </motion.button>

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
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                        className="absolute right-0 z-50 mt-2 w-72 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden"
                                    >
                                        {/* User Info Header */}
                                        <div className={`px-4 py-4 bg-gradient-to-r ${roleInfo.gradient} relative overflow-hidden`}>
                                            {/* Background decoration */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                                            </div>

                                            <div className="relative flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                        <Avatar
                                                            size="md"
                                                            src={user?.avatar}
                                                            name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                                                        />
                                                    </div>
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-bold text-white truncate">
                                                        {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                                                    </p>
                                                    <p className="text-sm text-white/80 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                                        {roleInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                to={user?.role === 'admin' ? '/admin/settings' : user?.role === 'driver' ? '/driver/profile' : user?.role === 'cab_owner' ? '/owner/settings' : '/customer/profile'}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                                    <UserIcon className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">My Profile</p>
                                                    <p className="text-xs text-gray-400">View and edit your profile</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                                            </Link>

                                            <Link
                                                to={user?.role === 'admin' ? '/admin/settings' : user?.role === 'driver' ? '/driver/settings' : user?.role === 'cab_owner' ? '/owner/settings' : '/customer/profile'}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                                    <Settings className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Settings</p>
                                                    <p className="text-xs text-gray-400">Manage your preferences</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                                            </Link>

                                            <Link
                                                to={user?.role === 'customer' ? '/customer/help' : '#'}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                                    <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Help & Support</p>
                                                    <p className="text-xs text-gray-400">Get help when you need it</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="p-2 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                }}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                                    <LogOut className="w-4 h-4 text-red-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium">Sign Out</p>
                                                    <p className="text-xs text-red-400">See you next time!</p>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
