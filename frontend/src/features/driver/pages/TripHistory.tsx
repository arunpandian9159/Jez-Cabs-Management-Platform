import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Download,
  CheckCircle,
  XCircle,
  History,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Loading';
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatDuration,
} from '@/shared/utils';
import { useTripHistory } from '../hooks/useTripHistory';
import { DriverPageHeader } from '../components/DriverPageHeader';
import { DriverStatCard } from '../components/DriverStatCard';

export function TripHistory() {
  const {
    activeTab,
    dateFilter,
    filteredTrips,
    isLoading,
    completedCount,
    cancelledCount,
    totalEarnings,
    totalDistance,
    avgRating,
    totalTrips,
    setActiveTab,
    setDateFilter,
  } = useTripHistory();

  if (isLoading) {
    return <PageLoader message="Loading trip history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DriverPageHeader
        title="Trip History"
        subtitle="View and manage your completed trips"
        icon={History}
        iconColor="accent"
        action={
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        }
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <DriverStatCard
          label="Total Trips"
          value={completedCount}
          icon={CheckCircle}
          color="primary"
          delay={0.1}
        />
        <DriverStatCard
          label="Earnings"
          value={formatCurrency(totalEarnings)}
          icon={TrendingUp}
          color="success"
          delay={0.15}
        />
        <DriverStatCard
          label="Distance"
          value={`${totalDistance.toFixed(1)} km`}
          icon={MapPin}
          color="accent"
          delay={0.2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card padding="md" className="bg-warning-100 border-transparent overflow-hidden relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-0.5">Avg Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-warning-700">{avgRating.toFixed(1)}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-warning-500 to-warning-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                <History className="w-4 h-4 mr-1.5" />
                All ({totalTrips})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <XCircle className="w-4 h-4 mr-1.5" />
                Cancelled ({cancelledCount})
              </TabsTrigger>
            </TabsList>
            <Select
              options={[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'all', label: 'All Time' },
              ]}
              value={dateFilter}
              onValueChange={setDateFilter}
            />
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="md" interactive className="hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${trip.status === 'completed' ? 'bg-gradient-to-br from-success-500 to-success-600' : 'bg-gradient-to-br from-error-500 to-error-600'}`}
                      >
                        {trip.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {trip.pickup} → {trip.destination}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(trip.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(trip.date)}
                              </span>
                            </div>
                          </div>
                          <StatusBadge status={trip.status} />
                        </div>
                        {trip.status === 'completed' ? (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-600 font-medium">
                              {trip.customer.name}
                            </span>
                            <span className="text-gray-600">
                              {trip.distance} km
                            </span>
                            <span className="text-gray-600">
                              {formatDuration(trip.duration)}
                            </span>
                            {trip.rating && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-warning-50 rounded-lg">
                                <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                                <span className="font-medium text-warning-700">{trip.rating}</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-error-600 bg-error-50 px-2 py-1 rounded-lg inline-block">
                            {trip.cancellationReason}
                          </p>
                        )}
                      </div>
                      {trip.status === 'completed' && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(trip.fare)}
                          </p>
                          {(trip.tip ?? 0) > 0 && (
                            <p className="text-xs font-medium text-success-600 bg-success-50 px-2 py-0.5 rounded-full inline-block">
                              +{formatCurrency(trip.tip ?? 0)} tip
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {trip.paymentMethod}
                          </p>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>
    </div>
  );
}
