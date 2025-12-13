import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  Clock,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  Star,
  MessageCircle,
  DollarSign,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { formatCurrency, formatDate, formatTime } from '@/shared/utils';
import {
  useTripExchange,
  type CommunityTripDisplay,
} from '../hooks/useTripExchange';

export function TripExchange() {
  const {
    activeTab,
    searchQuery,
    showFilters,
    selectedTrip,
    filteredTrips,
    isLoading,
    error,
    totalSeats,
    avgPricePerSeat,
    totalTrips,
    setActiveTab,
    setSearchQuery,
    setShowFilters,
    setSelectedTrip,
  } = useTripExchange();

  if (isLoading) return <PageLoader message="Loading community trips..." />;

  if (error) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Community Trips
          </h1>
          <p className="text-gray-500">
            Share rides and split costs with fellow travelers
          </p>
        </motion.div>
        <Card padding="lg" className="text-center">
          <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            Unable to Load Trips
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Community Trips
          </h1>
          <p className="text-gray-500">
            Share rides and split costs with fellow travelers
          </p>
        </div>
        <Button leftIcon={<Users className="w-5 h-5" />} onClick={() => {}}>
          Post a Trip
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card padding="md" className="text-center">
          <p className="text-2xl font-bold text-primary-600">{totalTrips}</p>
          <p className="text-sm text-gray-500">Available Trips</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-2xl font-bold text-success-600">{totalSeats}</p>
          <p className="text-sm text-gray-500">Seats Available</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-2xl font-bold text-accent-600">
            {formatCurrency(avgPricePerSeat)}
          </p>
          <p className="text-sm text-gray-500">Avg. Price/Seat</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="share">Offering Ride</TabsTrigger>
              <TabsTrigger value="request">Looking for Ride</TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <Input
                placeholder="Search by location or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="w-4 h-4" />}
                className="w-72"
              />
              <Button
                variant="outline"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={setShowFilters}
              >
                Filters
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>
          </div>
          <TabsContent value={activeTab}>
            <div className="space-y-3">
              {filteredTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={index}
                  onClick={() => setSelectedTrip(trip)}
                />
              ))}
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>

      <TripDetailsModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
}

function TripCard({
  trip,
  index,
  onClick,
}: {
  trip: CommunityTripDisplay;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card padding="md" interactive onClick={onClick}>
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg" name={trip.poster.name} />
            <div>
              <p className="font-medium text-gray-900">{trip.poster.name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                <span>{trip.poster.rating}</span>
                <span>•</span>
                <span>{trip.poster.trips} trips</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={trip.type === 'share' ? 'success' : 'primary'}>
                {trip.type === 'share' ? 'Offering Ride' : 'Looking for Ride'}
              </Badge>
              <Badge variant="secondary">{trip.vehicleType}</Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-4 h-4 text-success-500" />
              <span className="font-medium">{trip.from}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <MapPin className="w-4 h-4 text-error-500" />
              <span className="font-medium">{trip.to}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {trip.description}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(trip.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(trip.time)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-4">
              <span className="text-sm text-gray-500">
                {trip.seats} {trip.seats === 1 ? 'seat' : 'seats'} left
              </span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(trip.pricePerSeat)}
                <span className="text-xs text-gray-500 font-normal">/seat</span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function TripDetailsModal({
  trip,
  onClose,
}: {
  trip: CommunityTripDisplay | null;
  onClose: () => void;
}) {
  if (!trip) return null;
  return (
    <Modal open={!!trip} onOpenChange={onClose} title="Trip Details" size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar size="xl" name={trip.poster.name} />
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              {trip.poster.name}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
              <span>{trip.poster.rating} rating</span>
              <span>•</span>
              <span>{trip.poster.trips} trips shared</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium text-gray-900">{trip.from}</p>
            </div>
          </div>
          <div className="ml-1.5 h-6 w-0.5 bg-gray-300" />
          <div className="flex items-center gap-3 mt-3">
            <div className="w-3 h-3 rounded-full bg-error-500" />
            <div>
              <p className="text-sm text-gray-500">Drop-off</p>
              <p className="font-medium text-gray-900">{trip.to}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium text-gray-900">
              {formatDate(trip.date)} at {formatTime(trip.time)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium text-gray-900">{trip.vehicleType}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Available Seats</p>
            <p className="font-medium text-gray-900">{trip.seats} seats</p>
          </div>
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-600">Price per Seat</p>
            <p className="font-bold text-primary-700 text-lg">
              {formatCurrency(trip.pricePerSeat)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-700">{trip.description}</p>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            fullWidth
            leftIcon={<MessageCircle className="w-5 h-5" />}
          >
            Message
          </Button>
          <Button fullWidth leftIcon={<DollarSign className="w-5 h-5" />}>
            Book Seat
          </Button>
        </div>
      </div>
    </Modal>
  );
}
