import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Star,
  Phone,
  MessageSquare,
  Mail,
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
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { useManageDrivers } from '../hooks/useManageDrivers';
import { OwnerPageHeader } from '../components/OwnerPageHeader';
import { OwnerStatCard } from '../components/OwnerStatCard';

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
        className="grid grid-cols-4 gap-4"
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
      <Modal
        open={!!selectedDriver}
        onOpenChange={() => setSelectedDriver(null)}
        title={selectedDriver?.name || ''}
        size="md"
      >
        {selectedDriver && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="xl" name={selectedDriver.name} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDriver.name}
                </h3>
                <p className="text-gray-500">{selectedDriver.phone}</p>
                <p className="text-sm text-gray-400">{selectedDriver.email}</p>
              </div>
            </div>
            {selectedDriver.cab ? (
              <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <p className="text-sm text-primary-600 mb-2 font-medium">Assigned Vehicle</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedDriver.cab.make} {selectedDriver.cab.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedDriver.cab.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-xl text-center">
                <p className="text-warning-700 font-medium">No vehicle assigned</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Assign Vehicle
                </Button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
              >
                <p className="text-sm text-gray-500">Acceptance Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedDriver.metrics.acceptanceRate}%
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
              >
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedDriver.metrics.completionRate}%
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-xl"
              >
                <p className="text-sm text-success-600">Total Earnings</p>
                <p className="text-2xl font-bold text-success-700">
                  {formatCurrency(selectedDriver.metrics.totalEarnings)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl"
              >
                <p className="text-sm text-primary-600">Total Trips</p>
                <p className="text-2xl font-bold text-primary-700">
                  {selectedDriver.metrics.totalTrips}
                </p>
              </motion.div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Phone className="w-4 h-4" />}
              >
                Call
              </Button>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Email
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Driver Modal */}
      <Modal
        open={showAddDriverModal}
        onOpenChange={handleCloseAddDriverModal}
        title="Invite New Driver"
        size="md"
      >
        <div className="space-y-4">
          {inviteError && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              {inviteError}
            </div>
          )}
          {inviteSuccess && (
            <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl text-success-700 text-sm">
              Invitation sent successfully! The driver will receive an email
              with instructions to join.
            </div>
          )}
          {!inviteSuccess && (
            <>
              <p className="text-gray-500 text-sm">
                Enter the driver's details below to send them an invitation to
                join your fleet.
              </p>
              <Input
                label="Full Name *"
                placeholder="e.g., John Doe"
                value={newDriver.name}
                onChange={(e) => updateNewDriver('name', e.target.value)}
              />
              <Input
                label="Phone Number *"
                placeholder="e.g., 9876543210"
                value={newDriver.phone}
                onChange={(e) => updateNewDriver('phone', e.target.value)}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g., driver@example.com"
                value={newDriver.email}
                onChange={(e) => updateNewDriver('email', e.target.value)}
              />
            </>
          )}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleCloseAddDriverModal(false)}
            >
              {inviteSuccess ? 'Close' : 'Cancel'}
            </Button>
            {!inviteSuccess && (
              <Button
                fullWidth
                onClick={handleInviteDriver}
                loading={isInviting}
                disabled={isInviting}
              >
                Send Invitation
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
