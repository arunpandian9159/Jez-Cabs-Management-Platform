import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  X,
  Sparkles,
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

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
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Logo Section */}
      <div className="py-8 px-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30 hover:scale-110 transition-transform duration-300 animate-scale-in cursor-pointer">
            🚕
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Jez Cabs
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Management Platform
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6 mb-4">
        <div className="border-t border-slate-700/50" />
      </div>

      {/* Navigation Label */}
      <div className="px-6 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.text}
              onClick={() => handleMenuClick(item.path)}
              className={`
                group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 animate-fade-in-up relative overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
              )}

              {/* Icon container */}
              <span className={`relative z-10 transition-all duration-300 ${isActive
                  ? 'text-white'
                  : 'text-slate-500 group-hover:text-blue-400'
                }`}>
                {item.icon}
              </span>

              {/* Text */}
              <span className={`relative z-10 font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''
                }`}>
                {item.text}
              </span>

              {/* Hover arrow */}
              <ChevronRight className={`ml-auto h-4 w-4 transition-all duration-300 ${isActive
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                }`} />

              {/* Hover background effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-teal-600/0 group-hover:from-blue-600/10 group-hover:to-teal-600/5 transition-all duration-500 rounded-xl" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-teal-600/20 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-semibold text-white">Pro Features</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Unlock analytics, reports, and advanced fleet management.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[280px] md:flex-col md:fixed md:inset-y-0 z-20">
        <div className="flex-1 flex flex-col min-h-0 shadow-2xl shadow-slate-900/20">
          {drawer}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 border-0">
          {drawer}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-[280px] flex flex-col w-full flex-1">
        {/* Top Navigation */}
        <div className="sticky top-0 z-30 flex-shrink-0 flex h-20 glass-effect border-b border-white/20">
          <div className="flex-1 px-4 md:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                onClick={handleDrawerToggle}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Page title */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                    {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
                  </h1>
                </div>
                <p className="text-sm text-slate-500 font-medium hidden sm:block">
                  Welcome back, <span className="text-blue-600">{user?.firstName}</span> 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-xl h-11 w-11"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold shadow-lg shadow-red-500/30 animate-pulse">
                  3
                </span>
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-xl h-11 w-11 hidden sm:flex"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Info & Avatar */}
              <div className="user-menu-container relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 pr-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Administrator
                    </p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-300 hidden lg:block ${userMenuOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 glass-effect-premium rounded-2xl shadow-2xl border-0 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-5rem)]">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
