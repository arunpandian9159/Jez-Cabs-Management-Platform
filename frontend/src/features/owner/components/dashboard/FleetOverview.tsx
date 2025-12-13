import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Star, MoreVertical } from 'lucide-react';
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
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Fleet Overview
          </h2>
          <Link
            to="/owner/cabs"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {cabs.map((cab) => (
            <CabItem key={cab.id} cab={cab} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface CabItemProps {
  cab: CabDisplay;
}

function CabItem({ cab }: CabItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Cab Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          cab.status === 'active'
            ? 'bg-success-100'
            : cab.status === 'maintenance'
              ? 'bg-error-100'
              : 'bg-gray-100'
        }`}
      >
        <Car
          className={`w-6 h-6 ${
            cab.status === 'active'
              ? 'text-success-600'
              : cab.status === 'maintenance'
                ? 'text-error-600'
                : 'text-gray-600'
          }`}
        />
      </div>

      {/* Cab Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-gray-900">
            {cab.make} {cab.model}
          </p>
          <StatusBadge status={cab.status} />
        </div>
        <p className="text-sm text-gray-500">{cab.registrationNumber}</p>
      </div>

      {/* Driver Info */}
      {cab.driver ? (
        <div className="flex items-center gap-2">
          <Avatar size="sm" name={cab.driver.name} />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {cab.driver.name}
            </p>
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
              <span className="text-xs text-gray-500">{cab.driver.rating}</span>
            </div>
          </div>
        </div>
      ) : (
        <Badge variant="default" size="sm">
          No Driver
        </Badge>
      )}

      {/* Today's Earnings */}
      <div className="text-right min-w-[80px]">
        <p className="font-semibold text-gray-900">
          {formatCurrency(cab.todayEarnings)}
        </p>
        <p className="text-xs text-gray-500">Today</p>
      </div>

      <Button variant="ghost" size="icon">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
}
