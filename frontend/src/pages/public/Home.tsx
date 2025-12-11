import { Link } from 'react-router-dom';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import {
    MapPin,
    Calendar,
    User,
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
} from 'lucide-react';
import { ROUTES } from '../../lib/constants';

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

export function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center"
                style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 25%, #ffffff 50%, #f0fdfa 75%, #f8fafc 100%)'
                }}
            >
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-40 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
                            animationDelay: '0s',
                            animationDuration: '8s'
                        }}
                    />
                    <div
                        className="absolute top-1/4 -right-20 w-96 h-96 rounded-full opacity-30 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
                            animationDelay: '2s',
                            animationDuration: '10s'
                        }}
                    />
                    <div
                        className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full opacity-35 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
                            animationDelay: '4s',
                            animationDuration: '7s'
                        }}
                    />
                    <div
                        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-25 animate-float"
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
                        backgroundSize: '60px 60px'
                    }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            {/* Badge with animation */}
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

                            {/* Main Heading with animated gradient */}
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

                            {/* Subheading */}
                            <p
                                className="max-w-xl animate-fade-in-up"
                                style={{
                                    color: '#475569',
                                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                    lineHeight: 1.7,
                                    animationDelay: '0.3s',
                                    animationFillMode: 'both'
                                }}
                            >
                                Book instant rides, rent cabs for any duration, or plan trips with complete
                                transparency and safety. For cab owners, manage your fleet and drivers effortlessly.
                            </p>

                            {/* Quick Booking Form with Glassmorphism */}
                            <div
                                className="p-6 sm:p-8 rounded-3xl shadow-2xl animate-fade-in-up group"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.85)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.05)',
                                    animationDelay: '0.4s',
                                    animationFillMode: 'both'
                                }}
                            >
                                <div className="space-y-4">
                                    {/* Pickup Location */}
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-md group/input"
                                        style={{
                                            backgroundColor: 'rgba(248, 250, 252, 0.8)',
                                            border: '1px solid #e2e8f0'
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#2563eb';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Where from?"
                                            className="bg-transparent flex-1 outline-none text-base font-medium placeholder:font-normal focus:outline-none focus:ring-0 border-none"
                                            style={{ color: '#0f172a', boxShadow: 'none' }}
                                        />
                                    </div>

                                    {/* Drop Location */}
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                                        style={{
                                            backgroundColor: 'rgba(248, 250, 252, 0.8)',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Where to?"
                                            className="bg-transparent flex-1 outline-none text-base font-medium placeholder:font-normal focus:outline-none focus:ring-0 border-none"
                                            style={{ color: '#0f172a', boxShadow: 'none' }}
                                        />
                                    </div>

                                    {/* Date and Passengers */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                                            style={{
                                                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                                                border: '1px solid #e2e8f0'
                                            }}
                                        >
                                            <Calendar className="w-5 h-5" style={{ color: '#2563eb' }} />
                                            <input
                                                type="date"
                                                className="bg-transparent flex-1 outline-none text-sm font-medium focus:outline-none focus:ring-0 border-none"
                                                style={{ color: '#0f172a', boxShadow: 'none' }}
                                            />
                                        </div>

                                        <div
                                            className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                                            style={{
                                                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                                                border: '1px solid #e2e8f0'
                                            }}
                                        >
                                            <User className="w-5 h-5" style={{ color: '#2563eb' }} />
                                            <select
                                                className="bg-transparent flex-1 outline-none text-sm font-medium cursor-pointer focus:outline-none focus:ring-0 border-none"
                                                style={{ color: '#0f172a', boxShadow: 'none' }}
                                            >
                                                <option>1 Passenger</option>
                                                <option>2 Passengers</option>
                                                <option>3 Passengers</option>
                                                <option>4+ Passengers</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Book Now Button */}
                                    <Link to={ROUTES.REGISTER} className="block">
                                        <button
                                            className="w-full py-4 text-white rounded-xl transition-all font-semibold text-lg group/btn relative overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                                            }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Book Now
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* Right Animation */}
                        <div
                            className="relative hidden lg:block animate-fade-in"
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

                            <div className="relative aspect-square rounded-3xl overflow-visible animate-float" style={{ animationDuration: '6s' }}>
                                <DotLottiePlayer
                                    src="/Man waiting car.lottie"
                                    autoplay
                                    loop
                                    className="w-full h-full drop-shadow-2xl"
                                />
                            </div>

                            {/* Floating cards around animation */}
                            <div
                                className="absolute -top-4 -right-4 p-4 rounded-2xl shadow-xl animate-float-subtle"
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
                                className="absolute bottom-10 -left-8 p-4 rounded-2xl shadow-xl animate-float-subtle-delayed"
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
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 2px 2px, #2563eb 1px, transparent 0)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header with Animation */}
                    <div className="text-center mb-20">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in-down"
                            style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                color: '#1d4ed8',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                            }}
                        >
                            <Zap className="w-4 h-4" />
                            What We Offer
                        </div>
                        <h2
                            className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up"
                            style={{
                                color: '#0f172a',
                                animationDelay: '0.1s',
                                animationFillMode: 'both'
                            }}
                        >
                            Our Services
                        </h2>
                        <p
                            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
                            style={{
                                color: '#475569',
                                animationDelay: '0.2s',
                                animationFillMode: 'both'
                            }}
                        >
                            Whether you need a quick ride or want to rent a cab for days, we've got you covered with premium services tailored to your needs
                        </p>
                    </div>

                    {/* Services Grid with Staggered Animation */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                                        className="relative p-8 rounded-3xl border transition-all duration-500 bg-white cursor-pointer h-full"
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
                                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(135deg, ${service.color.includes('2563eb') ? 'rgba(37, 99, 235, 0.03)' : 'rgba(13, 148, 136, 0.03)'} 0%, transparent 100%)`
                                            }}
                                        />

                                        {/* Icon Container */}
                                        <div className="relative mb-6">
                                            <div
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${service.color} group-hover:scale-110 group-hover:rotate-3`}
                                                style={{
                                                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                                                }}
                                            >
                                                <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                            {/* Glow Effect */}
                                            <div
                                                className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="relative">
                                            <h3
                                                className="text-xl font-bold mb-3 transition-all duration-300"
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
                                            <p
                                                className="leading-relaxed transition-colors duration-300"
                                                style={{ color: '#475569' }}
                                            >
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Hover Arrow Indicator */}
                                        <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span style={{ color: '#2563eb' }}>Learn more</span>
                                            <ArrowRight className="w-4 h-4" style={{ color: '#2563eb' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdfa 100%)'
                }}
            >
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
                            animationDuration: '12s'
                        }}
                    />
                    <div
                        className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
                            animationDuration: '10s',
                            animationDelay: '2s'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in-down"
                            style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                color: '#1d4ed8',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                            }}
                        >
                            <Map className="w-4 h-4" />
                            Simple Process
                        </div>
                        <h2
                            className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up"
                            style={{
                                color: '#0f172a',
                                animationDelay: '0.1s',
                                animationFillMode: 'both'
                            }}
                        >
                            How It Works
                        </h2>
                        <p
                            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
                            style={{
                                color: '#475569',
                                animationDelay: '0.2s',
                                animationFillMode: 'both'
                            }}
                        >
                            Getting started is simple. Follow these easy steps to book your ride and experience seamless travel
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
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
                                    {/* Animated Connector Line */}
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

                                    {/* Step Card */}
                                    <div
                                        className="group relative p-8 rounded-3xl border transition-all duration-500 z-10 cursor-pointer h-full"
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
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-5 -right-5 z-20">
                                            <div
                                                className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 group-hover:scale-110"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                                                }}
                                            >
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon Container */}
                                        <div className="relative mb-6">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                                style={{
                                                    background: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 100%)',
                                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                                                }}
                                            >
                                                <Icon
                                                    className="w-8 h-8 transition-all duration-300 group-hover:scale-110"
                                                    style={{ color: '#1d4ed8' }}
                                                />
                                            </div>
                                            {/* Icon Glow */}
                                            <div
                                                className="absolute inset-0 w-16 h-16 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"
                                                style={{
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="relative">
                                            <h3
                                                className="text-xl font-bold mb-3 transition-all duration-300"
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
                                            <p
                                                className="leading-relaxed transition-colors duration-300"
                                                style={{ color: '#475569' }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Progress Indicator */}
                                        <div className="mt-6 flex items-center gap-1">
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

                    {/* CTA Button */}
                    <div
                        className="text-center animate-fade-in-up"
                        style={{
                            animationDelay: '0.7s',
                            animationFillMode: 'both'
                        }}
                    >
                        <Link to={ROUTES.REGISTER}>
                            <button
                                className="group relative px-10 py-5 text-white rounded-2xl transition-all font-bold text-lg inline-flex items-center gap-3 overflow-hidden"
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
                                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </button>
                        </Link>
                        <p className="mt-4 text-sm" style={{ color: '#64748b' }}>
                            No credit card required • Free to start
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                            Why Choose Jez Cabs?
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
                            We're committed to providing the best cab management experience
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex gap-4 p-6 rounded-xl transition-all duration-300"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to bottom right, #eff6ff, #f0fdfa)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: 'linear-gradient(to bottom right, #2563eb, #0d9488)'
                                        }}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2" style={{ color: '#0f172a' }}>
                                            {feature.title}
                                        </h4>
                                        <p style={{ color: '#475569' }}>{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* For Owners Section */}
            <section
                id="for-owners"
                className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                }}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                            animationDuration: '8s'
                        }}
                    />
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 animate-float"
                        style={{
                            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
                            animationDuration: '10s',
                            animationDelay: '2s'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg animate-fade-in-down"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)',
                                    color: '#93c5fd',
                                    border: '1px solid rgba(147, 197, 253, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <Car className="w-4 h-4" />
                                For Cab Owners
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#ffffff' }}>
                                Manage Your Fleet
                                <span
                                    className="block mt-2"
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

                            <p style={{ color: '#e2e8f0' }} className="text-lg leading-relaxed">
                                Take control of your cab business with our comprehensive management platform.
                                Track vehicles, manage drivers, and grow your revenue effortlessly.
                            </p>

                            {/* Enhanced Feature Cards */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                {ownerFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group p-5 rounded-2xl transition-all duration-300 cursor-pointer"
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
                                            <div className="flex gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                                                    }}
                                                >
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold mb-1.5 text-base" style={{ color: '#f1f5f9' }}>
                                                        {feature.title}
                                                    </h4>
                                                    <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
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
                                    className="group px-8 py-4 text-white rounded-xl transition-all font-semibold text-lg inline-flex items-center gap-3 shadow-xl"
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
                                    Start Managing Your Fleet
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-6">
                            {/* Key Benefits Card */}
                            <div
                                className="backdrop-blur-xl p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)'
                                        }}
                                    >
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold" style={{ color: '#ffffff' }}>Key Benefits</h3>
                                </div>
                                <div className="space-y-4">
                                    {ownerBenefits.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                                        >
                                            <CheckCircle
                                                className="w-6 h-6 flex-shrink-0"
                                                style={{ color: '#2dd4bf' }}
                                            />
                                            <span className="text-base" style={{ color: '#e2e8f0' }}>
                                                {benefit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Book Drivers Card */}
                            <div
                                className="p-8 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl"
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
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white">Book Drivers Separately</h4>
                                    </div>
                                    <p className="text-white/95 mb-6 leading-relaxed text-base">
                                        Need professional drivers for your fleet? Browse our network of verified,
                                        experienced drivers and hire them directly.
                                    </p>
                                    <Link to={ROUTES.REGISTER}>
                                        <button
                                            className="px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2 group/btn"
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
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-3xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8, #0d9488)'
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
                                style={{ backgroundColor: '#ffffff' }}
                            />
                            <div
                                className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
                                style={{ backgroundColor: '#ffffff' }}
                            />
                        </div>

                        <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                                Join thousands of satisfied customers and cab owners who trust Jez Cabs
                                for their transportation needs
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to={ROUTES.REGISTER}>
                                    <button
                                        className="px-8 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2 group font-medium hover:bg-gray-100"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            color: '#1d4ed8'
                                        }}
                                    >
                                        Book Your First Ride
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link to={ROUTES.REGISTER}>
                                    <button
                                        className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium"
                                    >
                                        Register as Owner
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
