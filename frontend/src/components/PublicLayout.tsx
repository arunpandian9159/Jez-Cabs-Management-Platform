import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <RouterLink to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                🚕
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Jez Cabs
                </h1>
                <p className="text-xs text-slate-500">Management Platform</p>
              </div>
            </RouterLink>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <RouterLink
                to="/"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Home
              </RouterLink>
              <a
                href="#features"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="hidden sm:flex text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <RouterLink to="/login">
                  Sign In
                </RouterLink>
              </Button>
              <Button
                asChild
                className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <RouterLink to="/register" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </RouterLink>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">
                  🚕
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Jez Cabs</h2>
                  <p className="text-slate-400 text-sm">Management Platform</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
                Streamline your cab business operations with our comprehensive management platform.
                Manage fleets, drivers, bookings, and analytics all in one place.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Features', to: '#features' },
                  { label: 'Pricing', to: '#pricing' },
                  { label: 'About Us', to: '#about' },
                ].map((link) => (
                  <li key={link.label}>
                    <RouterLink
                      to={link.to}
                      className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-400" />
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <a href="mailto:support@jezcabs.com" className="hover:text-white transition-colors">
                    support@jezcabs.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </div>
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-purple-400" />
                  </div>
                  <span>123 Business Street, Tech City, TC 12345</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="glass-effect-dark rounded-3xl p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Subscribe to our newsletter
                </h3>
                <p className="text-slate-400">
                  Get the latest updates and news directly in your inbox.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-72 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl px-6 shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Jez Cabs Management Platform. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
