import { Link } from 'react-router-dom';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import {
    Zap,
    Clock,
    Map,
    Shield,
    Search,
    CreditCard,
    Car,
    Star,
    Smartphone,
    Headphones,
    DollarSign,
    Users,
    BarChart3,
    Settings,
    CheckCircle,
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    Quote,
    Users2,
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { QuickBookingForm } from '@/features/booking';
import { ROUTES } from '@/shared/constants';


// Services data
const services = [
    {
        icon: Zap,
        title: 'Instant Rides',
        description: 'Book a cab in seconds and get picked up within minutes. Perfect for your immediate travel needs.',
        color: 'from-[#2563eb] to-[#1d4ed8]',
    },
    {
        icon: Clock,
        title: 'Flexible Rentals',
        description: 'Rent cabs for hours, days, or weeks. Choose your duration and enjoy the freedom of hassle-free travel.',
        color: 'from-[#0d9488] to-[#0f766e]',
    },
    {
        icon: Map,
        title: 'Plan Your Trips',
        description: 'Schedule rides in advance, plan multi-city tours, and customize your journey with complete flexibility.',
        color: 'from-[#3b82f6] to-[#0d9488]',
    },
    {
        icon: Shield,
        title: 'Safety First',
        description: 'Complete transparency with verified drivers, real-time tracking, and 24/7 support for your peace of mind.',
        color: 'from-[#14b8a6] to-[#2563eb]',
    },
];

// How it works steps
const steps = [
    {
        icon: Search,
        title: 'Choose Your Service',
        description: 'Select from instant rides, cab rentals, or trip planning based on your needs',
        number: '01',
    },
    {
        icon: CreditCard,
        title: 'Book & Pay Securely',
        description: 'Complete your booking with transparent pricing and secure payment options',
        number: '02',
    },
    {
        icon: Car,
        title: 'Get Picked Up',
        description: 'Track your driver in real-time and enjoy a comfortable, safe journey',
        number: '03',
    },
    {
        icon: Star,
        title: 'Rate Your Experience',
        description: 'Share your feedback to help us maintain the highest service standards',
        number: '04',
    },
];

// Features data
const features = [
    {
        icon: Shield,
        title: 'Complete Safety',
        description: 'All drivers verified with background checks and real-time tracking',
    },
    {
        icon: Clock,
        title: '24/7 Availability',
        description: 'Book rides anytime, anywhere with round-the-clock service',
    },
    {
        icon: DollarSign,
        title: 'Transparent Pricing',
        description: 'No hidden charges. Know the exact fare before you book',
    },
    {
        icon: Smartphone,
        title: 'Easy Booking',
        description: 'User-friendly interface for quick and hassle-free bookings',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Our support team is always ready to assist you',
    },
    {
        icon: Star,
        title: 'Quality Assurance',
        description: 'Highly rated drivers and well-maintained vehicles',
    },
];

// For Owners features
const ownerFeatures = [
    {
        icon: Car,
        title: 'Fleet Management',
        description: 'Add, manage, and track all your cabs from a single dashboard',
    },
    {
        icon: Users,
        title: 'Driver Management',
        description: 'Hire, assign, and monitor drivers with ease',
    },
    {
        icon: BarChart3,
        title: 'Analytics & Reports',
        description: 'Get detailed insights on earnings, trips, and performance',
    },
    {
        icon: Settings,
        title: 'Complete Control',
        description: 'Set pricing, availability, and manage bookings in real-time',
    },
];

const ownerBenefits = [
    'Maximize your fleet utilization',
    'Real-time driver tracking',
    'Automated payment processing',
    '24/7 booking management',
    'Verified driver network',
    'Instant notifications',
];

// Fleet Options
const fleetOptions = [
    {
        id: 1,
        name: 'Economy',
        description: 'Budget-friendly rides for everyday travel',
        capacity: '4 Passengers',
        price: 'From $8/km',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
        id: 2,
        name: 'Premium',
        description: 'Comfortable sedans for business travel',
        capacity: '4 Passengers',
        price: 'From $12/km',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'
    },
    {
        id: 3,
        name: 'SUV',
        description: 'Spacious rides for family trips',
        capacity: '6 Passengers',
        price: 'From $15/km',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
    },
    {
        id: 4,
        name: 'Luxury',
        description: 'Premium experience for special occasions',
        capacity: '4 Passengers',
        price: 'From $25/km',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400'
    }
];

// Testimonials
const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Business Traveler',
        content: 'Jez Cabs has transformed my daily commute. The drivers are professional and the cars are always clean. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Frequent Traveler',
        content: 'The booking process is seamless and the pricing is transparent. No more haggling with taxi drivers!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Fleet Owner',
        content: 'As a fleet owner, the dashboard helps me manage my vehicles efficiently. Great analytics and revenue tracking!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
];

// Stats
const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '1000+', label: 'Verified Drivers' },
    { value: '100+', label: 'Cities Covered' },
    { value: '5M+', label: 'Trips Completed' },
];


export function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative pt-8 pb-12 sm:pt-12 sm:pb-20 px-6 sm:px-6 lg:px-9 min-h-[85vh] sm:min-h-[90vh] flex items-center"
                style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 25%, #ffffff 50%, #f0fdfa 75%, #f8fafc 100%)'
                }}
            >
                {/* Animated Background Orbs - smaller on mobile */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 rounded-full opacity-40 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
                            animationDelay: '0s',
                            animationDuration: '8s'
                        }}
                    />
                    <div
                        className="absolute top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-30 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
                            animationDelay: '2s',
                            animationDuration: '10s'
                        }}
                    />
                    <div
                        className="absolute -bottom-10 sm:-bottom-20 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full opacity-35 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
                            animationDelay: '4s',
                            animationDuration: '7s'
                        }}
                    />
                    <div
                        className="absolute bottom-1/3 right-1/4 w-24 h-24 sm:w-48 sm:h-48 rounded-full opacity-25 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)',
                            animationDelay: '1s',
                            animationDuration: '9s'
                        }}
                    />
                </div>

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(#1e293b 1px, transparent 1px),
                            linear-gradient(90deg, #1e293b 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px sm:60px sm:60px'
                    }}
                />

                <div className="mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        {/* Left Content - Title and Animation */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Badge with animation - KEPT FULL SIZE */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-down shadow-md"
                                style={{
                                    background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                                    color: '#1d4ed8',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    animationDelay: '0.1s',
                                    animationFillMode: 'both'
                                }}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                #1 Cab Management Platform
                            </div>

                            {/* Main Heading - KEPT FULL SIZE */}
                            <h1
                                className="animate-fade-in-up"
                                style={{
                                    color: '#0f172a',
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    animationDelay: '0.2s',
                                    animationFillMode: 'both'
                                }}
                            >
                                Your Journey,
                                <span
                                    className="block mt-2"
                                    style={{ color: '#2563eb' }}
                                >
                                    Your Way
                                </span>
                            </h1>

                            {/* Animation - Below Title (Desktop Only) */}
                            <div
                                className="relative hidden lg:block animate-fade-in mt-4 lg:-ml-12"
                                style={{
                                    animationDelay: '0.3s',
                                    animationFillMode: 'both'
                                }}
                            >
                                {/* Background glow for animation */}
                                <div
                                    className="absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse"
                                    style={{
                                        background: 'radial-gradient(circle, #60a5fa 0%, transparent 60%)',
                                        transform: 'scale(0.8)'
                                    }}
                                />

                                <div className="relative w-full max-w-md rounded-3xl overflow-visible animate-float" style={{ animationDuration: '6s' }}>
                                    <DotLottiePlayer
                                        src="/Man waiting car.lottie"
                                        autoplay
                                        loop
                                        className="w-full h-full drop-shadow-2xl"
                                    />
                                </div>

                                {/* Floating cards around animation */}
                                <div
                                    className="absolute top-4 right-0 p-4 rounded-2xl shadow-xl animate-float-subtle"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>Ride Confirmed!</p>
                                            <p className="text-xs" style={{ color: '#64748b' }}>Driver arriving in 10 mins</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="absolute bottom-10 -left-4 p-4 rounded-2xl shadow-xl animate-float-subtle-delayed"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            <Car className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>10+ Cabs</p>
                                            <p className="text-xs" style={{ color: '#64748b' }}>Available nearby</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Quick Booking Form */}
                        <div
                            className="animate-fade-in-up mt-8 lg:mt-16 lg:ml-12"
                            style={{
                                animationDelay: '0.3s',
                                animationFillMode: 'both'
                            }}
                        >
                            <QuickBookingForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 2px 2px, #2563eb 1px, transparent 0)
                        `,
                        backgroundSize: '30px 30px sm:40px sm:40px'
                    }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header with Animation - COMPACT ON MOBILE */}
                    <div className="text-center mb-10 sm:mb-16 lg:mb-20">
                        <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-fade-in-down"
                            style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                color: '#1d4ed8',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                            }}
                        >
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                            What We Offer
                        </div>
                        <h2
                            className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6 animate-fade-in-up"
                            style={{
                                color: '#0f172a',
                                animationDelay: '0.1s',
                                animationFillMode: 'both'
                            }}
                        >
                            Our Services
                        </h2>
                        <p
                            className="text-sm sm:text-base lg:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
                            style={{
                                color: '#475569',
                                animationDelay: '0.2s',
                                animationFillMode: 'both'
                            }}
                        >
                            Whether you need a quick ride or want to rent a cab for days, we've got you covered with premium services tailored to your needs
                        </p>
                    </div>

                    {/* Services Grid with Staggered Animation - COMPACT ON MOBILE */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative animate-fade-in-up"
                                    style={{
                                        animationDelay: `${0.3 + index * 0.1}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {/* Card */}
                                    <div
                                        className="relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border transition-all duration-500 bg-white cursor-pointer h-full"
                                        style={{
                                            borderColor: '#e2e8f0',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)';
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.background = '#ffffff';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                                        }}
                                    >
                                        {/* Gradient Overlay on Hover */}
                                        <div
                                            className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(135deg, ${service.color.includes('2563eb') ? 'rgba(37, 99, 235, 0.03)' : 'rgba(13, 148, 136, 0.03)'} 0%, transparent 100%)`
                                            }}
                                        />

                                        {/* Icon and Title Row - Horizontal Layout */}
                                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4 lg:mb-5">
                                            {/* Icon Container */}
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${service.color} group-hover:scale-110 group-hover:rotate-3`}
                                                    style={{
                                                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                                                    }}
                                                >
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                                {/* Glow Effect */}
                                                <div
                                                    className={`absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
                                                />
                                            </div>

                                            {/* Title - Right of Icon */}
                                            <h3
                                                className="text-sm sm:text-base lg:text-lg font-bold transition-all duration-300"
                                                style={{
                                                    color: '#0f172a',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundImage = 'linear-gradient(135deg, #2563eb, #0d9488)';
                                                    e.currentTarget.style.webkitBackgroundClip = 'text';
                                                    e.currentTarget.style.backgroundClip = 'text';
                                                    e.currentTarget.style.webkitTextFillColor = 'transparent';
                                                    e.currentTarget.style.color = 'transparent';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundImage = 'none';
                                                    e.currentTarget.style.webkitTextFillColor = '#0f172a';
                                                    e.currentTarget.style.color = '#0f172a';
                                                }}
                                            >
                                                {service.title}
                                            </h3>
                                        </div>

                                        {/* Description - Below Icon and Title */}
                                        <div className="relative">
                                            <p
                                                className="text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-300 line-clamp-3 sm:line-clamp-none"
                                                style={{ color: '#475569' }}
                                            >
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Hover Arrow Indicator - HIDDEN ON MOBILE */}
                                        <div className="hidden sm:flex mt-4 lg:mt-6 items-center gap-2 text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span style={{ color: '#2563eb' }}>Learn more</span>
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#2563eb' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: '#2563eb' }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm lg:text-base text-blue-100">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdfa 100%)'
                }}
            >
                {/* Animated Background Orbs - SMALLER ON MOBILE */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-10 left-5 sm:top-20 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full opacity-20 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
                            animationDuration: '12s'
                        }}
                    />
                    <div
                        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full opacity-15 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
                            animationDuration: '10s',
                            animationDelay: '2s'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header - COMPACT ON MOBILE */}
                    <div className="text-center mb-10 sm:mb-16 lg:mb-20">
                        <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-fade-in-down"
                            style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                color: '#1d4ed8',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                            }}
                        >
                            <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                            Simple Process
                        </div>
                        <h2
                            className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6 animate-fade-in-up"
                            style={{
                                color: '#0f172a',
                                animationDelay: '0.1s',
                                animationFillMode: 'both'
                            }}
                        >
                            How It Works
                        </h2>
                        <p
                            className="text-sm sm:text-base lg:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
                            style={{
                                color: '#475569',
                                animationDelay: '0.2s',
                                animationFillMode: 'both'
                            }}
                        >
                            Getting started is simple. Follow these easy steps to book your ride and experience seamless travel
                        </p>
                    </div>

                    {/* Steps Grid - COMPACT ON MOBILE */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative animate-fade-in-up"
                                    style={{
                                        animationDelay: `${0.3 + index * 0.1}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {/* Animated Connector Line - HIDDEN ON MOBILE */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-24 left-full w-full h-1 z-0 overflow-hidden">
                                            {/* Base Line */}
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background: 'linear-gradient(to right, #e0f2fe, #ccfbf1)',
                                                    opacity: 0.3
                                                }}
                                            />
                                            {/* Animated Progress Line */}
                                            <div
                                                className="absolute inset-0 animate-progress-indeterminate"
                                                style={{
                                                    background: 'linear-gradient(to right, #2563eb, #0d9488)',
                                                    width: '25%',
                                                    animationDelay: `${index * 0.5}s`
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Step Card - COMPACT ON MOBILE */}
                                    <div
                                        className="group relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border transition-all duration-500 z-10 cursor-pointer h-full"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: '#e2e8f0',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.background = '#ffffff';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                                        }}
                                    >
                                        {/* Step Number Badge - SMALLER ON MOBILE */}
                                        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-5 lg:-right-5 z-20">
                                            <div
                                                className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 group-hover:scale-110"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                                                }}
                                            >
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon and Title Row - Horizontal Layout */}
                                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4 lg:mb-5">
                                            {/* Icon Container */}
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                                                    }}
                                                >
                                                    <Icon
                                                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-all duration-300 group-hover:scale-110"
                                                        style={{ color: '#1d4ed8' }}
                                                    />
                                                </div>
                                                {/* Icon Glow */}
                                                <div
                                                    className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                    }}
                                                />
                                            </div>

                                            {/* Title - Right of Icon */}
                                            <h3
                                                className="text-sm sm:text-base lg:text-lg font-bold transition-all duration-300"
                                                style={{
                                                    color: '#0f172a',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundImage = 'linear-gradient(135deg, #2563eb, #0d9488)';
                                                    e.currentTarget.style.webkitBackgroundClip = 'text';
                                                    e.currentTarget.style.backgroundClip = 'text';
                                                    e.currentTarget.style.webkitTextFillColor = 'transparent';
                                                    e.currentTarget.style.color = 'transparent';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundImage = 'none';
                                                    e.currentTarget.style.webkitTextFillColor = '#0f172a';
                                                    e.currentTarget.style.color = '#0f172a';
                                                }}
                                            >
                                                {step.title}
                                            </h3>
                                        </div>

                                        {/* Description - Below Icon and Title */}
                                        <div className="relative">
                                            <p
                                                className="text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-300 line-clamp-3 sm:line-clamp-none"
                                                style={{ color: '#475569' }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Progress Indicator - HIDDEN ON MOBILE */}
                                        <div className="hidden sm:flex mt-4 lg:mt-6 items-center gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-1 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: i === index ? '24px' : '8px',
                                                        background: i === index
                                                            ? 'linear-gradient(to right, #2563eb, #0d9488)'
                                                            : '#e2e8f0'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Button - COMPACT ON MOBILE */}
                    <div
                        className="text-center animate-fade-in-up"
                        style={{
                            animationDelay: '0.7s',
                            animationFillMode: 'both'
                        }}
                    >
                        <Link to={ROUTES.REGISTER}>
                            <button
                                className="group relative px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 text-white rounded-xl sm:rounded-2xl transition-all font-bold text-sm sm:text-base lg:text-lg inline-flex items-center gap-2 sm:gap-3 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                    boxShadow: '0 8px 30px rgba(37, 99, 235, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.3)';
                                }}
                            >
                                {/* Shimmer Effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 2s infinite'
                                    }}
                                />
                                <span className="relative z-10">Get Started Now</span>
                                <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-2" />
                            </button>
                        </Link>
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm" style={{ color: '#64748b' }}>
                            No credit card required • Free to start
                        </p>
                    </div>
                </div>
            </section>

            {/* Fleet Section */}
            <section id="fleet" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-10 sm:mb-14 lg:mb-16">
                        <span
                            className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 sm:mb-4"
                            style={{ color: '#2563eb' }}
                        >
                            OUR FLEET
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6"
                            style={{ color: '#0f172a' }}
                        >
                            Choose Your Perfect Ride
                        </h2>
                        <p
                            className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
                            style={{ color: '#475569' }}
                        >
                            From <span className="text-blue-600 font-medium">budget-friendly options</span> to{' '}
                            <span className="text-amber-600 font-medium">luxury vehicles</span>, we have the perfect cab for every journey.
                        </p>
                    </div>

                    {/* Fleet Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
                        {fleetOptions.map((option) => (
                            <div
                                key={option.id}
                                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
                            >
                                {/* Image */}
                                <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                                    <img
                                        src={option.image}
                                        alt={option.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Overlay with name */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                        <h3 className="text-white font-bold text-base sm:text-lg">{option.name}</h3>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-3 sm:p-4 lg:p-5">
                                    <p
                                        className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2"
                                        style={{ color: '#475569' }}
                                    >
                                        {option.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs sm:text-sm" style={{ color: '#64748b' }}>
                                            <Users2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{option.capacity}</span>
                                        </div>
                                        <span className="text-xs sm:text-sm font-bold" style={{ color: '#2563eb' }}>
                                            {option.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                        <Link to={ROUTES.REGISTER}>
                            <button
                                className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border-2 transition-all inline-flex items-center gap-2 font-medium text-sm sm:text-base group hover:bg-gray-50"
                                style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
                            >
                                View All Vehicles
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section - COMPACT ON MOBILE */}
            <section className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-4" style={{ color: '#0f172a' }}>
                            Why Choose Jez Cabs?
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
                            We're committed to providing the best cab management experience
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-row items-start gap-2 sm:gap-4 p-3 sm:p-4 lg:p-6 rounded-xl transition-all duration-300"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to bottom right, #eff6ff, #f0fdfa)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: 'linear-gradient(to bottom right, #2563eb, #0d9488)'
                                        }}
                                    >
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-0.5 sm:mb-1 lg:mb-2" style={{ color: '#0f172a' }}>
                                            {feature.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-none" style={{ color: '#475569' }}>{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* For Owners Section - COMPACT ON MOBILE */}
            <section
                id="for-owners"
                className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                }}
            >
                {/* Animated Background Elements - SMALLER ON MOBILE */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-10 left-5 sm:top-20 sm:left-10 w-36 h-36 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full opacity-20 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                            animationDuration: '8s'
                        }}
                    />
                    <div
                        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full opacity-15 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
                            animationDuration: '10s',
                            animationDelay: '2s'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                            <div
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-fade-in-down"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)',
                                    color: '#93c5fd',
                                    border: '1px solid rgba(147, 197, 253, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                                For Cab Owners
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight" style={{ color: '#ffffff' }}>
                                Manage Your Fleet
                                <span
                                    className="block mt-1 sm:mt-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Like Never Before
                                </span>
                            </h2>

                            <p style={{ color: '#e2e8f0' }} className="text-sm sm:text-base lg:text-lg leading-relaxed">
                                Take control of your cab business with our comprehensive management platform.
                                Track vehicles, manage drivers, and grow your revenue effortlessly.
                            </p>

                            {/* Enhanced Feature Cards - COMPACT ON MOBILE */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                                {ownerFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
                                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%)';
                                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)';
                                                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div className="flex flex-row items-start gap-2 sm:gap-3 lg:gap-4">
                                                <div
                                                    className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                                                    }}
                                                >
                                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold mb-0.5 sm:mb-1 lg:mb-1.5 text-xs sm:text-sm lg:text-base" style={{ color: '#f1f5f9' }}>
                                                        {feature.title}
                                                    </h4>
                                                    <p className="text-xs sm:text-xs lg:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none" style={{ color: '#cbd5e1' }}>
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link to={ROUTES.REGISTER}>
                                <button
                                    className="group px-5 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-white rounded-lg sm:rounded-xl transition-all font-semibold text-sm sm:text-base lg:text-lg inline-flex items-center gap-2 sm:gap-3 shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                        boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.4)';
                                    }}
                                >
                                    <span className="hidden sm:inline">Start Managing Your Fleet</span>
                                    <span className="sm:hidden">Start Now</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>

                        {/* Right Content - COMPACT ON MOBILE */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Key Benefits Card */}
                            <div
                                className="backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 hover:shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                                    <div
                                        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)'
                                        }}
                                    >
                                        <Star className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#ffffff' }}>Key Benefits</h3>
                                </div>
                                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                    {ownerBenefits.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-white/5"
                                        >
                                            <CheckCircle
                                                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0"
                                                style={{ color: '#2dd4bf' }}
                                            />
                                            <span className="text-xs sm:text-sm lg:text-base" style={{ color: '#e2e8f0' }}>
                                                {benefit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Book Drivers Card */}
                            <div
                                className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                    boxShadow: '0 10px 40px rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                {/* Animated background overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)'
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div
                                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <Users className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                                        </div>
                                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Book Drivers Separately</h4>
                                    </div>
                                    <p className="text-white/95 mb-4 sm:mb-5 lg:mb-6 leading-relaxed text-xs sm:text-sm lg:text-base">
                                        Need professional drivers for your fleet? Browse our network of verified,
                                        experienced drivers and hire them directly.
                                    </p>
                                    <Link to={ROUTES.REGISTER}>
                                        <button
                                            className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all inline-flex items-center gap-2 group/btn"
                                            style={{
                                                backgroundColor: '#ffffff',
                                                color: '#1d4ed8',
                                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                                            }}
                                        >
                                            Browse Drivers
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
                style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 50%, #eff6ff 100%)' }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-10 sm:mb-14 lg:mb-16">
                        <span
                            className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 sm:mb-4"
                            style={{ color: '#2563eb' }}
                        >
                            TESTIMONIALS
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl lg:text-5xl font-bold italic mb-3 sm:mb-4 lg:mb-6"
                            style={{ color: '#0f172a' }}
                        >
                            What Our Customers Say
                        </h2>
                        <p
                            className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
                            style={{ color: '#475569' }}
                        >
                            Real stories from real customers who trust us for their journeys.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-md transition-all duration-300 hover:shadow-xl"
                            >
                                {/* Quote Icon */}
                                <div
                                    className="absolute -top-3 right-5 sm:-top-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-3 sm:mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p
                                    className="text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed"
                                    style={{ color: '#475569' }}
                                >
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#0f172a' }}>
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm" style={{ color: '#2563eb' }}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section with Partner Cards */}
            <section
                className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
                style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#ffffff' }}>
                                Ready to Start Your{' '}
                                <span
                                    className="block"
                                    style={{
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Journey?
                                </span>
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8" style={{ color: '#94a3b8' }}>
                                Join thousands of happy customers who trust Jez Cabs for safe, reliable, and comfortable rides.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link to={ROUTES.REGISTER}>
                                    <button
                                        className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 group transition-all w-full sm:w-auto"
                                        style={{
                                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                            color: '#ffffff',
                                            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.3)';
                                        }}
                                    >
                                        Book Your Ride Now
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link to="/contact">
                                    <button
                                        className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto transition-all"
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '2px solid #475569',
                                            color: '#e2e8f0'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#60a5fa';
                                            e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#475569';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Contact Us
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Partner Cards */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {/* Become a Driver Card */}
                            <div
                                className="p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
                                    border: '1px solid rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: '#ffffff' }}>
                                    Become a Driver
                                </h3>
                                <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#94a3b8' }}>
                                    Join our network of professional drivers and earn on your own schedule.
                                </p>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="text-xs sm:text-sm font-semibold inline-flex items-center gap-1 group"
                                    style={{ color: '#60a5fa' }}
                                >
                                    Learn More
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Fleet Partner Card */}
                            <div
                                className="p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
                                    border: '1px solid rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: '#ffffff' }}>
                                    Fleet Partner
                                </h3>
                                <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#94a3b8' }}>
                                    Expand your fleet business with our comprehensive management tools.
                                </p>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="text-xs sm:text-sm font-semibold inline-flex items-center gap-1 group"
                                    style={{ color: '#60a5fa' }}
                                >
                                    Learn More
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: '#0f172a' }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
                        {/* Brand Column */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                <div
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-white">Jez Cabs</span>
                            </div>
                            <p className="text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs" style={{ color: '#94a3b8' }}>
                                Your trusted partner for safe, reliable, and comfortable cab services across the country.
                            </p>
                            {/* Contact Info */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">support@jezcabs.com</span>
                                </div>
                                <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">+1 (800) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">123 Main Street, NY 10001</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Company</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {['About Us', 'Careers', 'Blog', 'Press'].map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-xs sm:text-sm transition-colors hover:text-white"
                                            style={{ color: '#94a3b8' }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services Links */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Services</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {['One Way Trips', 'Round Trips', 'Car Rentals', 'Airport Transfer'].map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-xs sm:text-sm transition-colors hover:text-white"
                                            style={{ color: '#94a3b8' }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Support</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'].map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-xs sm:text-sm transition-colors hover:text-white"
                                            style={{ color: '#94a3b8' }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Partners Links */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Partners</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {['Become a Driver', 'Fleet Partners', 'Corporate', 'Affiliate Program'].map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-xs sm:text-sm transition-colors hover:text-white"
                                            style={{ color: '#94a3b8' }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-800 pt-6 sm:pt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Copyright */}
                            <p className="text-xs sm:text-sm" style={{ color: '#64748b' }}>
                                © 2025 Jez Cabs. All rights reserved.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: FaFacebook, href: '#' },
                                    { icon: FaTwitter, href: '#' },
                                    { icon: FaInstagram, href: '#' },
                                    { icon: FaLinkedin, href: '#' },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:bg-slate-700"
                                        style={{ backgroundColor: '#1e293b' }}
                                    >
                                        <social.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#94a3b8' }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
