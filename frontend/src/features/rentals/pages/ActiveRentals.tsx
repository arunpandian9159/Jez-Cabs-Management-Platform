import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Calendar,
  Clock,
  Phone,
  ChevronRight,
  FileText,
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
import { formatCurrency, formatDate } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import {
  useActiveRentals,
  type RentalDisplay,
} from '../hooks/useActiveRentals';

export function ActiveRentals() {
  const { activeTab, activeRentals, pastRentals, setActiveTab } =
    useActiveRentals();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Rentals</h1>
          <p className="text-gray-500">Manage your rental bookings</p>
        </div>
        <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
          <Button>Browse Cabs</Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeRentals.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({pastRentals.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {activeRentals.length === 0 ? (
              <EmptyActiveState />
            ) : (
              <div className="space-y-4">
                {activeRentals.map((rental, index) => (
                  <ActiveRentalCard
                    key={rental.id}
                    rental={rental}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <div className="space-y-4">
              {pastRentals.map((rental, index) => (
                <PastRentalCard key={rental.id} rental={rental} index={index} />
              ))}
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>
    </div>
  );
}

function EmptyActiveState() {
  return (
    <Card padding="lg" className="text-center">
      <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">No active rentals</h3>
      <p className="text-gray-500 mb-4">
        You don't have any active rental bookings right now.
      </p>
      <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
        <Button>Browse Available Cabs</Button>
      </Link>
    </Card>
  );
}

function ActiveRentalCard({
  rental,
  index,
}: {
  rental: RentalDisplay;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card padding="md">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            <Car className="w-10 h-10 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {rental.cab.make} {rental.cab.model}
                </h3>
                <p className="text-sm text-gray-500">
                  {rental.cab.registrationNumber} • {rental.cab.color}
                </p>
              </div>
              <StatusBadge status={rental.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {rental.daysRemaining} days remaining
                </span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Payment Progress</span>
                <span className="font-medium">
                  {formatCurrency(rental.paidAmount)} /{' '}
                  {formatCurrency(rental.totalAmount)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{
                    width: `${(rental.paidAmount / rental.totalAmount) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Phone className="w-4 h-4" />}
              >
                Call Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-4 h-4" />}
              >
                View Details
              </Button>
              <Button variant="ghost" size="sm">
                Extend Rental
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function PastRentalCard({
  rental,
  index,
}: {
  rental: RentalDisplay;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {rental.cab.make} {rental.cab.model}
              </h3>
              <StatusBadge status={rental.status} />
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatCurrency(rental.totalAmount)}
            </p>
            {rental.refundAmount && (
              <p className="text-xs text-success-600">
                Refund: {formatCurrency(rental.refundAmount)}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Card>
    </motion.div>
  );
}
