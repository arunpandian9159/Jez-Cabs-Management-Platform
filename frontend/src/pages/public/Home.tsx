import { Link } from 'react-router-dom';
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
                className="pt-24 pb-16 px-4 sm:px-6 lg:px-8"
                style={{
                    background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #f0fdfa)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div
                                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: '#dbeafe',
                                    color: '#1d4ed8'
                                }}
                            >
                                #1 Cab Management Platform
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#0f172a' }}>
                                Your Journey,
                                <span
                                    className="block"
                                    style={{
                                        background: 'linear-gradient(to right, #2563eb, #0d9488)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Your Way
                                </span>
                            </h1>

                            <p className="text-lg max-w-xl" style={{ color: '#475569' }}>
                                Book instant rides, rent cabs for any duration, or plan trips with complete
                                transparency and safety. For cab owners, manage your fleet and drivers effortlessly.
                            </p>

                            {/* Quick Booking Form */}
                            <div
                                className="p-6 rounded-2xl shadow-xl"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #f1f5f9'
                                }}
                            >
                                <div className="space-y-4">
                                    <div
                                        className="flex items-center gap-3 p-3 rounded-lg"
                                        style={{ backgroundColor: '#f8fafc' }}
                                    >
                                        <MapPin className="w-5 h-5" style={{ color: '#2563eb' }} />
                                        <input
                                            type="text"
                                            placeholder="Pickup Location"
                                            className="bg-transparent flex-1 outline-none"
                                            style={{ color: '#0f172a' }}
                                        />
                                    </div>

                                    <div
                                        className="flex items-center gap-3 p-3 rounded-lg"
                                        style={{ backgroundColor: '#f8fafc' }}
                                    >
                                        <MapPin className="w-5 h-5" style={{ color: '#0d9488' }} />
                                        <input
                                            type="text"
                                            placeholder="Drop Location"
                                            className="bg-transparent flex-1 outline-none"
                                            style={{ color: '#0f172a' }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className="flex items-center gap-3 p-3 rounded-lg"
                                            style={{ backgroundColor: '#f8fafc' }}
                                        >
                                            <Calendar className="w-5 h-5" style={{ color: '#2563eb' }} />
                                            <input
                                                type="date"
                                                className="bg-transparent flex-1 outline-none"
                                                style={{ color: '#0f172a' }}
                                            />
                                        </div>

                                        <div
                                            className="flex items-center gap-3 p-3 rounded-lg"
                                            style={{ backgroundColor: '#f8fafc' }}
                                        >
                                            <User className="w-5 h-5" style={{ color: '#2563eb' }} />
                                            <select
                                                className="bg-transparent flex-1 outline-none"
                                                style={{ color: '#0f172a' }}
                                            >
                                                <option>1 Passenger</option>
                                                <option>2 Passengers</option>
                                                <option>3 Passengers</option>
                                                <option>4+ Passengers</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Link to={ROUTES.REGISTER}>
                                        <button
                                            className="w-full py-3 text-white rounded-lg transition-all font-medium hover:shadow-lg"
                                            style={{
                                                background: 'linear-gradient(to right, #2563eb, #0d9488)'
                                            }}
                                        >
                                            Book Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Video */}
                        <div className="relative hidden lg:block">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src="/Man waiting car.webm" type="video/webm" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Floating Stats */}
                            <div
                                className="absolute -bottom-6 -left-6 p-5 rounded-2xl shadow-xl backdrop-blur-sm"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                            >
                                <div className="text-2xl font-bold" style={{ color: '#2563eb' }}>50K+</div>
                                <p className="text-sm font-medium" style={{ color: '#475569' }}>Happy Customers</p>
                            </div>

                            <div
                                className="absolute -top-6 -right-6 p-5 rounded-2xl shadow-xl backdrop-blur-sm"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                            >
                                <div className="text-2xl font-bold" style={{ color: '#0d9488' }}>1000+</div>
                                <p className="text-sm font-medium" style={{ color: '#475569' }}>Active Drivers</p>
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
