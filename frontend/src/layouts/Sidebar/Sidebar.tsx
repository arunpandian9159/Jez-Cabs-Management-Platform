import { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LogOut,
  Power,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

// Types
export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  end?: boolean;
}

export interface QuickStat {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}

export interface SidebarProps {
  // Portal configuration
  portalType: 'customer' | 'driver' | 'owner' | 'admin';
  portalLabel: string;
  dashboardPath: string;

  // State
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;

  // Navigation
  navigation: NavItem[];

  // User info
  user?: {
    email?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  onLogout: () => void;

  // Optional features
  showOnlineToggle?: boolean;
  isOnline?: boolean;
  onToggleOnline?: () => void;

  quickStats?: QuickStat[];

  // Footer content (e.g., Emergency SOS button)
  footerContent?: ReactNode;
}

// Color configurations for different portal types - Enhanced with more vibrant gradients
const portalColors = {
  customer: {
    primary: 'from-primary-500 via-primary-600 to-accent-500',
    primaryLight: 'from-primary-400/20 via-accent-400/10 to-transparent',
    activeBg: 'bg-gradient-to-r from-primary-50 to-accent-50/50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50',
    accentGlow: 'shadow-primary-500/20',
    borderGradient: 'from-primary-500 to-accent-500',
  },
  driver: {
    primary: 'from-primary-500 via-primary-600 to-accent-500',
    primaryLight: 'from-primary-400/20 via-accent-400/10 to-transparent',
    activeBg: 'bg-gradient-to-r from-primary-50 to-accent-50/50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50',
    accentGlow: 'shadow-primary-500/20',
    borderGradient: 'from-primary-500 to-accent-500',
  },
  owner: {
    primary: 'from-accent-500 via-accent-600 to-primary-500',
    primaryLight: 'from-accent-400/20 via-primary-400/10 to-transparent',
    activeBg: 'bg-gradient-to-r from-accent-50 to-primary-50/50',
    activeText: 'text-accent-700',
    activeIcon: 'text-accent-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50',
    accentGlow: 'shadow-accent-500/20',
    borderGradient: 'from-accent-500 to-primary-500',
  },
  admin: {
    primary: 'from-primary-600 via-primary-500 to-primary-400',
    primaryLight: 'from-primary-400/20 via-primary-300/10 to-transparent',
    activeBg: 'bg-gradient-to-r from-primary-50 to-primary-100/50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50',
    accentGlow: 'shadow-primary-500/20',
    borderGradient: 'from-primary-600 to-primary-400',
  },
};

const statColors = {
  primary: {
    bg: 'from-primary-50 to-primary-100/80',
    border: 'border-primary-200/50',
    icon: 'text-primary-600',
    label: 'text-primary-700',
    value: 'text-primary-900',
  },
  success: {
    bg: 'from-success-50 to-success-100/80',
    border: 'border-success-200/50',
    icon: 'text-success-600',
    label: 'text-success-700',
    value: 'text-success-900',
  },
  warning: {
    bg: 'from-warning-50 to-warning-100/80',
    border: 'border-warning-200/50',
    icon: 'text-warning-600',
    label: 'text-warning-700',
    value: 'text-warning-900',
  },
  error: {
    bg: 'from-error-50 to-error-100/80',
    border: 'border-error-200/50',
    icon: 'text-error-600',
    label: 'text-error-700',
    value: 'text-error-900',
  },
  accent: {
    bg: 'from-accent-50 to-accent-100/80',
    border: 'border-accent-200/50',
    icon: 'text-accent-600',
    label: 'text-accent-700',
    value: 'text-accent-900',
  },
};

// Animation variants
const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 },
};

const textVariants = {
  visible: { opacity: 1, x: 0, display: 'block' },
  hidden: { opacity: 0, x: -10, transitionEnd: { display: 'none' } },
};

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  hover: { x: 4 },
};

export function Sidebar({
  portalType,
  portalLabel,
  dashboardPath,
  isOpen,
  onClose,
  isExpanded = true,
  onToggleExpand,
  navigation,
  user,
  onLogout,
  showOnlineToggle = false,
  isOnline = false,
  onToggleOnline,
  quickStats,
  footerContent,
}: SidebarProps) {
  const location = useLocation();
  const colors = portalColors[portalType];
  const showExpanded = isExpanded || isOpen;

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return portalLabel.replace(' Portal', '');
  };

  return (
    <>
      {/* Mobile sidebar backdrop with enhanced blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-md lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={showExpanded ? 'expanded' : 'collapsed'}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-300',
          // Premium glass effect with gradient overlay
          'bg-white/90 backdrop-blur-2xl',
          // Subtle border
          'border-r border-gray-200/60',
          // Mobile behavior
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Premium shadow
          'shadow-[0_0_60px_-12px_rgba(0,0,0,0.12)]'
        )}
        style={{ width: showExpanded ? 280 : 80 }}
      >
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={cn(
              'absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-br opacity-30 blur-3xl',
              colors.primaryLight
            )}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-tl from-gray-200/30 via-gray-100/20 to-transparent blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Content wrapper */}
        <div className="relative flex flex-col h-full z-10">
          {/* Logo Section - Enhanced */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-gray-200/60">
            <Link to={dashboardPath} className="flex items-center gap-4 group">
              {/* Logo with enhanced glow effect */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated glow ring */}
                <motion.div
                  className={cn(
                    'absolute -inset-1 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500',
                    colors.primary
                  )}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Logo container */}
                <div
                  className={cn(
                    'relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden',
                    'bg-gradient-to-br shadow-lg',
                    colors.primary,
                    colors.accentGlow
                  )}
                >
                  <img
                    src="/logo.svg"
                    alt="Jez Cabs"
                    className="w-8 h-8 object-contain drop-shadow-lg"
                  />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
                    initial={{ x: '-100%', y: '-100%' }}
                    animate={{ x: '200%', y: '200%' }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                  />
                </div>
              </motion.div>

              <AnimatePresence>
                {showExpanded && (
                  <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="flex flex-col"
                  >
                    <h1 className="font-bold text-xl text-gray-900 tracking-tight">
                      Jez Cabs
                    </h1>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r text-white',
                          colors.primary
                        )}
                      >
                        {portalLabel.replace(' Portal', '')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Close/Expand buttons */}
            <div className="flex items-center gap-1">
              {/* Mobile close button */}
              <motion.button
                onClick={onClose}
                className="lg:hidden p-2.5 rounded-xl transition-colors bg-gray-100/80 hover:bg-gray-200/80 text-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Desktop expand/collapse toggle */}
              {onToggleExpand && (
                <motion.button
                  onClick={onToggleExpand}
                  className="hidden lg:flex p-2.5 rounded-xl transition-all bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? (
                    <ChevronLeft className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Online Status Toggle - Driver Portal - Enhanced */}
          {showOnlineToggle && onToggleOnline && (
            <div className="p-4 border-b border-gray-200/60">
              <motion.button
                onClick={onToggleOnline}
                className={cn(
                  'relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 overflow-hidden',
                  isOnline
                    ? 'bg-gradient-to-r from-success-50 to-success-100/80 text-success-700 border-2 border-success-200/80'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100/80 text-gray-600 border-2 border-gray-200/80',
                  !showExpanded && 'justify-center px-3'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background pulse for online state */}
                {isOnline && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-success-200/50 to-success-100/30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span
                  className={cn(
                    'relative flex items-center gap-3',
                    !showExpanded && 'gap-0'
                  )}
                >
                  <Power className="w-5 h-5" />
                  {showExpanded && (
                    <span className="font-semibold">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  )}
                </span>
                {showExpanded && (
                  <span
                    className={cn(
                      'relative w-3 h-3 rounded-full',
                      isOnline ? 'bg-success-500' : 'bg-gray-400'
                    )}
                  >
                    {isOnline && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-success-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </span>
                )}
              </motion.button>
            </div>
          )}

          {/* Quick Stats - Owner Portal - Enhanced */}
          {quickStats && quickStats.length > 0 && showExpanded && (
            <div className="p-4 border-b border-gray-200/60">
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat, index) => {
                  const statColor = statColors[stat.color];
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className={cn(
                        'p-4 rounded-2xl bg-gradient-to-br border backdrop-blur-sm cursor-default',
                        statColor.bg,
                        statColor.border
                      )}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center bg-white/60 shadow-sm',
                            statColor.icon
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            'text-xs font-semibold uppercase tracking-wide',
                            statColor.label
                          )}
                        >
                          {stat.label}
                        </span>
                      </div>
                      <p className={cn('text-2xl font-bold', statColor.value)}>
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation - Enhanced */}
          <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto scrollbar-hide">
            {/* Main Navigation Label */}
            {showExpanded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4"
              >
                Navigation
              </motion.p>
            )}

            {navigation.map((item, index) => {
              const isActive = item.end
                ? location.pathname === item.href
                : location.pathname === item.href ||
                location.pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  onClick={onClose}
                >
                  <motion.div
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    className={cn(
                      'group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300',
                      // Only apply active background styles in expanded mode
                      showExpanded && isActive
                        ? cn(
                          colors.activeBg,
                          colors.activeText,
                          'shadow-sm border border-gray-200/50'
                        )
                        : cn('text-gray-600', showExpanded && colors.hoverBg),
                      !showExpanded && 'justify-center px-3'
                    )}
                  >
                    {/* Active indicator bar - only show in expanded mode */}
                    {isActive && showExpanded && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className={cn(
                          'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b',
                          colors.borderGradient
                        )}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon container with enhanced styling */}
                    <motion.div
                      className={cn(
                        'relative flex items-center justify-center flex-shrink-0 transition-all duration-300 w-9 h-9 rounded-xl',
                        isActive
                          ? cn(
                            'bg-gradient-to-br text-white shadow-md',
                            colors.primary
                          )
                          : 'bg-gray-100/80 text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-700'
                      )}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      {/* Icon glow effect when active - only show in expanded mode */}
                      {isActive && showExpanded && (
                        <motion.div
                          className={cn(
                            'absolute inset-0 bg-gradient-to-br opacity-50 blur-xs -z-10 rounded-xl',
                            colors.primary
                          )}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    <AnimatePresence>
                      {showExpanded && (
                        <motion.span
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex-1 font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {showExpanded && item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                      >
                        <Badge variant="error" size="sm">
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                </NavLink>
              );
            })}

            {/* Quick Actions Section */}
            {showExpanded && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Quick Actions
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 transition-all"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100/80 text-gray-500">
                    <HelpCircle className="w-[18px] h-[18px]" />
                  </div>
                  <span>Help & Support</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 transition-all"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100/80 text-gray-500">
                    <Settings className="w-[18px] h-[18px]" />
                  </div>
                  <span>Settings</span>
                </motion.button>
              </>
            )}
          </nav>

          {/* Footer Content (e.g., Emergency SOS) */}
          {footerContent && showExpanded && (
            <div className="px-4 py-4 border-t border-gray-200/60">
              {footerContent}
            </div>
          )}

          {/* User Section - Enhanced */}
          <div className="p-4 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/50 to-transparent">
            <motion.div
              className={cn(
                'flex items-center gap-4 p-3 rounded-2xl transition-all duration-300',
                showExpanded ? 'mb-3 hover:bg-white/60' : 'flex-col',
                showExpanded && 'cursor-pointer'
              )}
              whileHover={showExpanded ? { scale: 1.01 } : {}}
            >
              {/* Avatar with enhanced glow */}
              <div className="relative group">
                <motion.div
                  className={cn(
                    'absolute -inset-1 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-300',
                    colors.primary
                  )}
                  animate={
                    showExpanded
                      ? {}
                      : { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative">
                  <Avatar
                    size={showExpanded ? 'md' : 'sm'}
                    src={user?.avatar}
                    name={getUserDisplayName()}
                    className="ring-2 ring-white shadow-md"
                  />
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success-500 rounded-full border-2 border-white" />
                </div>
              </div>

              <AnimatePresence>
                {showExpanded && (
                  <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex-1 min-w-0"
                  >
                    <p className="font-semibold truncate text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs truncate text-gray-500">
                      {user?.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {showExpanded && (
                <motion.div whileHover={{ rotate: 90 }} className="p-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                </motion.div>
              )}
            </motion.div>

            {/* Logout Button - Enhanced */}
            <motion.button
              onClick={onLogout}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-medium transition-all duration-300',
                'text-gray-600 hover:text-error-600 hover:bg-error-50/80',
                !showExpanded && 'justify-center'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center flex-shrink-0 bg-gray-100/80 group-hover:bg-error-100 text-gray-500 group-hover:text-error-600 transition-colors',
                  showExpanded ? 'w-9 h-9 rounded-xl' : 'w-10 h-10 rounded-full'
                )}
                whileHover={{ rotate: -15 }}
              >
                <LogOut className="w-[18px] h-[18px]" />
              </motion.div>
              <AnimatePresence>
                {showExpanded && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="font-medium"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
