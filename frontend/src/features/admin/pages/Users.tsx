import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/shared/utils';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { AdminPageHeader, AdminStatCard, AdminTableWrapper, tableStyles } from '../components';

export function AdminUsers() {
  const {
    searchQuery,
    statusFilter,
    selectedUser,
    showActionMenu,
    filteredUsers,
    totalCount,
    activeCount,
    suspendedCount,
    inactiveCount,
    setSearchQuery,
    setStatusFilter,
    setSelectedUser,
    toggleActionMenu,
    closeModal,
  } = useAdminUsers();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        subtitle="Manage customer accounts and permissions"
        icon={Users}
        iconColor="primary"
        action={
          <Button leftIcon={<UserPlus className="w-5 h-5" />}>Add User</Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <AdminStatCard
          label="Total Users"
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
          label="Suspended"
          value={suspendedCount}
          icon={Ban}
          color="error"
          delay={0.2}
        />
        <AdminStatCard
          label="Inactive"
          value={inactiveCount}
          icon={UserX}
          color="gray"
          delay={0.25}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4"
      >
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<Search className="w-4 h-4" />}
          className="w-80"
        />
        <Select
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          value={statusFilter}
          onValueChange={setStatusFilter}
        />
      </motion.div>

      <AdminTableWrapper
        isEmpty={filteredUsers.length === 0}
        emptyState={{
          icon: Users,
          title: 'No users found',
          description: 'Try adjusting your search or filter to find what you\'re looking for.',
        }}
      >
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            <tr>
              <th className={tableStyles.th}>User</th>
              <th className={tableStyles.th}>Contact</th>
              <th className={tableStyles.th}>Location</th>
              <th className={tableStyles.th}>Joined</th>
              <th className={tableStyles.th}>Trips</th>
              <th className={tableStyles.th}>Status</th>
              <th className={tableStyles.th}></th>
            </tr>
          </thead>
          <tbody className={tableStyles.tbody}>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={tableStyles.tr}
              >
                <td className={tableStyles.td}>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar size="sm" name={user.name} />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className={`${tableStyles.td} ${tableStyles.tdText}`}>
                  {user.phone}
                </td>
                <td className={`${tableStyles.td} ${tableStyles.tdText}`}>
                  {user.location}
                </td>
                <td className={`${tableStyles.td} ${tableStyles.tdText}`}>
                  {formatDate(user.joinedAt)}
                </td>
                <td className={`${tableStyles.td} ${tableStyles.tdBold}`}>
                  {user.totalTrips}
                </td>
                <td className={tableStyles.td}>{getStatusBadge(user.status)}</td>
                <td className={`${tableStyles.td} relative`}>
                  <button
                    onClick={() => toggleActionMenu(user.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showActionMenu === user.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10 min-w-[160px]"
                    >
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      {user.status === 'active' ? (
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
        open={!!selectedUser}
        onOpenChange={closeModal}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="xl" name={selectedUser.name} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedUser.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedUser.status)}
                  <span className="text-sm text-gray-500 capitalize">
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{selectedUser.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedUser.joinedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card padding="md" className="text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <p className="text-2xl font-bold text-primary-600">
                  {selectedUser.totalTrips}
                </p>
                <p className="text-sm text-primary-600">Total Trips</p>
              </Card>
              <Card padding="md" className="text-center bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                <p className="text-2xl font-bold text-success-600">
                  ₹{selectedUser.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-success-600">Total Spent</p>
              </Card>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" fullWidth>
                View Trips
              </Button>
              <Button variant="outline" fullWidth>
                Send Message
              </Button>
              {selectedUser.status === 'active' ? (
                <Button variant="danger" fullWidth>
                  Suspend User
                </Button>
              ) : (
                <Button fullWidth>Activate User</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
