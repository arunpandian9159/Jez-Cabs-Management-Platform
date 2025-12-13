import { features, FeatureItem } from '../../pages/homeData';

export function FeaturesSection() {
    return (
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
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface FeatureCardProps {
    feature: FeatureItem;
}

function FeatureCard({ feature }: FeatureCardProps) {
    const Icon = feature.icon;

    return (
        <div
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
                <p className="text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-none" style={{ color: '#475569' }}>
                    {feature.description}
                </p>
            </div>
        </div>
    );
}
