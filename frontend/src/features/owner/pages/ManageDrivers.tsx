import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Star,
  Phone,
  MessageSquare,
  MoreVertical,
  Car,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { useManageDrivers } from '../hooks/useManageDrivers';
import { OwnerPageHeader } from '../components/OwnerPageHeader';
import { OwnerStatCard } from '../components/OwnerStatCard';
import { DriverDetailsModal, AddDriverModal } from '../components/manageDrivers';

export function ManageDrivers() {
  const {
    searchQuery,
    statusFilter,
    selectedDriver,
    drivers,
    isLoading,
    error,
    showAddDriverModal,
    newDriver,
    isInviting,
    inviteError,
    inviteSuccess,
    stats,
    setSearchQuery,
    setStatusFilter,
    setSelectedDriver,
    setShowAddDriverModal,
    handleInviteDriver,
    handleCloseAddDriverModal,
    updateNewDriver,
  } = useManageDrivers();

  if (isLoading) {
    return <PageLoader message="Loading drivers..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Manage Drivers"
        subtitle="View and manage your driver team"
        icon={Users}
        iconColor="accent"
        action={
          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => setShowAddDriverModal(true)}
          >
            Add Driver
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
        <OwnerStatCard
          label="Total Drivers"
          value={stats.total}
          icon={Users}
          color="primary"
          delay={0.1}
        />
        <OwnerStatCard
          label="Active"
          value={stats.active}
          icon={UserCheck}
          color="success"
          delay={0.15}
        />
        <OwnerStatCard
          label="Inactive"
          value={stats.inactive}
          icon={UserX}
          color="gray"
          delay={0.2}
        />
        <OwnerStatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          color="warning"
          delay={0.25}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="md" className="bg-gradient-to-r from-gray-50 to-white">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or phone..."
                prefix={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ]}
              value={statusFilter}
              onValueChange={setStatusFilter}
            />
          </div>
        </Card>
      </motion.div>

      {/* Drivers List */}
      <div className="space-y-3">
        {drivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.03 }}
            whileHover={{ scale: 1.005 }}
          >
            <Card
              padding="md"
              interactive
              onClick={() => setSelectedDriver(driver)}
              className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary-500"
            >
              <div className="flex items-center gap-4">
                <Avatar size="lg" name={driver.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {driver.name}
                    </h3>
                    <StatusBadge status={driver.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{driver.phone}</span>
                    {driver.cab && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {driver.cab.make} {driver.cab.model}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {driver.status === 'active' && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center px-3 py-2 bg-warning-50 rounded-xl">
                      <div className="flex items-center gap-1 justify-center">
                        <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                        <span className="font-bold text-warning-700">
                          {driver.metrics.rating}
                        </span>
                      </div>
                      <p className="text-xs text-warning-600 mt-0.5">Rating</p>
                    </div>
                    <div className="text-center px-3 py-2 bg-primary-50 rounded-xl">
                      <p className="font-bold text-primary-700">
                        {driver.metrics.totalTrips}
                      </p>
                      <p className="text-xs text-primary-600 mt-0.5">Trips</p>
                    </div>
                    <div className="text-center px-3 py-2 bg-success-50 rounded-xl">
                      <p className="font-bold text-success-700">
                        {formatCurrency(driver.metrics.thisMonthEarnings)}
                      </p>
                      <p className="text-xs text-success-600 mt-0.5">This Month</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Driver Details Modal */}
      <DriverDetailsModal
        driver={selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />

      {/* Add Driver Modal */}
      <AddDriverModal
        open={showAddDriverModal}
        driver={newDriver}
        isInviting={isInviting}
        inviteError={inviteError}
        inviteSuccess={inviteSuccess}
        onOpenChange={handleCloseAddDriverModal}
        onFieldChange={updateNewDriver}
        onSubmit={handleInviteDriver}
      />
    </div>
  );
}
