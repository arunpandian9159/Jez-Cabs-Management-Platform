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
            <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                            Our Services
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
                            Whether you need a quick ride or want to rent a cab for days, we've got you covered
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl border transition-all duration-300 bg-white hover:shadow-xl"
                                    style={{
                                        borderColor: '#e2e8f0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.background = 'linear-gradient(to bottom right, #eff6ff, #f0fdfa)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.background = '#ffffff';
                                    }}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-gradient-to-br ${service.color}`}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3" style={{ color: '#0f172a' }}>
                                        {service.title}
                                    </h3>
                                    <p style={{ color: '#475569' }}>{service.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-20 px-4 sm:px-6 lg:px-8"
                style={{
                    background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #f0fdfa)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                            How It Works
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
                            Getting started is simple. Follow these easy steps to book your ride
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className="hidden lg:block absolute top-20 left-full w-full h-0.5 z-0"
                                            style={{
                                                background: 'linear-gradient(to right, #bfdbfe, #99f6e4)'
                                            }}
                                        />
                                    )}

                                    <div
                                        className="relative p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 z-10"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: '#e2e8f0'
                                        }}
                                    >
                                        <div
                                            className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                            style={{
                                                background: 'linear-gradient(to bottom right, #2563eb, #0d9488)'
                                            }}
                                        >
                                            {step.number}
                                        </div>

                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                                            style={{
                                                background: 'linear-gradient(to bottom right, #dbeafe, #ccfbf1)'
                                            }}
                                        >
                                            <Icon className="w-7 h-7" style={{ color: '#1d4ed8' }} />
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3" style={{ color: '#0f172a' }}>
                                            {step.title}
                                        </h3>
                                        <p style={{ color: '#475569' }}>{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to={ROUTES.REGISTER}>
                            <button
                                className="px-8 py-3 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                style={{
                                    background: 'linear-gradient(to right, #2563eb, #0d9488)'
                                }}
                            >
                                Get Started Now
                            </button>
                        </Link>
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
                className="py-20 px-4 sm:px-6 lg:px-8 text-white"
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div
                                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                                    color: '#93c5fd'
                                }}
                            >
                                For Cab Owners
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                Manage Your Fleet
                                <span
                                    className="block"
                                    style={{
                                        background: 'linear-gradient(to right, #60a5fa, #2dd4bf)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Like Never Before
                                </span>
                            </h2>

                            <p style={{ color: '#cbd5e1' }} className="text-lg">
                                Take control of your cab business with our comprehensive management platform.
                                Track vehicles, manage drivers, and grow your revenue effortlessly.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {ownerFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: 'linear-gradient(to bottom right, #2563eb, #0d9488)'
                                                }}
                                            >
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-sm" style={{ color: '#94a3b8' }}>{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link to={ROUTES.REGISTER}>
                                <button
                                    className="px-8 py-3 text-white rounded-lg transition-all font-medium hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(to right, #2563eb, #0d9488)',
                                        boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)'
                                    }}
                                >
                                    Start Managing Your Fleet
                                </button>
                            </Link>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-6">
                            <div
                                className="backdrop-blur-sm p-8 rounded-2xl"
                                style={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid #334155'
                                }}
                            >
                                <h3 className="text-xl font-bold text-white mb-6">Key Benefits</h3>
                                <div className="space-y-4">
                                    {ownerBenefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#2dd4bf' }} />
                                            <span style={{ color: '#cbd5e1' }}>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="p-8 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(to bottom right, #2563eb, #0d9488)'
                                }}
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Book Drivers Separately</h4>
                                <p className="text-white/90 mb-4">
                                    Need professional drivers for your fleet? Browse our network of verified,
                                    experienced drivers and hire them directly.
                                </p>
                                <Link to={ROUTES.REGISTER}>
                                    <button
                                        className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            color: '#1d4ed8'
                                        }}
                                    >
                                        Browse Drivers
                                    </button>
                                </Link>
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
