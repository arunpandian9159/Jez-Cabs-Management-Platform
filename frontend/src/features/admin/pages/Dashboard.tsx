import { motion } from 'framer-motion';
import { Clock, LayoutDashboard, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency } from '@/shared/utils';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { AdminPageHeader, AdminStatCard } from '../components';

export function AdminDashboard() {
  const { stats, recentTrips, pendingVerifications, recentDisputes } =
    useAdminDashboard();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      case 'open':
        return <Badge variant="warning">Open</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'accent'> = {
    primary: 'primary',
    success: 'success',
    accent: 'accent',
    error: 'error',
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
        icon={LayoutDashboard}
        iconColor="primary"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <AdminStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={IconComponent}
              color={colorMap[stat.color] || 'primary'}
              trend={{
                value: stat.change,
                direction: stat.trending as 'up' | 'down',
              }}
              delay={0.1 + index * 0.05}
            />
          );
        })}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2"
        >
          <Card padding="lg" className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Recent Trips</h2>
              </div>
              <button className="text-sm text-primary-600 hover:underline font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Fare
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentTrips.map((trip, index) => (
                    <motion.tr
                      key={trip.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all duration-200"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar size="xs" name={trip.customer} />
                          <span className="text-sm font-medium text-gray-900">
                            {trip.customer}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {trip.driver}
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(trip.fare)}
                      </td>
                      <td className="py-3">{getStatusBadge(trip.status)}</td>
                      <td className="py-3 text-sm text-gray-500">
                        {trip.time}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="lg" className="bg-gradient-to-br from-warning-50 to-orange-50 border-warning-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning-600" />
                  <h2 className="font-semibold text-gray-900">
                    Pending Verifications
                  </h2>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Badge variant="warning">{pendingVerifications.length}</Badge>
                </motion.div>
              </div>
              <div className="space-y-3">
                {pendingVerifications.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warning-400 to-orange-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.document} • {item.submitted}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card padding="lg" className="bg-gradient-to-br from-error-50 to-rose-50 border-error-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-error-600" />
                  <h2 className="font-semibold text-gray-900">Recent Disputes</h2>
                </div>
                <button className="text-sm text-primary-600 hover:underline font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentDisputes.map((dispute, index) => (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 rounded-lg bg-white/60 border border-gray-200 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {dispute.customer}
                      </span>
                      {getPriorityBadge(dispute.priority)}
                    </div>
                    <p className="text-sm text-gray-500">{dispute.issue}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
