import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Fuel,
  Star,
  Filter,
  Search,
  ChevronDown,
  Heart,
  Sparkles,
  Gauge,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import {
  useBrowseCabs,
  rentalTypes,
  durationOptions,
  type AvailableCabDisplay,
} from '../hooks/useBrowseCabs';

export function BrowseCabs() {
  const {
    searchQuery,
    rentalType,
    duration,
    showFilters,
    favorites,
    filteredCabs,
    setSearchQuery,
    setRentalType,
    setDuration,
    setShowFilters,
    toggleFavorite,
  } = useBrowseCabs();

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
              'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
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
          className="absolute bottom-10 left-20 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl"
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
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                </motion.div>
                <span className="text-white/80 text-sm font-medium">
                  Explore Our Fleet
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Rent a Cab
              </h1>
              <p className="text-white/70 text-lg">
                Choose from our wide selection of premium vehicles
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/70 text-xs uppercase tracking-wide">Available</p>
                <p className="text-2xl font-bold text-white">
                  {filteredCabs.filter(c => c.available).length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                <p className="text-white/70 text-xs uppercase tracking-wide">Favorites</p>
                <p className="text-2xl font-bold text-white">{favorites.length}</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
              <Shield className="w-4 h-4 text-emerald-300" />
              Verified Owners
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
              <Award className="w-4 h-4 text-amber-300" />
              Quality Assured
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
              <Zap className="w-4 h-4 text-cyan-300" />
              Instant Booking
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Input
                    placeholder="Search by make, model, or owner..."
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <Select
                options={rentalTypes}
                value={rentalType}
                onValueChange={setRentalType}
              />
              <Select
                options={durationOptions}
                value={duration}
                onValueChange={setDuration}
              />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={setShowFilters}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  More Filters
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      showFilters && 'rotate-180'
                    )}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm text-gray-600 font-medium">
                  {filteredCabs.length} vehicles found
                </p>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Select
                      label="Fuel Type"
                      options={[
                        { value: 'any', label: 'Any' },
                        { value: 'petrol', label: 'Petrol' },
                        { value: 'diesel', label: 'Diesel' },
                        { value: 'electric', label: 'Electric' },
                        { value: 'hybrid', label: 'Hybrid' },
                      ]}
                      value="any"
                      onValueChange={() => { }}
                    />
                    <Select
                      label="Transmission"
                      options={[
                        { value: 'any', label: 'Any' },
                        { value: 'manual', label: 'Manual' },
                        { value: 'automatic', label: 'Automatic' },
                      ]}
                      value="any"
                      onValueChange={() => { }}
                    />
                    <Select
                      label="Seats"
                      options={[
                        { value: 'any', label: 'Any' },
                        { value: '4', label: '4 Seats' },
                        { value: '5', label: '5 Seats' },
                        { value: '7', label: '7+ Seats' },
                      ]}
                      value="any"
                      onValueChange={() => { }}
                    />
                    <Select
                      label="Price Range"
                      options={[
                        { value: 'any', label: 'Any' },
                        { value: 'budget', label: 'Under ₹2000/day' },
                        { value: 'mid', label: '₹2000-3000/day' },
                        { value: 'premium', label: 'Above ₹3000/day' },
                      ]}
                      value="any"
                      onValueChange={() => { }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* Cab Grid */}
      <motion.div variants={itemVariants}>
        {filteredCabs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCabs.map((cab, index) => (
              <CabCard
                key={cab.id}
                cab={cab}
                index={index}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
        <Car className="w-12 h-12 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No vehicles found
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        Try adjusting your filters or search terms to find the perfect ride.
      </p>
    </motion.div>
  );
}

function CabCard({
  cab,
  index,
  favorites,
  toggleFavorite,
}: {
  cab: AvailableCabDisplay;
  index: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}) {
  const isFavorite = favorites.includes(cab.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card
        padding="none"
        className={cn(
          'overflow-hidden h-full flex flex-col bg-white border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300',
          !cab.available && 'opacity-75'
        )}
      >
        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {cab.image ? (
            <img
              src={cab.image}
              alt={`${cab.make} ${cab.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-20 h-20 text-gray-300" />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(cab.id);
            }}
            className={cn(
              'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
              isFavorite
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/90 hover:bg-white'
            )}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isFavorite ? 'text-white fill-white' : 'text-gray-400'
              )}
            />
          </button>

          {/* Availability Badge */}
          {!cab.available && (
            <Badge variant="default" className="absolute top-3 left-3 bg-gray-900/80 text-white border-0">
              <Clock className="w-3 h-3 mr-1" />
              Not Available
            </Badge>
          )}

          {/* Popular Badge */}
          {cab.rating >= 4.5 && cab.available && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-3 text-white text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {cab.seats}
              </span>
              <span className="flex items-center gap-1">
                <Fuel className="w-4 h-4" />
                {cab.fuel}
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="w-4 h-4" />
                {cab.transmission}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                {cab.make} {cab.model}
              </h3>
              <p className="text-sm text-gray-500">{cab.year} • {cab.color}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-gray-900">{cab.rating}</span>
              <span className="text-gray-400 text-sm">({cab.reviews})</span>
            </div>
          </div>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
              <Users className="w-3.5 h-3.5" />
              {cab.seats} Seats
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
              <Fuel className="w-3.5 h-3.5" />
              {cab.fuel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
              <Gauge className="w-3.5 h-3.5" />
              {cab.transmission}
            </span>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {cab.ownerName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {cab.ownerName}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield className="w-3 h-3 text-emerald-500" />
                Verified Owner
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cab.pricePerDay)}
                <span className="text-sm font-normal text-gray-500">/day</span>
              </p>
              <p className="text-xs text-gray-500">
                + {formatCurrency(cab.pricePerKm)}/km
              </p>
            </div>
            <Link to={`${ROUTES.CUSTOMER.RENTALS}/details/${cab.id}`}>
              <Button
                size="sm"
                disabled={!cab.available}
                className={cn(
                  'shadow-sm',
                  cab.available
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600'
                    : 'bg-gray-300'
                )}
              >
                {cab.available ? 'View Details' : 'Unavailable'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
