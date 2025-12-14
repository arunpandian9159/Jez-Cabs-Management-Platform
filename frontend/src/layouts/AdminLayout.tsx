import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Car,
  AlertTriangle,
  Settings,
  BarChart3,
  Shield,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { Sidebar, NavItem } from './Sidebar/Sidebar';
import { Navbar } from './Navbar';

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Cab Owners', href: '/admin/owners', icon: Building2 },
  { name: 'Drivers', href: '/admin/drivers', icon: Car },
  { name: 'Vehicles', href: '/admin/cabs', icon: Car },
  { name: 'Disputes', href: '/admin/disputes', icon: AlertTriangle, badge: 5 },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Verification', href: '/admin/verification', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get current page title
  const currentPageTitle =
    navItems.find((item) =>
      item.end
        ? location.pathname === item.href
        : location.pathname.startsWith(item.href)
    )?.name || 'Admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Unified Sidebar Component */}
      <Sidebar
        portalType="admin"
        portalLabel="Admin Portal"
        dashboardPath="/admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isExpanded={true}
        navigation={navItems}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="transition-all duration-300 lg:ml-72">
        {/* Header */}
        <Navbar
          variant="dashboard"
          title={currentPageTitle}
          onSidebarOpen={() => setSidebarOpen(true)}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content */}
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
