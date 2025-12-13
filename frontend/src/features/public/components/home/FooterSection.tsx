import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { ROUTES } from '@/shared/constants';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import { useAuthModal } from '@/features/auth';

export function FooterSection() {
  const { openRegister } = useAuthModal();

  return (
    <footer
      className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#0f172a' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              {/* Logo */}
              <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Logo
                    size="lg"
                    className="drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                  />
                </motion.div>
                <span className="text-lg sm:text-xl font-bold text-white">
                  Jez Cabs
                </span>
              </Link>
            </div>
            <p
              className="text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs"
              style={{ color: '#94a3b8' }}
            >
              Your trusted partner for safe, reliable, and comfortable cab
              services across the country.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <div
                className="flex items-center gap-2"
                style={{ color: '#94a3b8' }}
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs sm:text-sm">support@jezcabs.com</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: '#94a3b8' }}
              >
                <Phone className="w-4 h-4" />
                <span className="text-xs sm:text-sm">+1 (800) 123-4567</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: '#94a3b8' }}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  123 Main Street, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {['About Us', 'Careers', 'Blog', 'Press'].map((link) => (
                <li key={link}>
                  <button
                    onClick={openRegister}
                    className="text-xs sm:text-sm transition-colors hover:text-white cursor-pointer"
                    style={{ color: '#94a3b8' }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                'One Way Trips',
                'Round Trips',
                'Car Rentals',
                'Airport Transfer',
              ].map((link) => (
                <li key={link}>
                  <button
                    onClick={openRegister}
                    className="text-xs sm:text-sm transition-colors hover:text-white cursor-pointer"
                    style={{ color: '#94a3b8' }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Support
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                'Help Center',
                'Safety',
                'Terms of Service',
                'Privacy Policy',
              ].map((link) => (
                <li key={link}>
                  <button
                    onClick={openRegister}
                    className="text-xs sm:text-sm transition-colors hover:text-white cursor-pointer"
                    style={{ color: '#94a3b8' }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Partners
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                'Become a Driver',
                'Fleet Partners',
                'Corporate',
                'Affiliate Program',
              ].map((link) => (
                <li key={link}>
                  <button
                    onClick={openRegister}
                    className="text-xs sm:text-sm transition-colors hover:text-white cursor-pointer"
                    style={{ color: '#94a3b8' }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs sm:text-sm" style={{ color: '#64748b' }}>
              © 2025 Jez Cabs. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: FaFacebook },
                { icon: FaTwitter },
                { icon: FaInstagram },
                { icon: FaLinkedin },
              ].map((social, index) => (
                <button
                  key={index}
                  onClick={openRegister}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:bg-slate-700 cursor-pointer"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <social.icon
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: '#94a3b8' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
