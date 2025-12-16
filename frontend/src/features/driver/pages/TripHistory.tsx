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
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <DriverStatCard
          label="Trips"
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
          value={`${totalDistance.toFixed(0)} km`}
          icon={MapPin}
          color="accent"
          delay={0.2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card padding="sm" className="bg-warning-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Rating</p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-700">{avgRating.toFixed(1)}</p>
                  <div className="hidden sm:flex gap-0.5">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">All</span> ({totalTrips})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 sm:px-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Completed</span> ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs sm:text-sm px-2 sm:px-3">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Cancelled</span> ({cancelledCount})
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

          <TabsContent value={activeTab} className="mt-3 sm:mt-4">
            <div className="space-y-2 sm:space-y-3">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="sm" interactive className="hover:shadow-lg transition-all sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-4">
                      {/* Status icon - hidden on mobile */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shadow-lg ${trip.status === 'completed' ? 'bg-gradient-to-br from-success-500 to-success-600' : 'bg-gradient-to-br from-error-500 to-error-600'}`}
                      >
                        {trip.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                          <div className="min-w-0 flex-1">
                            {/* Mobile: with status dot */}
                            <div className="sm:hidden flex items-center gap-1.5 mb-0.5">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${trip.status === 'completed' ? 'bg-success-500' : 'bg-error-500'}`} />
                              <p className="font-semibold text-gray-900 text-xs truncate">
                                {trip.pickup} → {trip.destination}
                              </p>
                            </div>
                            {/* Desktop */}
                            <p className="hidden sm:block font-semibold text-gray-900">
                              {trip.pickup} → {trip.destination}
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                {formatDate(trip.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                {formatTime(trip.date)}
                              </span>
                            </div>
                          </div>
                          <StatusBadge status={trip.status} />
                        </div>
                        {trip.status === 'completed' ? (
                          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm flex-wrap">
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-lg text-gray-600 font-medium truncate max-w-[80px] sm:max-w-none">
                              {trip.customer.name}
                            </span>
                            <span className="text-gray-600">
                              {trip.distance} km
                            </span>
                            <span className="hidden sm:inline text-gray-600">
                              {formatDuration(trip.duration)}
                            </span>
                            {trip.rating && (
                              <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-warning-50 rounded-lg">
                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-warning-500 fill-warning-500" />
                                <span className="font-medium text-warning-700">{trip.rating}</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-sm text-error-600 bg-error-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg inline-block truncate max-w-full">
                            {trip.cancellationReason}
                          </p>
                        )}
                      </div>
                      {trip.status === 'completed' && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm sm:text-lg font-bold text-gray-900">
                            {formatCurrency(trip.fare)}
                          </p>
                          {(trip.tip ?? 0) > 0 && (
                            <p className="text-[10px] sm:text-xs font-medium text-success-600 bg-success-50 px-1.5 sm:px-2 py-0.5 rounded-full inline-block">
                              +{formatCurrency(trip.tip ?? 0)}
                            </p>
                          )}
                          <p className="hidden sm:block text-xs text-gray-500 mt-1">
                            {trip.paymentMethod}
                          </p>
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
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
