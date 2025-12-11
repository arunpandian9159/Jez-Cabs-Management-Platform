import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { ROUTES } from '../../lib/constants';

const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: '/#services', label: 'Services' },
    { path: '/#how-it-works', label: 'How It Works' },
    { path: '/#for-owners', label: 'For Owners' },
];

export function PublicLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

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

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
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
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={(e) => handleNavClick(e, link.path)}
                                            className={cn(
                                                'relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full',
                                                location.pathname === link.path || (location.pathname === '/' && link.path.startsWith('/#'))
                                                    ? 'text-primary-700'
                                                    : 'text-gray-600 hover:text-gray-900'
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
                                    <Link to={ROUTES.LOGIN}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 font-medium"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to={ROUTES.REGISTER}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                size="sm"
                                                rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                                                className="bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 text-white font-medium px-6"
                                            >
                                                Get Started
                                            </Button>
                                        </motion.div>
                                    </Link>
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
                                    {navLinks.map((link, index) => (
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
                                                    'flex items-center justify-between py-3.5 px-4 rounded-xl transition-all',
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
                                        <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                                            <Button
                                                variant="outline"
                                                fullWidth
                                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                                            <Button
                                                fullWidth
                                                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                                            >
                                                Get Started Free
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Main content */}
            <main className="pt-16 md:pt-20">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative bg-gray-900 text-gray-400 mt-auto overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/5 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-500/5 blur-3xl" />
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Company */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Logo size="md" />
                                <span className="text-xl font-bold text-white">Jez Cabs</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                                Your trusted partner for safe and reliable cab services. Available 24/7 across 100+ cities in India.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span>+91 1800 123 4567</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span>support@jezcabs.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span>Bangalore, India</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Book a Ride</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Rent a Cab</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Become a Driver</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">List Your Cab</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Help Center</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Safety</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Download App */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Get the App</h4>
                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-400">Download on the</div>
                                        <div className="text-sm font-semibold text-white">App Store</div>
                                    </div>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-400">Get it on</div>
                                        <div className="text-sm font-semibold text-white">Google Play</div>
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm">© {new Date().getFullYear()} Jez Cabs. All rights reserved.</p>
                            <div className="flex items-center gap-6 text-sm">
                                <Link to="/" className="hover:text-white transition-colors">Terms</Link>
                                <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
                                <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
