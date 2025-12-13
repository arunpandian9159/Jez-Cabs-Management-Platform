import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Navigation,
  History,
  Wallet,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { Sidebar, NavItem } from './Sidebar/Sidebar';
import { Navbar } from './Navbar';
import { driverService } from '@/services';

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/driver', icon: LayoutDashboard, end: true },
  { name: 'Active Trip', href: '/driver/trip', icon: Navigation },
  { name: 'Trip History', href: '/driver/trips', icon: History },
  { name: 'Earnings', href: '/driver/earnings', icon: Wallet },
  { name: 'Profile', href: '/driver/profile', icon: User },
  { name: 'Settings', href: '/driver/settings', icon: Settings },
];

export function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Fetch driver profile to get initial online status
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const profile = await driverService.getProfile();
        setIsOnline(profile.is_online || false);
      } catch (error) {
        console.error('Error fetching driver profile:', error);
      }
    };

    fetchDriverProfile();
  }, []);

  // Handle online/offline toggle with API call
  const handleToggleOnline = async () => {
    try {
      if (isOnline) {
        await driverService.goOffline();
        setIsOnline(false);
      } else {
        await driverService.goOnline();
        setIsOnline(true);
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      // Optionally show an error toast to the user
    }
  };

  // Get current page title
  const currentPageTitle =
    navigation.find((item) =>
      item.end
        ? location.pathname === item.href
        : location.pathname === item.href
    )?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Sidebar Component */}
      <Sidebar
        portalType="driver"
        portalLabel="Driver Portal"
        dashboardPath="/driver"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        user={user}
        onLogout={logout}
        showOnlineToggle
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
      />

      {/* Main content area */}
      <div className="lg:pl-72">
        <Navbar
          variant="dashboard"
          title={currentPageTitle}
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
