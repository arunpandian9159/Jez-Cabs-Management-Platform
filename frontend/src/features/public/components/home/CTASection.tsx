import { Link } from 'react-router-dom';
import { Car, Users, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/shared/constants';

export function CTASection() {
    return (
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
    );
}
