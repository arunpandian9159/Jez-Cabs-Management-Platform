import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Car, Users, BarChart3, Shield, Zap, Headphones, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';


const features = [
  {
    icon: <Car className="h-12 w-12 text-blue-600" />,
    title: 'Fleet Management',
    description: 'Comprehensive cab fleet tracking and management system with real-time GPS monitoring, maintenance scheduling, and utilization analytics.',
    delay: 0,
  },
  {
    icon: <Users className="h-12 w-12 text-blue-600" />,
    title: 'Driver Management',
    description: 'Complete driver profiles, scheduling, performance tracking, and automated shift management for optimal fleet operations.',
    delay: 100,
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
    title: 'Analytics & Reports',
    description: 'Detailed insights and reporting for business intelligence with customizable dashboards and automated report generation.',
    delay: 200,
  },
  {
    icon: <Shield className="h-12 w-12 text-blue-600" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with reliable data management, encrypted communications, and comprehensive backup systems.',
    delay: 300,
  },
  {
    icon: <Zap className="h-12 w-12 text-blue-600" />,
    title: 'Real-time Updates',
    description: 'Live tracking and instant notifications for all operations with push notifications and real-time status updates.',
    delay: 400,
  },
  {
    icon: <Headphones className="h-12 w-12 text-blue-600" />,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and maintenance with dedicated account managers and priority response times.',
    delay: 500,
  },
];

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-teal-600 text-white py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-scale-in mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-white/15 backdrop-blur-xl border-2 border-white/20 shadow-2xl text-4xl md:text-6xl mb-8">
                🚕
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                Jez Cabs Management Platform
              </h1>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-lg md:text-xl mb-10 opacity-95 max-w-4xl mx-auto leading-relaxed font-light">
                Streamline your cab business operations with our comprehensive management platform.
                Manage fleets, drivers, bookings, and analytics all in one place.
              </p>
            </div>

            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 justify-center mb-12" style={{ animationDelay: '0.6s' }}>
              <Button
                asChild
                className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl shadow-2xl hover:bg-gray-50 hover:-translate-y-1 hover:shadow-3xl transition-all duration-300"
              >
                <RouterLink to="/login">
                  Get Started Free
                </RouterLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <RouterLink to="/register">
                  Sign Up Free
                </RouterLink>
              </Button>
            </div>

            <div className="animate-fade-in-up flex flex-wrap gap-4 justify-center mb-8" style={{ animationDelay: '0.8s' }}>
              {[
                { label: 'Fleet Management', icon: '🚗' },
                { label: 'Driver Tracking', icon: '👨‍🚗' },
                { label: 'Booking System', icon: '📅' },
                { label: 'Analytics', icon: '📊' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="px-4 py-2 bg-white/15 text-white font-medium border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
                >
                  {chip.icon} {chip.label}
                </div>
              ))}
            </div>

            <div className="animate-fade-in-up mt-12" style={{ animationDelay: '1s' }}>
              <p className="text-white/80 mb-4">
                Trusted by 500+ cab operators worldwide
              </p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-white/80">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              Powerful Features for Modern Cab Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful cab business efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-fade-in-up group"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <Card className="h-full cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl border border-gray-200 hover:border-blue-300">
                  <CardContent className="flex-1 text-center p-8">
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 inline-flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-teal-600 text-white py-20 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
              Ready to Transform Your Cab Business?
            </h2>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg md:text-xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto">
              Join thousands of cab operators who trust Jez Cabs Management Platform to streamline their operations and boost profitability.
            </p>
          </div>

          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 justify-center mb-8" style={{ animationDelay: '0.4s' }}>
            <Button
              asChild
              className="px-10 py-5 text-xl font-bold bg-white text-blue-600 rounded-xl shadow-2xl hover:bg-gray-50 hover:-translate-y-2 hover:shadow-3xl transition-all duration-300"
            >
              <RouterLink to="/register">
                Start Free Trial
              </RouterLink>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-10 py-5 text-xl font-bold border-2 border-white text-white rounded-xl hover:bg-white/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <RouterLink to="/login">
                Sign In
              </RouterLink>
            </Button>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-white/80 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
