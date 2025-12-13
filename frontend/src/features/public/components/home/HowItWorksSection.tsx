import { Link } from 'react-router-dom';
import { Map, ArrowRight } from 'lucide-react';
import { steps, StepItem } from '../../pages/homeData';
import { ROUTES } from '@/shared/constants';

export function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdfa 100%)'
            }}
        >
            {/* Animated Background Orbs */}
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
                {/* Section Header */}
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

                {/* Steps Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} index={index} isLast={index === steps.length - 1} />
                    ))}
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
    );
}

interface StepCardProps {
    step: StepItem;
    index: number;
    isLast: boolean;
}

function StepCard({ step, index, isLast }: StepCardProps) {
    const Icon = step.icon;

    return (
        <div
            className="relative animate-fade-in-up"
            style={{
                animationDelay: `${0.3 + index * 0.1}s`,
                animationFillMode: 'both'
            }}
        >
            {/* Animated Connector Line - Desktop Only */}
            {!isLast && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-1 z-0 overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to right, #e0f2fe, #ccfbf1)',
                            opacity: 0.3
                        }}
                    />
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
                {/* Step Number Badge */}
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

                {/* Icon and Title Row */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4 lg:mb-5">
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
                        <div
                            className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                            }}
                        />
                    </div>

                    <h3
                        className="text-sm sm:text-base lg:text-lg font-bold transition-all duration-300"
                        style={{ color: '#0f172a' }}
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

                {/* Description */}
                <div className="relative">
                    <p
                        className="text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-300 line-clamp-3 sm:line-clamp-none"
                        style={{ color: '#475569' }}
                    >
                        {step.description}
                    </p>
                </div>

                {/* Progress Indicator */}
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
}
