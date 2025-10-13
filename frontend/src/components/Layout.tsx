import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  Car,
  Users,
  BookOpen,
  Receipt,
  CheckSquare,
  BarChart3,
  LogOut,
  Bell,
  Settings,
} from 'lucide-react';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/app/dashboard' },
  { text: 'Cabs', icon: <Car className="h-5 w-5" />, path: '/app/cabs' },
  { text: 'Drivers', icon: <Users className="h-5 w-5" />, path: '/app/drivers' },
  { text: 'Bookings', icon: <BookOpen className="h-5 w-5" />, path: '/app/bookings' },
  { text: 'Checklists', icon: <CheckSquare className="h-5 w-5" />, path: '/app/checklists' },
  { text: 'Invoices', icon: <Receipt className="h-5 w-5" />, path: '/app/invoices' },
  { text: 'Reports', icon: <BarChart3 className="h-5 w-5" />, path: '/app/reports' },
];

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div className="h-full bg-gradient-to-b from-white to-gray-50">
      <div className="py-6 px-6">
        <div className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform duration-300 animate-scale-in">
            🚕
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Jez Cabs
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Management Platform
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="border-t border-blue-100"></div>
      </div>
      <nav className="px-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.text}
              onClick={() => handleMenuClick(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 animate-fade-in-up
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 transform translate-x-2'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:transform hover:translate-x-1 hover:shadow-md'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className={isActive ? 'text-white' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.text}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[280px] md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
          {drawer}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          {drawer}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-[280px] flex flex-col w-0 flex-1">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 text-blue-600 hover:bg-blue-50"
                onClick={handleDrawerToggle}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Welcome back, {user?.firstName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                  3
                </Badge>
              </Button>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Administrator
                  </p>
                </div>
              </div>

              {/* User Avatar */}
              <Button
                variant="ghost"
                className="p-0 h-auto hover:scale-105 transition-transform duration-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* User Menu Dropdown */}
        {userMenuOpen && (
          <div className="absolute top-16 right-4 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
            <div className="py-1">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Settings className="h-4 w-4 text-gray-500" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-white min-h-screen">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
