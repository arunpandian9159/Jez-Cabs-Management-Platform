import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ROUTES } from '../../lib/constants';

const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: '/#features', label: 'Features' },
    { path: '/#pricing', label: 'Pricing' },
    { path: '/#contact', label: 'Contact' },
];

export function PublicLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="glass border-b border-white/10">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to={ROUTES.HOME} className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg"
                                >
                                    <Car className="w-6 h-6 text-white" />
                                </motion.div>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Jez Cabs
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            'text-sm font-medium transition-colors hover:text-primary-600',
                                            location.pathname === link.path
                                                ? 'text-primary-600'
                                                : 'text-gray-600 dark:text-gray-300'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Auth buttons */}
                            <div className="hidden md:flex items-center gap-3">
                                <Link to={ROUTES.LOGIN}>
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to={ROUTES.REGISTER}>
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
                    >
                        <nav className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                                <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" fullWidth>
                                        Login
                                    </Button>
                                </Link>
                                <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                                    <Button fullWidth>Get Started</Button>
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </header>

            {/* Main content */}
            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 mt-auto">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Company */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <Car className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">Jez Cabs</span>
                            </div>
                            <p className="text-sm">
                                Your trusted partner for safe and reliable cab services.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-white">Book a Ride</Link></li>
                                <li><Link to="/" className="hover:text-white">Rent a Cab</Link></li>
                                <li><Link to="/" className="hover:text-white">Become a Driver</Link></li>
                                <li><Link to="/" className="hover:text-white">List Your Cab</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-white">Help Center</Link></li>
                                <li><Link to="/" className="hover:text-white">Safety</Link></li>
                                <li><Link to="/" className="hover:text-white">Terms of Service</Link></li>
                                <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>support@jezcabs.com</li>
                                <li>+91 1800 123 4567</li>
                                <li>Bangalore, India</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                        <p>© {new Date().getFullYear()} Jez Cabs. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
