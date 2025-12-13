import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import { CheckCircle, Car } from 'lucide-react';
import { QuickBookingForm } from '@/features/booking';

export function HeroSection() {
  return (
    <section
      className="relative pt-8 pb-12 sm:pt-12 sm:pb-20 px-6 sm:px-6 lg:px-9 min-h-[85vh] sm:min-h-[90vh] flex items-center"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eff6ff 25%, #ffffff 50%, #f0fdfa 75%, #f8fafc 100%)',
      }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 rounded-full opacity-40 animate-float"
          style={{
            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
            animationDelay: '0s',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
            animationDelay: '2s',
            animationDuration: '10s',
          }}
        />
        <div
          className="absolute -bottom-10 sm:-bottom-20 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full opacity-35 animate-float"
          style={{
            background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
            animationDelay: '4s',
            animationDuration: '7s',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 sm:w-48 sm:h-48 rounded-full opacity-25 animate-float"
          style={{
            background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)',
            animationDelay: '1s',
            animationDuration: '9s',
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
          backgroundSize: '40px 40px sm:60px sm:60px',
        }}
      />

      <div className="mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 lg:gap-20 items-start">
          {/* Left Content - Title and Animation */}
          <div className="space-y-4 sm:space-y-6">
            {/* Badge with animation */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-down shadow-md"
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                color: '#1d4ed8',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                animationDelay: '0.1s',
                animationFillMode: 'both',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              #1 Cab Management Platform
            </div>

            {/* Main Heading */}
            <h1
              className="animate-fade-in-up"
              style={{
                color: '#0f172a',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                animationDelay: '0.2s',
                animationFillMode: 'both',
              }}
            >
              Your Journey,
              <span className="block mt-2" style={{ color: '#2563eb' }}>
                Your Way
              </span>
            </h1>

            {/* Subheading - REDUCED SIZE ON MOBILE */}
            <p
              className="lg:hidden animate-fade-in-up text-sm sm:text-base lg:text-lg mb-0"
              style={{
                color: '#475569',
                lineHeight: 1.6,
                animationDelay: '0.3s',
                animationFillMode: 'both',
              }}
            >
              Book instant rides, rent cabs for any duration, or plan trips with
              complete transparency and safety. For cab owners, manage your
              fleet and drivers effortlessly.
            </p>

            {/* Animation - Below Title (Desktop Only) */}
            <div
              className="relative hidden lg:block animate-fade-in mt-4 lg:-ml-12"
              style={{
                animationDelay: '0.3s',
                animationFillMode: 'both',
              }}
            >
              {/* Background glow for animation */}
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse"
                style={{
                  background:
                    'radial-gradient(circle, #60a5fa 0%, transparent 60%)',
                  transform: 'scale(0.8)',
                }}
              />

              <div
                className="relative w-full max-w-md rounded-3xl overflow-visible animate-float"
                style={{ animationDuration: '6s' }}
              >
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
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#0f172a' }}
                    >
                      Ride Confirmed!
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      Driver arriving in 10 mins
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-10 -left-4 p-4 rounded-2xl shadow-xl animate-float-subtle-delayed"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#0f172a' }}
                    >
                      10+ Cabs
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      Available nearby
                    </p>
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
              animationFillMode: 'both',
            }}
          >
            <QuickBookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
