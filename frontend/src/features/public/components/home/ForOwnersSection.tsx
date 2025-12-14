import { Car, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';
import {
  ownerFeatures,
  ownerBenefits,
  FeatureItem,
} from '../../pages/homeData';
import { useAuthModal } from '@/features/auth';
import { SlideInButton } from '@/components/ui';

export function ForOwnersSection() {
  const { openRegister } = useAuthModal();

  return (
    <section
      id="for-owners"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-5 sm:top-20 sm:left-10 w-36 h-36 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full opacity-20 animate-float"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full opacity-15 animate-float"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            animationDuration: '10s',
            animationDelay: '2s',
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
                background:
                  'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)',
                color: '#93c5fd',
                border: '1px solid rgba(147, 197, 253, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Car className="w-3 h-3 sm:w-4 sm:h-4" />
              For Cab Owners
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#ffffff' }}
            >
              Manage Your Fleet
              <span
                className="block mt-1 sm:mt-2"
                style={{
                  background:
                    'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Like Never Before
              </span>
            </h2>

            <p
              style={{ color: '#e2e8f0' }}
              className="text-sm sm:text-base lg:text-lg leading-relaxed"
            >
              Take control of your cab business with our comprehensive
              management platform. Track vehicles, manage drivers, and grow your
              revenue effortlessly.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {ownerFeatures.map((feature, index) => (
                <OwnerFeatureCard key={index} feature={feature} />
              ))}
            </div>

            <div className="hidden sm:block">
              <SlideInButton
                text="Start Managing Your Fleet"
                onClick={openRegister}
                defaultBgColor="#ffffff"
                hoverBgColor="#2563eb"
                defaultTextColor="#2563eb"
                hoverTextColor="#ffffff"
                className="shadow-xl hover:shadow-2xl transition-shadow"
                icon={<ArrowRight className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Key Benefits Card */}
            <div
              className="backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 hover:shadow-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                  }}
                >
                  <Star className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h3
                  className="text-lg sm:text-xl lg:text-2xl font-bold"
                  style={{ color: '#ffffff' }}
                >
                  Key Benefits
                </h3>
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
                    <span
                      className="text-xs sm:text-sm lg:text-base"
                      style={{ color: '#e2e8f0' }}
                    >
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
                boxShadow: '0 10px 40px rgba(37, 99, 235, 0.3)',
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Users className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    Book Drivers Separately
                  </h4>
                </div>
                <p className="text-white/95 mb-4 sm:mb-5 lg:mb-6 leading-relaxed text-xs sm:text-sm lg:text-base">
                  Need professional drivers for your fleet? Browse our network
                  of verified, experienced drivers and hire them directly.
                </p>
                <SlideInButton
                  text="Browse Drivers"
                  onClick={openRegister}
                  defaultBgColor="#ffffff"
                  hoverBgColor="#1d4ed8"
                  defaultTextColor="#1d4ed8"
                  hoverTextColor="#ffffff"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                  icon={<ArrowRight className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface OwnerFeatureCardProps {
  feature: FeatureItem;
}

function OwnerFeatureCard({ feature }: OwnerFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className="group p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer"
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%)';
        e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)';
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
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
          }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4
            className="text-white font-bold mb-0.5 sm:mb-1 lg:mb-1.5 text-xs sm:text-sm lg:text-base"
            style={{ color: '#f1f5f9' }}
          >
            {feature.title}
          </h4>
          <p
            className="text-xs sm:text-xs lg:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none"
            style={{ color: '#cbd5e1' }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}
