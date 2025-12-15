import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Star, MoreVertical, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/shared/utils';
import type { CabDisplay } from '../../hooks/useOwnerDashboard';

interface FleetOverviewProps {
  cabs: CabDisplay[];
}

export function FleetOverview({ cabs }: FleetOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card padding="md" className="overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Fleet Overview
              </h2>
              <p className="text-sm text-gray-500">{cabs.length} vehicles</p>
            </div>
          </div>
          <Link
            to="/owner/cabs"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {cabs.map((cab, index) => (
            <CabItem key={cab.id} cab={cab} index={index} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface CabItemProps {
  cab: CabDisplay;
  index: number;
}

function CabItem({ cab, index }: CabItemProps) {
  const statusColors = {
    active: {
      bg: 'bg-success-100',
      icon: 'from-success-500 to-success-600',
      iconText: 'text-success-600',
    },
    maintenance: {
      bg: 'bg-error-100',
      icon: 'from-error-500 to-error-600',
      iconText: 'text-error-600',
    },
    inactive: {
      bg: 'bg-gray-100',
      icon: 'from-gray-500 to-gray-600',
      iconText: 'text-gray-600',
    },
  };

  const colors = statusColors[cab.status as keyof typeof statusColors] || statusColors.inactive;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.05 }}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all cursor-pointer group"
    >
      {/* Cab Icon */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-md`}
      >
        <Car className="w-6 h-6 text-white" />
      </motion.div>

      {/* Cab Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
            {cab.make} {cab.model}
          </p>
          <StatusBadge status={cab.status} />
        </div>
        <p className="text-sm text-gray-500">{cab.registrationNumber}</p>
      </div>

      {/* Driver Info */}
      {cab.driver ? (
        <div className="flex items-center gap-3">
          <Avatar size="sm" name={cab.driver.name} />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {cab.driver.name}
            </p>
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
              <span className="text-xs font-medium text-gray-600">{cab.driver.rating}</span>
            </div>
          </div>
        </div>
      ) : (
        <Badge variant="warning" size="sm">
          No Driver
        </Badge>
      )}

      {/* Today's Earnings */}
      <div className="text-right min-w-[90px]">
        <p className="font-bold text-gray-900">
          {formatCurrency(cab.todayEarnings)}
        </p>
        <p className="text-xs text-gray-500">Today</p>
      </div>

      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
