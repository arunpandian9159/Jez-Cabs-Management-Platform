import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { ROUTES } from '../../lib/constants';
import { AuthModal, useAuthModal } from '../auth';

const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: '/#services', label: 'Services' },
    { path: '/#how-it-works', label: 'How It Works' },
    { path: '/#for-owners', label: 'For Owners' },
];

export function PublicLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { modalType, openLogin, openRegister, closeModal, setModalType } = useAuthModal();
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

    const handleOpenLogin = () => {
        setMobileMenuOpen(false);
        openLogin();
    };

    const handleOpenRegister = () => {
        setMobileMenuOpen(false);
        openRegister();
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
                                        <ArrowRight className="w-4 h-4" />
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
            <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-400 mt-auto overflow-hidden">
                {/* Enhanced Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/10 to-blue-500/5 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-accent-500/10 to-teal-500/5 blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                </div>

                <div className="relative container mx-auto px-4 lg:px-8 py-20">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
                        {/* Company Info - Takes more space */}
                        <motion.div
                            className="lg:col-span-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Logo size="md" />
                                </motion.div>
                                <div>
                                    <span className="text-2xl font-bold text-white">Jez Cabs</span>
                                    <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">Your Trusted Ride</div>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-sm">
                                Your trusted partner for safe and reliable cab services. Available 24/7 across 100+ cities in India with premium vehicles and professional drivers.
                            </p>

                            {/* Contact Info with enhanced styling */}
                            <div className="space-y-4">
                                <motion.a
                                    href="tel:+911800123456"
                                    className="flex items-center gap-3 mb-0 text-sm group"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/20 transition-all duration-300">
                                        <Phone className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">+91 1800 123 4567</span>
                                </motion.a>
                                <motion.a
                                    href="mailto:support@jezcabs.com"
                                    className="flex items-center gap-3 mb-0 text-sm group"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/20 transition-all duration-300">
                                        <Mail className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">support@jezcabs.com</span>
                                </motion.a>
                                <motion.div
                                    className="flex items-center gap-3 mb-0 text-sm group"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/20 transition-all duration-300">
                                        <MapPin className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">Bangalore, India</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
                            <ul className="space-y-3.5 text-sm">
                                {['Book a Ride', 'Rent a Cab', 'Become a Driver', 'List Your Cab'].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to="/"
                                            className="group flex items-center gap-2 hover:text-white transition-all duration-200"
                                        >
                                            <ChevronRight className="w-4 h-4 text-primary-400 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Support */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
                            <ul className="space-y-3.5 text-sm">
                                {['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to="/"
                                            className="group flex items-center gap-2 hover:text-white transition-all duration-200"
                                        >
                                            <ChevronRight className="w-4 h-4 text-primary-400 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Newsletter & App Downloads */}
                        <motion.div
                            className="lg:col-span-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {/* Newsletter */}
                            <div className="mb-8">
                                <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Stay Updated</h4>
                                <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates</p>
                                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-sm"
                                    />
                                    <motion.button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Subscribe
                                    </motion.button>
                                </form>
                            </div>

                            {/* Social Media Links */}
                            <div>
                                <h5 className="text-white font-semibold mb-4 text-sm">Follow Us</h5>
                                <div className="flex items-center gap-3">
                                    {[
                                        { icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', label: 'Facebook' },
                                        { icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter' },
                                        { icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', label: 'Instagram' },
                                        { icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', label: 'LinkedIn' },
                                    ].map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href="#"
                                            className="w-10 h-10 rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-primary-500 hover:to-primary-600 flex items-center justify-center group transition-all duration-300"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                                <path d={social.icon} />
                                            </svg>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        className="border-t border-gray-800/50 pt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <p className="text-sm text-gray-500">
                                    © {new Date().getFullYear()} <span className="text-white font-semibold">Jez Cabs</span>. All rights reserved.
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <span>Made with</span>
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="text-red-500"
                                    >
                                        ❤️
                                    </motion.span>
                                    <span>in India</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                {['Terms', 'Privacy', 'Cookies', 'Sitemap'].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to="/"
                                            className="text-gray-500 hover:text-white transition-colors duration-200 relative group"
                                        >
                                            {item}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={modalType !== null}
                modalType={modalType}
                onClose={closeModal}
                onSwitchModal={setModalType}
            />
        </div>
    );
}
