import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Briefcase, Zap, Car, Building, LucideIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants';

interface NavLink {
  path: string;
  label: string;
  icon?: LucideIcon;
}
type Notification = {
  id: number;
  type: 'trip' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const sampleNotifications: Notification[] = [
  {
    id: 1,
    type: 'trip',
    title: 'Trip Completed',
    message: 'Your ride to Airport has been completed',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'promo',
    title: 'Special Offer!',
    message: 'Get 20% off on your next ride',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'system',
    title: 'Payment Received',
    message: 'Your payment of ₹350 was successful',
    time: '3 hours ago',
    unread: false,
  },
];

export function useNavbar(variant: 'public' | 'dashboard' = 'public') {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();

  // Scroll handling for public navbar
  useEffect(() => {
    if (variant !== 'public') return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['services', 'how-it-works', 'fleet', 'for-owners'];
      const scrollPosition = window.scrollY + 150;
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      if (path.startsWith('/#')) {
        e.preventDefault();
        const elementId = path.replace('/#', '');
        document
          .getElementById(elementId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const getNavIcon = useCallback((label: string): LucideIcon => {
    switch (label.toLowerCase()) {
      case 'home':
        return Home;
      case 'services':
        return Briefcase;
      case 'how it works':
        return Zap;
      case 'fleet':
        return Car;
      case 'for owners':
        return Building;
      default:
        return Home;
    }
  }, []);

  const getSectionId = useCallback((path: string) => {
    if (path === ROUTES.HOME || path === '/') return 'home';
    if (path.startsWith('/#')) return path.replace('/#', '');
    return path.replace('/', '');
  }, []);

  const getRoleInfo = useCallback((role?: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          gradient: 'from-purple-500 to-indigo-600',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
        };
      case 'driver':
        return {
          label: 'Driver',
          gradient: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
        };
      case 'cab_owner':
        return {
          label: 'Cab Owner',
          gradient: 'from-orange-500 to-amber-600',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
        };
      default:
        return {
          label: 'Customer',
          gradient: 'from-blue-500 to-cyan-600',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
        };
    }
  }, []);

  const notifications = sampleNotifications;
  const unreadCount = notifications.filter((n) => n.unread).length;

  return {
    scrolled,
    userMenuOpen,
    activeSection,
    notificationsOpen,
    searchFocused,
    notifications,
    unreadCount,
    setUserMenuOpen,
    setNotificationsOpen,
    setSearchFocused,
    handleNavClick,
    getNavIcon,
    getSectionId,
    getRoleInfo,
  };
}

export type { NavLink, Notification };
