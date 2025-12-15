import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Car,
  Star,
  Calendar,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  FileText,
  CreditCard,
  UserCheck,
  Clock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/shared/utils';
import {
  useAdminDrivers,
  statusOptions,
  statusBadgeVariants,
} from '../hooks/useAdminDrivers';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminTableWrapper,
  tableStyles,
} from '../components';

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant={statusBadgeVariants[status] || 'secondary'}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ))}
    <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
  </div>
);

export function AdminDrivers() {
  const {
    searchQuery,
    statusFilter,
    selectedDriver,
    showActionMenu,
    filteredDrivers,
    totalCount,
    activeCount,
    pendingCount,
    inactiveCount,
    setSearchQuery,
    setStatusFilter,
    setSelectedDriver,
    toggleActionMenu,
    closeModal,
  } = useAdminDrivers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Driver Management"
        subtitle="Manage driver accounts, vehicles, and verification"
        icon={UserCheck}
        iconColor="success"
        action={
          <Button leftIcon={<UserPlus className="w-5 h-5" />}>
            Add Driver
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <AdminStatCard
          label="Total Drivers"
          value={totalCount}
          icon={Users}
          color="primary"
          delay={0.1}
        />
        <AdminStatCard
          label="Active"
          value={activeCount}
          icon={UserCheck}
          color="success"
          delay={0.15}
        />
        <AdminStatCard
          label={
            <>
              <span className="sm:hidden">Pending</span>
              <span className="hidden sm:inline">Pending Verification</span>
            </>
          }
          value={pendingCount}
          icon={Clock}
          color="warning"
          delay={0.2}
        />
        <AdminStatCard
          label="Inactive"
          value={inactiveCount}
          icon={Ban}
          color="gray"
          delay={0.25}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
      >
        <Input
          placeholder="Search by name, email, phone, or vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<Search className="w-4 h-4" />}
          className="w-full sm:w-80"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onValueChange={setStatusFilter}
        />
      </motion.div>

      <AdminTableWrapper
        isEmpty={filteredDrivers.length === 0}
        emptyState={{
          icon: UserCheck,
          title: 'No drivers found',
          description:
            "Try adjusting your search or filter to find what you're looking for.",
        }}
      >
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            <tr>
              <th className={tableStyles.th}>Driver</th>
              <th className={`${tableStyles.th} hidden md:table-cell`}>
                Vehicle
              </th>
              <th className={`${tableStyles.th} hidden lg:table-cell`}>
                Rating
              </th>
              <th className={tableStyles.th}>Trips</th>
              <th className={`${tableStyles.th} hidden sm:table-cell`}>
                Earnings
              </th>
              <th className={tableStyles.th}>Status</th>
              <th className={tableStyles.th}></th>
            </tr>
          </thead>
          <tbody className={tableStyles.tbody}>
            {filteredDrivers.map((driver, index) => (
              <motion.tr
                key={driver.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={tableStyles.tr}
              >
                <td className={tableStyles.td}>
                  <div
                    className="cursor-pointer"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.phone}</p>
                  </div>
                </td>
                <td className={`${tableStyles.td} hidden md:table-cell`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 hidden lg:flex items-center justify-center">
                      <Car className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {driver.vehicleNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {driver.vehicleType}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={`${tableStyles.td} hidden lg:table-cell`}>
                  <StarRating rating={driver.rating} />
                </td>
                <td className={`${tableStyles.td} ${tableStyles.tdBold}`}>
                  {driver.totalTrips.toLocaleString()}
                </td>
                <td
                  className={`${tableStyles.td} ${tableStyles.tdBold} hidden sm:table-cell`}
                >
                  {formatCurrency(driver.totalEarnings)}
                </td>
                <td className={tableStyles.td}>
                  <StatusBadge status={driver.status} />
                </td>
                <td className={`${tableStyles.td} relative`}>
                  <button
                    onClick={() => toggleActionMenu(driver.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showActionMenu === driver.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10 min-w-[160px]"
                    >
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FileText className="w-4 h-4" /> Documents
                      </button>
                      {driver.status === 'active' ? (
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50">
                          <Ban className="w-4 h-4" /> Suspend
                        </button>
                      ) : (
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-success-600 hover:bg-success-50">
                          <CheckCircle className="w-4 h-4" /> Activate
                        </button>
                      )}
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </motion.div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrapper>

      <Modal
        open={!!selectedDriver}
        onOpenChange={closeModal}
        title="Driver Details"
        size="md"
      >
        {selectedDriver && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedDriver.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedDriver.status} />
                  <StarRating rating={selectedDriver.rating} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Mail,
                  color: 'primary',
                  label: 'Email',
                  value: selectedDriver.email,
                },
                {
                  icon: Phone,
                  color: 'success',
                  label: 'Phone',
                  value: selectedDriver.phone,
                },
                {
                  icon: Car,
                  color: 'accent',
                  label: 'Vehicle',
                  value: `${selectedDriver.vehicleNumber} (${selectedDriver.vehicleType})`,
                },
                {
                  icon: Calendar,
                  color: 'warning',
                  label: 'Joined',
                  value: formatDate(selectedDriver.joinedAt),
                },
                {
                  icon: FileText,
                  color: 'gray',
                  label: 'License Number',
                  value: selectedDriver.licenseNumber,
                },
                {
                  icon: CreditCard,
                  color: 'error',
                  label: 'License Expiry',
                  value: formatDate(selectedDriver.licenseExpiry),
                },
              ].map(({ icon: Icon, color, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card
                padding="md"
                className="text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200"
              >
                <p className="text-2xl font-bold text-primary-600">
                  {selectedDriver.totalTrips.toLocaleString()}
                </p>
                <p className="text-sm text-primary-600">Total Trips</p>
              </Card>
              <Card
                padding="md"
                className="text-center bg-gradient-to-br from-success-50 to-success-100 border-success-200"
              >
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(selectedDriver.totalEarnings)}
                </p>
                <p className="text-sm text-success-600">Total Earnings</p>
              </Card>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" fullWidth>
                View Trips
              </Button>
              <Button variant="outline" fullWidth>
                View Documents
              </Button>
              {selectedDriver.status === 'active' ? (
                <Button variant="danger" fullWidth>
                  Suspend Driver
                </Button>
              ) : (
                <Button fullWidth>Activate Driver</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
