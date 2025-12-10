import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    MapPin,
    Car,
    Clock,
    Shield,
    Star,
    Users,
    CreditCard,
    Smartphone,
    CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ROUTES } from '../../lib/constants';

const features = [
    {
        icon: MapPin,
        title: 'Instant Booking',
        description: 'Book a cab instantly with real-time tracking and transparent pricing.',
    },
    {
        icon: Car,
        title: 'Cab Rentals',
        description: 'Rent cabs for hours, days, or weeks with flexible options.',
    },
    {
        icon: Clock,
        title: 'Trip Planning',
        description: 'Plan outstation trips with multiple stops and get competitive offers.',
    },
    {
        icon: Shield,
        title: 'Safety First',
        description: 'SOS button, live tracking, and verified drivers for your safety.',
    },
    {
        icon: Users,
        title: 'Driver Community',
        description: 'Join our driver network and earn on your own schedule.',
    },
    {
        icon: CreditCard,
        title: 'Easy Payments',
        description: 'Pay with cards, UPI, wallets, or cash. Your choice.',
    },
];

const stats = [
    { value: '10M+', label: 'Rides Completed' },
    { value: '50K+', label: 'Active Drivers' },
    { value: '100+', label: 'Cities Covered' },
    { value: '4.8', label: 'Average Rating' },
];

export function Home() {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center gradient-mesh">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-400/20 blur-3xl"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-accent-400/20 blur-3xl"
                        animate={{
                            x: [0, -30, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
                            >
                                <Smartphone className="w-4 h-4" />
                                Now available on iOS & Android
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Your Ride, Your Way,{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Every Day
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Book instant rides, rent cabs for any duration, or plan trips with complete
                                transparency and safety. Join millions who trust Jez Cabs.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to={ROUTES.REGISTER}>
                                    <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to={ROUTES.DRIVER_REGISTER}>
                                    <Button variant="outline" size="lg">
                                        Become a Driver
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                                        >
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="flex items-center gap-1 text-warning-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-gray-900">4.8/5</span> from 50,000+ reviews
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right content - Hero image/animation */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full aspect-square">
                                {/* Floating cards */}
                                <motion.div
                                    className="absolute top-10 left-10 z-10"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Card padding="md" variant="elevated" className="w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-success-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Driver Found</p>
                                                <p className="text-xs text-gray-500">Arriving in 4 mins</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-20 right-0 z-10"
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                >
                                    <Card padding="md" variant="elevated" className="w-52">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">₹249</p>
                                                <p className="text-xs text-gray-500">MG Road → Airport</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Central illustration placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                                        <Car className="w-32 h-32 text-primary-600" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-gray-400 mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                Seamless Travel
                            </span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            From instant bookings to long-term rentals, we've got you covered with
                            features designed for your convenience and safety.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    padding="lg"
                                    className="h-full hover:border-primary-200 group"
                                    interactive
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                                        <feature.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-lg mx-auto">
                            Join millions of satisfied customers and experience the future of transportation.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to={ROUTES.REGISTER}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                >
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link to={ROUTES.LOGIN}>
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
