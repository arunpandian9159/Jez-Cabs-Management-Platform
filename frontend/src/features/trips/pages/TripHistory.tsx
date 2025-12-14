import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Car,
  Star,
  ChevronRight,
  Download,
  MapPin,
  Navigation,
  Route,
  Wallet,
  TrendingUp,
  Filter,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatDuration,
  cn,
} from '@/shared/utils';
import { useTripHistory, type TripDisplay } from '../hooks/useTripHistory';

export function TripHistory() {
  const {
    activeTab,
    sortBy,
    filteredTrips,
    totalSpent,
    totalDistance,
    completedCount,
    cancelledCount,
    totalCount,
    setActiveTab,
    setSortBy,
  } = useTripHistory();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                </motion.div>
                <span className="text-white/80 text-sm font-medium">
                  Your Journey Log
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Trip History
              </h1>
              <p className="text-white/70 text-lg">
                View and manage all your past trips
              </p>
            </div>
            <Button
              variant="secondary"
              leftIcon={<Download className="w-4 h-4" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            >
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Total Trips
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Route className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-500 text-xs">Completed rides</span>
              </div>
            </div>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-5 border-l-4 border-purple-400 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-gray-500 text-xs">All time spending</span>
              </div>
            </div>
          </motion.div>

          {/* Distance Traveled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-5 border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Distance Traveled
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(totalDistance || 0).toFixed(0)} km
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-gray-500 text-xs">Total kilometers</span>
              </div>
            </div>
          </motion.div>

          {/* Cancelled Trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-5 border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Cancelled
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {cancelledCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Filter className="w-4 h-4 text-orange-500" />
                <span className="text-gray-500 text-xs">Total cancellations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
          <TabsRoot value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-100 bg-gray-50/50">
              <TabsList className="bg-gray-100/80">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">
                  All ({totalCount})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed ({completedCount})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-white">
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancelled ({cancelledCount})
                </TabsTrigger>
              </TabsList>
              <Select
                options={[
                  { value: 'date', label: 'Sort by Date' },
                  { value: 'fare', label: 'Sort by Fare' },
                  { value: 'distance', label: 'Sort by Distance' },
                ]}
                value={sortBy}
                onValueChange={setSortBy}
              />
            </div>
            <TabsContent value={activeTab} className="p-0">
              <AnimatePresence>
                {filteredTrips.length === 0 ? (
                  <EmptyState activeTab={activeTab} />
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredTrips.map((trip, index) => (
                      <TripCard key={trip.id} trip={trip} index={index} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>
          </TabsRoot>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function EmptyState({ activeTab }: { activeTab: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
        <Car className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {activeTab === 'all' ? '' : activeTab} trips found
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        {activeTab === 'cancelled'
          ? "You haven't cancelled any trips yet."
          : "Start your journey with Jez Cabs and your trips will appear here."}
      </p>
    </motion.div>
  );
}

function TripCard({ trip, index }: { trip: TripDisplay; index: number }) {
  const isCompleted = trip.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-start gap-4 p-5 hover:bg-gray-50/80 transition-all duration-300 cursor-pointer">
        {/* Status Icon */}
        <div className="relative">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
              isCompleted
                ? 'bg-gradient-to-br from-emerald-100 to-teal-100'
                : 'bg-gradient-to-br from-red-100 to-orange-100'
            )}
          >
            <Car
              className={cn(
                'w-7 h-7',
                isCompleted ? 'text-emerald-600' : 'text-red-600'
              )}
            />
          </div>
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white',
              isCompleted ? 'bg-emerald-500' : 'bg-red-500'
            )}
          >
            {isCompleted ? (
              <CheckCircle className="w-3 h-3 text-white" />
            ) : (
              <XCircle className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-gray-900 truncate">
                  {trip.pickup}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-900 truncate">
                  {trip.destination}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
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
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={trip.status} />
              <Badge
                variant={trip.type === 'instant' ? 'primary' : 'info'}
                size="sm"
              >
                {trip.type === 'instant' ? 'Instant' : 'Planned'}
              </Badge>
            </div>
          </div>

          {/* Completed Trip Details */}
          {isCompleted && trip.driver && (
            <div className="flex items-center gap-4 text-sm bg-gray-50 rounded-xl p-3 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">
                    {trip.driver.name.charAt(0)}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">{trip.driver.name}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                <span className="font-medium">{trip.rating}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-gray-600">{trip.distance} km</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-gray-600">{formatDuration(trip.duration)}</span>
            </div>
          )}

          {/* Cancelled Trip Details */}
          {trip.status === 'cancelled' && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-xl">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">
                {trip.cancellationReason}
                {trip.refundAmount && (
                  <span className="text-emerald-600 font-medium ml-2">
                    (Refund: {formatCurrency(trip.refundAmount)})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Fare */}
        <div className="flex flex-col items-end gap-2">
          {isCompleted && (
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(trip.fare)}
            </p>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
}
