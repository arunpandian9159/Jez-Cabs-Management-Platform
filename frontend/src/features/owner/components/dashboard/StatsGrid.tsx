import { motion } from 'framer-motion';
import { Car, Users, DollarSign, Star, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/shared/utils';
import type { OwnerStatsDisplay } from '../../hooks/useOwnerDashboard';

interface StatsGridProps {
  stats: OwnerStatsDisplay;
  todaysEarnings: number;
}

export function StatsGrid({ stats, todaysEarnings }: StatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
    >
      {/* Cabs Card - Total & Active */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="h-full"
      >
        <Card padding="sm" className="bg-primary-100 border-transparent overflow-hidden relative h-full sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Cabs</p>
              <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700">{stats.totalCabs}</p>
                <span className="text-[10px] sm:text-sm text-gray-500">Total</span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <p className="text-sm sm:text-lg font-bold text-success-600">{stats.activeCabs}</p>
                <span className="text-[10px] sm:text-sm text-gray-500">Active</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 opacity-20 blur-xl" />
        </Card>
      </motion.div>

      {/* Drivers Card - Total & Active */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="h-full"
      >
        <Card padding="sm" className="bg-accent-100 border-transparent overflow-hidden relative h-full sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Drivers</p>
              <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-accent-700">{stats.totalDrivers}</p>
                <span className="text-[10px] sm:text-sm text-gray-500">Total</span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <p className="text-sm sm:text-lg font-bold text-success-600">{stats.activeDrivers}</p>
                <span className="text-[10px] sm:text-sm text-gray-500">Active</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 opacity-20 blur-xl" />
        </Card>
      </motion.div>

      {/* Today's Earnings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="h-full"
      >
        <Card padding="sm" className="bg-success-100 border-transparent overflow-hidden relative h-full sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Today's Earnings</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-success-700 truncate">{formatCurrency(todaysEarnings)}</p>
                <span className="hidden sm:flex items-center text-[10px] sm:text-xs font-medium text-success-600">
                  <ArrowUpRight className="w-3 h-3" />
                  +12%
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-success-500 to-success-600 opacity-20 blur-xl" />
        </Card>
      </motion.div>

      {/* Fleet Rating Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.25 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="h-full"
      >
        <Card padding="sm" className="bg-warning-100 border-transparent overflow-hidden relative h-full sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Rating</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-700">{stats.avgRating}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-warning-500 to-warning-600 opacity-20 blur-xl" />
        </Card>
      </motion.div>
    </motion.div>
  );
}

