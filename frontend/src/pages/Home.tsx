import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Car, Users, BarChart3, Shield, Zap, Headphones, Star, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const features = [
  {
    icon: <Car className="h-8 w-8" />,
    title: 'Fleet Management',
    description: 'Comprehensive cab fleet tracking with real-time GPS monitoring, maintenance scheduling, and utilization analytics.',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Driver Management',
    description: 'Complete driver profiles, scheduling, performance tracking, and automated shift management for optimal operations.',
    gradient: 'from-violet-500 to-purple-500',
    delay: 100,
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Analytics & Reports',
    description: 'Detailed insights and business intelligence with customizable dashboards and automated report generation.',
    gradient: 'from-orange-500 to-amber-500',
    delay: 200,
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with encrypted communications, comprehensive backups, and 99.9% uptime guarantee.',
    gradient: 'from-emerald-500 to-teal-500',
    delay: 300,
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Real-time Updates',
    description: 'Live tracking and instant notifications with push alerts and real-time status updates across all devices.',
    gradient: 'from-pink-500 to-rose-500',
    delay: 400,
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: '24/7 Support',
    description: 'Round-the-clock technical support with dedicated account managers and priority response times.',
    gradient: 'from-indigo-500 to-blue-500',
    delay: 500,
  },
];

const stats = [
  { value: '500+', label: 'Active Operators', icon: '🏢' },
  { value: '10K+', label: 'Vehicles Managed', icon: '🚗' },
  { value: '99.9%', label: 'Uptime Guaranteed', icon: '⚡' },
  { value: '24/7', label: 'Customer Support', icon: '💬' },
];

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in-up overflow-hidden">
      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent opacity-60" />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Floating badge */}
            <div className="animate-fade-in-up mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium animate-pulse-glow">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>The #1 Cab Management Platform</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Logo */}
            <div className="animate-scale-in mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-teal-500 backdrop-blur-xl border-2 border-white/30 shadow-2xl text-5xl md:text-7xl mb-8 animate-float hover:scale-110 transition-transform duration-500">
                🚕
              </div>
            </div>

            {/* Main heading */}
            <div className="animate-fade-in-up stagger-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight text-white">
                <span className="block">Jez Cabs</span>
                <span className="block text-gradient-primary">Management Platform</span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in-up stagger-2">
              <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
                Streamline your cab business with our all-in-one platform.
                <span className="text-teal-400 font-medium"> Fleet management, driver tracking, bookings, and analytics</span> — all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="group px-10 py-6 text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 transition-all duration-300 border-0"
              >
                <RouterLink to="/login" className="flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </RouterLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-10 py-6 text-xl font-bold border-2 border-white/30 text-white bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 hover:-translate-y-2 hover:border-white/50 transition-all duration-300"
              >
                <RouterLink to="/register">
                  Create Account
                </RouterLink>
              </Button>
            </div>

            {/* Feature pills */}
            <div className="animate-fade-in-up stagger-4 flex flex-wrap gap-3 justify-center mb-16">
              {[
                { label: 'Fleet Management', icon: '🚗' },
                { label: 'Driver Tracking', icon: '👨‍✈️' },
                { label: 'Smart Booking', icon: '📅' },
                { label: 'Analytics', icon: '📊' },
                { label: 'Invoicing', icon: '💳' },
              ].map((chip, index) => (
                <div
                  key={chip.label}
                  className="group px-5 py-2.5 bg-white/10 text-white font-medium border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="mr-2">{chip.icon}</span> {chip.label}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up stagger-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="group glass-effect-dark rounded-2xl p-6 border border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust indicator */}
            <div className="animate-fade-in-up stagger-6 mt-16">
              <p className="text-white/60 mb-4">Trusted by leading cab operators worldwide</p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-3 text-white/80 font-medium">4.9/5 from 500+ reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900">
              Everything You Need to
              <span className="block text-gradient-primary">Manage Your Fleet</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools you need to run a successful cab business efficiently and profitably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-fade-in-up group"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <Card className="h-full card-modern cursor-pointer hover:border-blue-200">
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Learn more link */}
                    <div className="mt-6 flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold mb-6">
                <CheckCircle2 className="h-4 w-4" />
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 leading-tight">
                Scale Your Business with <span className="text-gradient-secondary">Confidence</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Join hundreds of cab operators who have transformed their business operations with our platform.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Increase Revenue', desc: 'Optimize fleet utilization and reduce idle time by up to 40%' },
                  { title: 'Save Time', desc: 'Automate bookings, invoicing, and reporting processes' },
                  { title: 'Better Insights', desc: 'Make data-driven decisions with real-time analytics' },
                  { title: 'Reduce Costs', desc: 'Lower operational costs with smart maintenance scheduling' },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="animate-fade-in-up stagger-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl rotate-3 opacity-20 blur-xl" />
                <div className="relative glass-effect-premium rounded-3xl p-8 md:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: 'Fleet Efficiency', value: '94%', color: 'from-blue-500 to-blue-600' },
                      { label: 'Customer Rating', value: '4.9', color: 'from-amber-500 to-orange-500' },
                      { label: 'Cost Savings', value: '35%', color: 'from-green-500 to-emerald-500' },
                      { label: 'Response Time', value: '-60%', color: 'from-purple-500 to-violet-500' },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className={`text-4xl font-black bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                          {metric.value}
                        </div>
                        <div className="text-gray-600 font-medium mt-2">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden py-24 md:py-32">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 animate-gradient" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-2xl animate-float-delayed" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Start Your Free Trial Today
              </div>
            </div>

            <div className="animate-fade-in-up stagger-1">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight drop-shadow-lg">
                Ready to Transform Your <span className="text-yellow-300">Cab Business?</span>
              </h2>
            </div>

            <div className="animate-fade-in-up stagger-2">
              <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                Join thousands of cab operators who trust Jez Cabs Management Platform to streamline their operations and boost profitability.
              </p>
            </div>

            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="group px-12 py-7 text-xl font-bold bg-white text-blue-600 rounded-2xl shadow-2xl hover:bg-gray-50 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                <RouterLink to="/register" className="flex items-center gap-3">
                  Start Free Trial
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </RouterLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-12 py-7 text-xl font-bold border-2 border-white/40 text-white bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 hover:-translate-y-3 hover:border-white/60 transition-all duration-300"
              >
                <RouterLink to="/login">
                  Sign In
                </RouterLink>
              </Button>
            </div>

            <div className="animate-fade-in-up stagger-4">
              <div className="flex flex-wrap gap-6 justify-center text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
