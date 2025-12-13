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

// Color configurations for different portal types
const portalColors = {
  customer: {
    primary: 'from-primary-500 to-accent-500',
    activeBg: 'bg-primary-50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gray-100',
  },
  driver: {
    primary: 'from-primary-500 to-accent-500',
    activeBg: 'bg-primary-50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gray-100',
  },
  owner: {
    primary: 'from-accent-500 to-primary-500',
    activeBg: 'bg-accent-50',
    activeText: 'text-accent-700',
    activeIcon: 'text-accent-600',
    hoverBg: 'hover:bg-gray-100',
  },
  admin: {
    primary: 'from-primary-500 to-primary-600',
    activeBg: 'bg-primary-50',
    activeText: 'text-primary-700',
    activeIcon: 'text-primary-600',
    hoverBg: 'hover:bg-gray-100',
  },
};

const statColors = {
  primary: {
    bg: 'from-primary-50 to-primary-100',
    border: 'border-primary-200',
    icon: 'text-primary-600',
    label: 'text-primary-700',
    value: 'text-primary-900',
  },
  success: {
    bg: 'from-success-50 to-success-100',
    border: 'border-success-200',
    icon: 'text-success-600',
    label: 'text-success-700',
    value: 'text-success-900',
  },
  warning: {
    bg: 'from-warning-50 to-warning-100',
    border: 'border-warning-200',
    icon: 'text-warning-600',
    label: 'text-warning-700',
    value: 'text-warning-900',
  },
  error: {
    bg: 'from-error-50 to-error-100',
    border: 'border-error-200',
    icon: 'text-error-600',
    label: 'text-error-700',
    value: 'text-error-900',
  },
  accent: {
    bg: 'from-accent-50 to-accent-100',
    border: 'border-accent-200',
    icon: 'text-accent-600',
    label: 'text-accent-700',
    value: 'text-accent-900',
  },
};

// Animation variants
const sidebarVariants = {
  expanded: { width: 288 },
  collapsed: { width: 80 },
};

const textVariants = {
  visible: { opacity: 1, x: 0, display: 'block' },
  hidden: { opacity: 0, x: -10, transitionEnd: { display: 'none' } },
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
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={showExpanded ? 'expanded' : 'collapsed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-300',
          // Light/Dark theme based on portal type
          'bg-white/95 backdrop-blur-xl border-r border-gray-200/80',
          // Mobile behavior
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Shadow
          'shadow-2xl lg:shadow-lg'
        )}
        style={{ width: showExpanded ? 288 : 80 }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/80">
          <Link to={dashboardPath} className="flex items-center gap-3">
            {/* Logo Image */}
            <div className="relative group">
              <div
                className={cn(
                  'absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300',
                  colors.primary
                )}
              />
              <div
                className={cn(
                  'relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden',
                  'bg-gradient-to-br',
                  colors.primary
                )}
              >
                <img
                  src="/logo.svg"
                  alt="Jez Cabs"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>

            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="font-bold text-lg text-gray-900">Jez Cabs</h1>
                  <p className="text-xs text-gray-500">{portalLabel}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Close button (mobile) and expand toggle (desktop) */}
          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop expand/collapse toggle */}
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="hidden lg:flex p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-500"
              >
                {isExpanded ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Online Status Toggle - Driver Portal */}
        {showOnlineToggle && onToggleOnline && (
          <div className="p-4 border-b border-gray-200/80">
            <motion.button
              onClick={onToggleOnline}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300',
                isOnline
                  ? 'bg-success-50 text-success-700 border-2 border-success-200'
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-200',
                !showExpanded && 'justify-center px-3'
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span
                className={cn(
                  'flex items-center gap-2',
                  !showExpanded && 'gap-0'
                )}
              >
                <Power className="w-5 h-5" />
                {showExpanded && (isOnline ? 'Online' : 'Offline')}
              </span>
              {showExpanded && (
                <span
                  className={cn(
                    'w-3 h-3 rounded-full animate-pulse',
                    isOnline ? 'bg-success-500' : 'bg-gray-400'
                  )}
                />
              )}
              {!showExpanded && (
                <span
                  className={cn(
                    'absolute top-1 right-1 w-2 h-2 rounded-full',
                    isOnline ? 'bg-success-500 animate-pulse' : 'bg-gray-400'
                  )}
                />
              )}
            </motion.button>
          </div>
        )}

        {/* Quick Stats - Owner Portal */}
        {quickStats && quickStats.length > 0 && showExpanded && (
          <div className="p-4 border-b border-gray-200/80">
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => {
                const statColor = statColors[stat.color];
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'p-3 rounded-xl bg-gradient-to-br border',
                      statColor.bg,
                      statColor.border
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={cn('w-4 h-4', statColor.icon)} />
                      <span
                        className={cn('text-xs font-medium', statColor.label)}
                      >
                        {stat.label}
                      </span>
                    </div>
                    <p className={cn('text-xl font-bold', statColor.value)}>
                      {stat.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? cn(colors.activeBg, colors.activeText, 'shadow-sm')
                      : cn('text-gray-600', colors.hoverBg),
                    !showExpanded && 'justify-center'
                  )}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b',
                        colors.primary
                      )}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                      isActive && colors.activeIcon
                    )}
                  />

                  <AnimatePresence>
                    {showExpanded && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex-1"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {showExpanded && item.badge && (
                    <Badge variant="error" size="sm">
                      {item.badge}
                    </Badge>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!showExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
                      {item.name}
                      {item.badge && (
                        <Badge variant="error" size="sm" className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Content (e.g., Emergency SOS) */}
        {footerContent && showExpanded && (
          <div className="px-3 py-4 border-t border-gray-200/80">
            {footerContent}
          </div>
        )}

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/80">
          <div
            className={cn(
              'flex items-center gap-3',
              showExpanded ? 'mb-4' : 'flex-col'
            )}
          >
            <div className="relative group">
              <div
                className={cn(
                  'absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-50 blur transition-opacity duration-300',
                  colors.primary
                )}
              />
              <Avatar
                size={showExpanded ? 'md' : 'sm'}
                src={user?.avatar}
                name={getUserDisplayName()}
              />
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
                  <p className="font-medium truncate text-gray-900">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs truncate text-gray-500">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={onLogout}
            className={cn(
              'flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium transition-all duration-200 text-error-600 hover:bg-error-50',
              !showExpanded && 'justify-center'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {showExpanded && (
                <motion.span
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
