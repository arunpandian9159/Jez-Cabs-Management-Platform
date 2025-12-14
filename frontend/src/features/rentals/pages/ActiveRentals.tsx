import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Calendar,
  Clock,
  Phone,
  ChevronRight,
  FileText,
  Sparkles,
  Key,
  Star,
  Timer,
  CreditCard,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { formatCurrency, formatDate } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import {
  useActiveRentals,
  type RentalDisplay,
} from '../hooks/useActiveRentals';

export function ActiveRentals() {
  const { activeTab, activeRentals, pastRentals, setActiveTab } =
    useActiveRentals();

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
              'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
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
          className="absolute bottom-10 left-20 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"
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
                  <Key className="w-5 h-5 text-amber-200" />
                </motion.div>
                <span className="text-white/80 text-sm font-medium">
                  Your Rental Hub
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Rentals
              </h1>
              <p className="text-white/70 text-lg">
                Manage your rental bookings
              </p>
            </div>
            <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
              <Button
                variant="secondary"
                leftIcon={<Car className="w-4 h-4" />}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              >
                Browse More Cabs
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
              <p className="text-white/70 text-xs uppercase tracking-wide">Active</p>
              <p className="text-2xl font-bold text-white">{activeRentals.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
              <p className="text-white/70 text-xs uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-white">{pastRentals.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
          <TabsRoot value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <TabsList className="bg-gray-100/80">
                <TabsTrigger value="active" className="data-[state=active]:bg-white">
                  <Timer className="w-4 h-4 mr-2" />
                  Active ({activeRentals.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Past ({pastRentals.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="p-0">
              <AnimatePresence>
                {activeRentals.length === 0 ? (
                  <EmptyActiveState />
                ) : (
                  <div className="p-5 space-y-5">
                    {activeRentals.map((rental, index) => (
                      <ActiveRentalCard
                        key={rental.id}
                        rental={rental}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="past" className="p-0">
              <AnimatePresence>
                {pastRentals.length === 0 ? (
                  <EmptyPastState />
                ) : (
                  <div className="divide-y divide-gray-100">
                    {pastRentals.map((rental, index) => (
                      <PastRentalCard key={rental.id} rental={rental} index={index} />
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

function EmptyActiveState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6">
        <Car className="w-12 h-12 text-orange-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No active rentals
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        You don't have any active rental bookings right now. Browse our fleet and find your perfect ride!
      </p>
      <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
        <Button
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          Browse Available Cabs
        </Button>
      </Link>
    </motion.div>
  );
}

function EmptyPastState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
        <Clock className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No past rentals
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        Your rental history will appear here once you've completed a rental.
      </p>
    </motion.div>
  );
}

function ActiveRentalCard({
  rental,
  index,
}: {
  rental: RentalDisplay;
  index: number;
}) {
  const paymentPercentage = (rental.paidAmount / rental.totalAmount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Car Image Section */}
          <div className="relative lg:w-64 h-48 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            {rental.cab.imageUrl ? (
              <img
                src={rental.cab.imageUrl}
                alt={`${rental.cab.make} ${rental.cab.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Car className="w-16 h-16 text-gray-400" />
            )}
            {/* Status Badge Overlay */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="success"
                className="bg-emerald-500 text-white border-0 shadow-lg"
              >
                <Timer className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            {/* Days Remaining Badge */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                {rental.daysRemaining} days left
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {rental.cab.make} {rental.cab.model}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                    4.8
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{rental.cab.registrationNumber}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{rental.cab.color}</span>
                </div>
              </div>
              <StatusBadge status={rental.status} />
            </div>

            {/* Rental Period */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  Rental Period
                </div>
                <p className="font-semibold text-gray-900">
                  {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <p className="font-semibold text-gray-900">
                  {rental.totalDays} days
                </p>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Payment Progress</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(rental.paidAmount)} / {formatCurrency(rental.totalAmount)}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${paymentPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              {paymentPercentage < 100 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(rental.totalAmount - rental.paidAmount)} remaining
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Phone className="w-4 h-4" />}
                className="border-gray-200 hover:border-primary-500 hover:text-primary-600"
              >
                Call Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-4 h-4" />}
                className="border-gray-200 hover:border-primary-500 hover:text-primary-600"
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
              >
                Extend Rental
              </Button>
              {paymentPercentage < 100 && (
                <Button
                  size="sm"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 ml-auto"
                >
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PastRentalCard({
  rental,
  index,
}: {
  rental: RentalDisplay;
  index: number;
})
{
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center gap-4 p-5 hover:bg-gray-50/80 transition-all duration-300 cursor-pointer">
        {/* Car Image */}
        <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {rental.cab.imageUrl ? (
            <img
              src={rental.cab.imageUrl}
              alt={`${rental.cab.make} ${rental.cab.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Car className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {rental.cab.make} {rental.cab.model}
            </h3>
            <StatusBadge status={rental.status} />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{rental.totalDays} days</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(rental.totalAmount)}
          </p>
          {rental.refundAmount && (
            <p className="text-xs text-emerald-600 font-medium">
              Refund: {formatCurrency(rental.refundAmount)}
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </motion.div>
  );
}
