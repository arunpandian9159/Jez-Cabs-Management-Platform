import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Settings,
  User as UserIcon,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/shared/constants';
import { useAuthModal, useAuth } from '@/features/auth';
import { useNavbar, type NavLink } from './useNavbar';

interface NavbarProps {
  variant?: 'public' | 'dashboard';
  title?: string;
  onSidebarOpen?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  publicLinks?: NavLink[];
}

export function Navbar({
  variant = 'public',
  title,
  onSidebarOpen,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  publicLinks = [],
}: NavbarProps) {
  const { openLogin, openRegister } = useAuthModal();
  const { user, logout } = useAuth();
  const {
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
  } = useNavbar(variant);
  const roleInfo = getRoleInfo(user?.role);

  if (variant === 'public') {
    return (
      <>
        <motion.header
          className="fixed top-0 left-0 right-0 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className={cn(
              'transition-all duration-500',
              scrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100'
                : 'bg-transparent'
            )}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-16 md:h-20">
                <Link
                  to={ROUTES.HOME}
                  className="flex items-center gap-3 group"
                >
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
                  <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                      Jez Cabs
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase hidden md:block">
                      Your Trusted Ride
                    </span>
                  </div>
                </Link>
                <nav className="hidden lg:flex items-center">
                  <div className="flex items-center bg-gray-100/80 rounded-full p-1.5">
                    {publicLinks.map((link) => {
                      const sectionId = getSectionId(link.path);
                      const isActive = activeSection === sectionId;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={(e) => handleNavClick(e, link.path)}
                          className={cn(
                            'relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full no-underline hover:no-underline hover:bg-[#0177c6] hover:text-white',
                            isActive ? 'text-primary-700' : 'text-gray-600'
                          )}
                        >
                          {link.label}
                          {isActive && (
                            <motion.div
                              layoutId="activeNavPill"
                              className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </nav>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="hidden md:flex items-center gap-3">
                    <button
                      onClick={openLogin}
                      className="h-9 px-4 text-sm font-medium rounded-lg border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                    >
                      Sign In
                    </button>
                    <motion.button
                      onClick={openRegister}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-9 px-6 text-sm font-medium rounded-lg text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ backgroundColor: '#0177c6' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#025fa1')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#0177c6')
                      }
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={openRegister}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="md:hidden h-9 px-4 text-sm font-medium rounded-lg text-white flex items-center gap-1.5 shadow-lg transition-all duration-200"
                    style={{ backgroundColor: '#0177c6' }}
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>
        <MobileBottomNav
          publicLinks={publicLinks}
          activeSection={activeSection}
          handleNavClick={handleNavClick}
          getNavIcon={getNavIcon}
          getSectionId={getSectionId}
          openLogin={openLogin}
        />
      </>
    );
  }

  return (
    <header className="sticky top-0 z-30">
      <div className="h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600" />
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm shadow-gray-100/50">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onSidebarOpen}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(1, 119, 198, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </motion.button>
          <div
            className={`hidden ${showSearch ? 'sm:flex' : 'lg:flex'} items-center gap-3`}
          >
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-bold text-gray-900 tracking-tight"
              >
                {title || 'Dashboard'}
              </motion.h1>
              <p className="text-xs text-gray-500 font-medium">
                Welcome back, {user?.firstName || 'User'}
              </p>
            </div>
          </div>
        </div>
        {showSearch && (
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
          />
        )}
        <div className="flex items-center gap-1 lg:gap-2 ml-auto">
          {user?.role === 'customer' && (
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(1, 119, 198, 0.08)',
              }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl transition-all duration-200 group"
            >
              <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Help Center
              </span>
            </motion.button>
          )}
          <NotificationsDropdown
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
            notifications={notifications}
            unreadCount={unreadCount}
          />
          <div className="hidden lg:block h-8 w-px bg-gray-200 mx-2" />
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            user={user}
            roleInfo={roleInfo}
            logout={logout}
          />
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav({
  publicLinks,
  activeSection,
  handleNavClick,
  getNavIcon,
  getSectionId,
  openLogin,
}: {
  publicLinks: NavLink[];
  activeSection: string;
  handleNavClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => void;
  getNavIcon: (label: string) => React.ComponentType<{ className?: string }>;
  getSectionId: (path: string) => string;
  openLogin: () => void;
}) {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" />
      <div className="relative flex items-center justify-around py-2 px-2 safe-area-pb">
        {publicLinks
          .filter((link) => link.label !== 'Fleet')
          .map((link) => {
            const Icon = link.icon || getNavIcon(link.label);
            const sectionId = getSectionId(link.path);
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="relative flex flex-col items-center justify-center px-3 py-1.5 min-w-[60px] group"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100/80 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div className="relative z-10" whileTap={{ scale: 0.9 }}>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-all duration-300',
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-medium mt-1 transition-colors duration-300 truncate max-w-[60px]',
                    isActive
                      ? 'text-primary-700'
                      : 'text-gray-500 group-hover:text-gray-700'
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        <button
          onClick={openLogin}
          className="relative flex flex-col items-center justify-center px-3 py-1.5 min-w-[60px] group"
        >
          <motion.div className="relative z-10" whileTap={{ scale: 0.9 }}>
            <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
          </motion.div>
          <span className="relative z-10 text-[10px] font-medium mt-1 text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Sign In
          </span>
        </button>
      </div>
    </motion.nav>
  );
}

function SearchBar({
  searchQuery,
  onSearchChange,
  searchFocused,
  setSearchFocused,
}: {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  searchFocused: boolean;
  setSearchFocused: (v: boolean) => void;
}) {
  return (
    <motion.div
      className="hidden sm:flex items-center flex-1 max-w-xl mx-4 lg:mx-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div
        className={cn(
          'relative w-full transition-all duration-300',
          searchFocused && 'transform scale-[1.02]'
        )}
      >
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl transition-all duration-300',
            searchFocused
              ? 'bg-gradient-to-r from-primary-500/20 to-primary-400/20 blur-xl'
              : 'bg-transparent'
          )}
        />
        <div className="relative">
          <Search
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200',
              searchFocused ? 'text-primary-500' : 'text-gray-400'
            )}
          />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300',
              'bg-gray-50/80 border-2 text-gray-900 placeholder-gray-400',
              'focus:outline-none',
              searchFocused
                ? 'border-primary-400 bg-white shadow-lg shadow-primary-500/10'
                : 'border-gray-200/80 hover:border-gray-300'
            )}
          />
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-400 font-medium transition-opacity',
              searchFocused ? 'opacity-0' : 'opacity-100'
            )}
          >
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationsDropdown({
  notificationsOpen,
  setNotificationsOpen,
  notifications,
  unreadCount,
}: {
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  notifications: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
  }>;
  unreadCount: number;
}) {
  return (
    <div className="relative">
      <motion.button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(1, 119, 198, 0.08)' }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative p-2.5 rounded-xl transition-all duration-200',
          notificationsOpen && 'bg-primary-50'
        )}
      >
        <Bell
          className={cn(
            'w-5 h-5 transition-colors',
            notificationsOpen ? 'text-primary-600' : 'text-gray-500'
          )}
        />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          </motion.span>
        )}
      </motion.button>
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setNotificationsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary-600" />
                    <span className="font-semibold text-gray-900">
                      Notifications
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'px-4 py-3 border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer',
                      notification.unread && 'bg-primary-50/30'
                    )}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          notification.type === 'trip' && 'bg-green-100',
                          notification.type === 'promo' && 'bg-orange-100',
                          notification.type === 'system' && 'bg-blue-100'
                        )}
                      >
                        {notification.type === 'trip' && (
                          <ChevronRight className="w-5 h-5 text-green-600" />
                        )}
                        {notification.type === 'promo' && (
                          <span className="text-lg">🎉</span>
                        )}
                        {notification.type === 'system' && (
                          <span className="text-lg">💳</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
                <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu({
  userMenuOpen,
  setUserMenuOpen,
  user,
  roleInfo,
  logout,
}: {
  userMenuOpen: boolean;
  setUserMenuOpen: (v: boolean) => void;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
  roleInfo: { label: string; gradient: string };
  logout: () => void;
}) {
  return (
    <div className="relative">
      <motion.button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        whileHover={{ backgroundColor: 'rgba(1, 119, 198, 0.05)' }}
        className={cn(
          'flex items-center gap-3 p-2 rounded-xl transition-all duration-200',
          userMenuOpen && 'bg-primary-50/50'
        )}
      >
        <div className="relative">
          <Avatar
            size="sm"
            src={user?.avatar}
            name={user ? `${user.firstName} ${user.lastName}` : 'User'}
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </p>
          <p className="text-xs text-gray-500">{roleInfo.label}</p>
        </div>
        <motion.div
          animate={{ rotate: userMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute right-0 z-50 mt-2 w-72 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden"
            >
              <div
                className={`px-4 py-4 bg-gradient-to-r ${roleInfo.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Avatar
                        size="md"
                        src={user?.avatar}
                        name={
                          user ? `${user.firstName} ${user.lastName}` : 'User'
                        }
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate">
                      {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                    </p>
                    <p className="text-sm text-white/80 truncate">
                      {user?.email}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      {roleInfo.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Link
                  to={
                    user?.role === 'admin'
                      ? '/admin/settings'
                      : user?.role === 'driver'
                        ? '/driver/profile'
                        : user?.role === 'cab_owner'
                          ? '/owner/settings'
                          : '/customer/profile'
                  }
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <UserIcon className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium">My Profile</p>
                    <p className="text-xs text-gray-400">
                      View and edit your profile
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  to={
                    user?.role === 'admin'
                      ? '/admin/settings'
                      : user?.role === 'driver'
                        ? '/driver/settings'
                        : user?.role === 'cab_owner'
                          ? '/owner/settings'
                          : '/customer/profile'
                  }
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-gray-400">
                      Manage your preferences
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  to={user?.role === 'customer' ? '/customer/help' : '#'}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium">Help & Support</p>
                    <p className="text-xs text-gray-400">
                      Get help when you need it
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full group"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-xs text-red-400">See you next time!</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
