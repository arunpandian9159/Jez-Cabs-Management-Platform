import { Zap, ArrowRight } from 'lucide-react';
import { services, ServiceItem } from '../../pages/homeData';

export function ServicesSection() {
    return (
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

                {/* Services Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface ServiceCardProps {
    service: ServiceItem;
    index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
    const Icon = service.icon;

    return (
        <div
            className="group relative animate-fade-in-up"
            style={{
                animationDelay: `${0.3 + index * 0.1}s`,
                animationFillMode: 'both'
            }}
        >
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

                {/* Icon and Title Row */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4 lg:mb-5">
                    <div className="relative flex-shrink-0">
                        <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${service.color} group-hover:scale-110 group-hover:rotate-3`}
                            style={{
                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div
                            className={`absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
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
                        {service.title}
                    </h3>
                </div>

                {/* Description */}
                <div className="relative">
                    <p
                        className="text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-300 line-clamp-3 sm:line-clamp-none"
                        style={{ color: '#475569' }}
                    >
                        {service.description}
                    </p>
                </div>

                {/* Hover Arrow Indicator */}
                <div className="hidden sm:flex mt-4 lg:mt-6 items-center gap-2 text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span style={{ color: '#2563eb' }}>Learn more</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#2563eb' }} />
                </div>
            </div>
        </div>
    );
}
