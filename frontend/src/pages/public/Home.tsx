import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    Zap,
    Globe,
    HeartHandshake,
    Play,
    Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ROUTES } from '../../lib/constants';
import { useRef } from 'react';

const features = [
    {
        icon: MapPin,
        title: 'Instant Booking',
        description: 'Book a cab instantly with real-time tracking and transparent pricing.',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Car,
        title: 'Cab Rentals',
        description: 'Rent cabs for hours, days, or weeks with flexible options.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: Clock,
        title: 'Trip Planning',
        description: 'Plan outstation trips with multiple stops and get competitive offers.',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: Shield,
        title: 'Safety First',
        description: 'SOS button, live tracking, and verified drivers for your safety.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: Users,
        title: 'Driver Community',
        description: 'Join our driver network and earn on your own schedule.',
        gradient: 'from-indigo-500 to-purple-500',
    },
    {
        icon: CreditCard,
        title: 'Easy Payments',
        description: 'Pay with cards, UPI, wallets, or cash. Your choice.',
        gradient: 'from-pink-500 to-rose-500',
    },
];

const stats = [
    { value: '10M+', label: 'Rides Completed', icon: Car },
    { value: '50K+', label: 'Active Drivers', icon: Users },
    { value: '100+', label: 'Cities Covered', icon: Globe },
    { value: '4.8', label: 'Average Rating', icon: Star },
];

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Regular Customer',
        content: 'Jez Cabs has completely transformed my daily commute. The drivers are professional and the app is super easy to use!',
        rating: 5,
        avatar: 'PS',
    },
    {
        name: 'Rahul Kumar',
        role: 'Business Traveler',
        content: 'I use Jez Cabs for all my airport transfers. Reliable, punctual, and the premium cabs are fantastic.',
        rating: 5,
        avatar: 'RK',
    },
    {
        name: 'Anita Patel',
        role: 'Frequent Traveler',
        content: 'The outstation trip feature is a game-changer. Planned my entire family trip with multiple stops seamlessly.',
        rating: 5,
        avatar: 'AP',
    },
];

export function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <div className="overflow-hidden bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient orbs */}
                    <motion.div
                        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-400/30 to-accent-400/20 dark:from-primary-500/20 dark:to-accent-500/10 blur-3xl"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent-400/30 to-primary-400/20 dark:from-accent-500/15 dark:to-primary-500/10 blur-3xl"
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary-300/10 to-accent-300/10 dark:from-primary-500/5 dark:to-accent-500/5 blur-3xl"
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary-400/40 dark:bg-primary-400/30"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 3) * 20}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="container mx-auto px-4 relative z-10"
                >
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
                        {/* Left content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 shadow-sm"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </motion.div>
                                Now available on iOS & Android
                                <Sparkles className="w-4 h-4 text-accent-500" />
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1]">
                                Your Ride,{' '}
                                <br className="hidden sm:block" />
                                Your Way,{' '}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                        Every Day
                                    </span>
                                    <motion.svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                    >
                                        <motion.path
                                            d="M2 7C50 2 150 2 198 7"
                                            stroke="url(#gradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#0d95e8" />
                                                <stop offset="100%" stopColor="#d946ef" />
                                            </linearGradient>
                                        </defs>
                                    </motion.svg>
                                </span>
                            </h1>

                            <motion.p
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Book instant rides, rent cabs for any duration, or plan trips with complete
                                transparency and safety. Join millions who trust Jez Cabs.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link to={ROUTES.REGISTER}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            size="lg"
                                            rightIcon={<ArrowRight className="w-5 h-5" />}
                                            className="w-full sm:w-auto bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 hover:from-primary-600 hover:via-primary-700 hover:to-accent-600 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 text-lg px-8 py-6"
                                        >
                                            Get Started Free
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link to={ROUTES.DRIVER_REGISTER}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            leftIcon={<Play className="w-5 h-5" />}
                                            className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-lg px-8 py-6"
                                        >
                                            Watch Demo
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                className="flex flex-col sm:flex-row items-center gap-6 mt-10 pt-10 border-t border-gray-200 dark:border-gray-700 justify-center lg:justify-start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className="flex -space-x-3">
                                    {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, x: -20 }}
                                            animate={{ scale: 1, x: 0 }}
                                            transition={{ delay: 0.8 + i * 0.1 }}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-3 border-white dark:border-gray-900 flex items-center justify-center text-white text-sm font-semibold shadow-lg"
                                        >
                                            {letter}
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center gap-1 text-warning-500 justify-center sm:justify-start">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 1 + i * 0.1 }}
                                            >
                                                <Star className="w-5 h-5 fill-current" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        <span className="font-bold text-gray-900 dark:text-white">4.8/5</span> from 50,000+ reviews
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right content - Hero visualization */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                {/* Main illustration circle */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                                >
                                    <div className="w-80 h-80 rounded-full border-2 border-dashed border-primary-200 dark:border-primary-800/50" />
                                </motion.div>

                                {/* Central car icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-72 h-72 rounded-3xl bg-gradient-to-br from-primary-100 via-white to-accent-100 dark:from-primary-900/40 dark:via-gray-800 dark:to-accent-900/40 flex items-center justify-center shadow-2xl"
                                        animate={{
                                            boxShadow: [
                                                '0 25px 50px -12px rgba(13, 149, 232, 0.25)',
                                                '0 25px 50px -12px rgba(217, 70, 239, 0.25)',
                                                '0 25px 50px -12px rgba(13, 149, 232, 0.25)',
                                            ],
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <Car className="w-28 h-28 text-primary-600 dark:text-primary-400" />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Floating cards */}
                                <motion.div
                                    className="absolute top-0 left-0 z-10"
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Card padding="md" variant="elevated" className="w-52 bg-white dark:bg-gray-800 shadow-xl border-0">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-lg shadow-success-500/30"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Driver Found</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Arriving in 4 mins</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-10 right-0 z-10"
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                >
                                    <Card padding="md" variant="elevated" className="w-52 bg-white dark:bg-gray-800 shadow-xl border-0">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
                                            >
                                                <MapPin className="w-6 h-6 text-white" />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">₹249</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">MG Road → Airport</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    className="absolute top-1/2 -right-8 z-10"
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                >
                                    <Card padding="sm" variant="elevated" className="bg-white dark:bg-gray-800 shadow-xl border-0">
                                        <div className="flex items-center gap-2 px-2">
                                            <Zap className="w-5 h-5 text-warning-500" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">Fast ETA</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center pt-2">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <motion.div
                                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <stat.icon className="w-8 h-8 text-primary-400" />
                                </motion.div>
                                <motion.p
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent"
                                    initial={{ scale: 0.5 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                >
                                    {stat.value}
                                </motion.p>
                                <p className="text-gray-400 mt-2 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white dark:bg-gray-950 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6"
                        >
                            <Zap className="w-4 h-4" />
                            Powerful Features
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Everything You Need for{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                Seamless Travel
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            From instant bookings to long-term rentals, we've got you covered with
                            features designed for your convenience and safety.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    padding="lg"
                                    className="h-full bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 group shadow-sm hover:shadow-xl transition-all duration-300"
                                    interactive
                                >
                                    <motion.div
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-sm font-medium mb-6"
                        >
                            <HeartHandshake className="w-4 h-4" />
                            Customer Love
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            What Our Customers{' '}
                            <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
                                Say About Us
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Card padding="lg" className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="flex items-center gap-1 text-warning-500 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />

                {/* Animated shapes */}
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/10 blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-400/20 blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Start Your Journey Today
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Experience the Future
                            <br />
                            of Transportation?
                        </h2>
                        <p className="text-white/80 mb-10 max-w-lg mx-auto text-lg">
                            Join millions of satisfied customers and experience seamless travel like never before.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to={ROUTES.REGISTER}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl text-lg px-8 py-6"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Create Free Account
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link to={ROUTES.LOGIN}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                                    >
                                        Sign In
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
