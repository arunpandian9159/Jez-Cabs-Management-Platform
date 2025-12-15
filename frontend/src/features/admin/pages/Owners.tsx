import { motion } from 'framer-motion';
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    Building2,
    Car,
    Users,
    Calendar,
    Ban,
    CheckCircle,
    Edit,
    Trash2,
    FileText,
    CreditCard,
    Wallet,
    TrendingUp,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useAdminOwners } from '../hooks/useAdminOwners';
import { AdminPageHeader, AdminStatCard, AdminTableWrapper, tableStyles } from '../components';

export function AdminOwners() {
    const {
        searchQuery,
        statusFilter,
        selectedOwner,
        showActionMenu,
        filteredOwners,
        totalCount,
        activeCount,
        pendingCount,
        totalCabs,
        totalRevenue,
        setSearchQuery,
        setStatusFilter,
        setSelectedOwner,
        toggleActionMenu,
        closeModal,
    } = useAdminOwners();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'pending':
                return <Badge variant="warning">Pending</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'suspended':
                return <Badge variant="error">Suspended</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Cab Owner Management"
                subtitle="Manage cab owners, their fleets, and payouts"
                icon={Building2}
                iconColor="accent"
                action={
                    <Button leftIcon={<UserPlus className="w-5 h-5" />}>Add Owner</Button>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
                <AdminStatCard
                    label="Total Owners"
                    value={totalCount}
                    icon={Building2}
                    color="primary"
                    delay={0.1}
                />
                <AdminStatCard
                    label="Active"
                    value={activeCount}
                    icon={CheckCircle}
                    color="success"
                    delay={0.15}
                />
                <AdminStatCard
                    label="Pending"
                    value={pendingCount}
                    icon={Clock}
                    color="warning"
                    delay={0.2}
                />
                <AdminStatCard
                    label="Total Cabs"
                    value={totalCabs}
                    icon={Car}
                    color="accent"
                    delay={0.25}
                />
                <AdminStatCard
                    label="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    icon={TrendingUp}
                    color="success"
                    delay={0.3}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
            >
                <Input
                    placeholder="Search by name, email, phone, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<Search className="w-4 h-4" />}
                    className="w-96"
                />
                <Select
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'suspended', label: 'Suspended' },
                    ]}
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                />
            </motion.div>

            <AdminTableWrapper
                isEmpty={filteredOwners.length === 0}
                emptyState={{
                    icon: Building2,
                    title: 'No cab owners found',
                    description: 'Try adjusting your search or filter to find what you\'re looking for.',
                }}
            >
                <table className={tableStyles.table}>
                    <thead className={tableStyles.thead}>
                        <tr>
                            <th className={tableStyles.th}>Owner</th>
                            <th className={tableStyles.th}>Company</th>
                            <th className={tableStyles.th}>Cabs</th>
                            <th className={tableStyles.th}>Drivers</th>
                            <th className={tableStyles.th}>Earnings</th>
                            <th className={tableStyles.th}>Status</th>
                            <th className={tableStyles.th}></th>
                        </tr>
                    </thead>
                    <tbody className={tableStyles.tbody}>
                        {filteredOwners.map((owner, index) => (
                            <motion.tr
                                key={owner.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={tableStyles.tr}
                            >
                                <td className={tableStyles.td}>
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => setSelectedOwner(owner)}
                                    >
                                        <Avatar size="sm" name={owner.name} />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {owner.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{owner.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={tableStyles.td}>
                                    {owner.companyName ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-accent-600" />
                                            </div>
                                            <span className="text-sm text-gray-900">{owner.companyName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Individual</span>
                                    )}
                                </td>
                                <td className={tableStyles.td}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <Car className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{owner.totalCabs}</span>
                                    </div>
                                </td>
                                <td className={tableStyles.td}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="text-sm text-gray-900">{owner.totalDrivers}</span>
                                    </div>
                                </td>
                                <td className={`${tableStyles.td} ${tableStyles.tdBold}`}>
                                    {formatCurrency(owner.totalEarnings)}
                                </td>
                                <td className={tableStyles.td}>{getStatusBadge(owner.status)}</td>
                                <td className={`${tableStyles.td} relative`}>
                                    <button
                                        onClick={() => toggleActionMenu(owner.id)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {showActionMenu === owner.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute right-4 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10 min-w-[160px]"
                                        >
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                <Car className="w-4 h-4" /> View Fleet
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                <FileText className="w-4 h-4" /> Documents
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                <Wallet className="w-4 h-4" /> Payouts
                                            </button>
                                            {owner.status === 'active' ? (
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
                open={!!selectedOwner}
                onOpenChange={closeModal}
                title="Cab Owner Details"
                size="md"
            >
                {selectedOwner && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedOwner.name} />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedOwner.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusBadge(selectedOwner.status)}
                                    {selectedOwner.companyName && (
                                        <span className="text-sm text-gray-500">{selectedOwner.companyName}</span>
                                    )}
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
                                    <p className="text-sm text-gray-900">{selectedOwner.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-success-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-warning-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Joined</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedOwner.joinedAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-accent-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Bank Account</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.bankAccount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">PAN Number</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.panNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">GST Number</p>
                                    <p className="text-sm text-gray-900">
                                        {selectedOwner.gstNumber || 'Not Registered'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card padding="md" className="text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                                <p className="text-2xl font-bold text-primary-600">
                                    {selectedOwner.totalCabs}
                                </p>
                                <p className="text-sm text-primary-600">Total Cabs</p>
                            </Card>
                            <Card padding="md" className="text-center bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
                                <p className="text-2xl font-bold text-accent-600">
                                    {selectedOwner.totalDrivers}
                                </p>
                                <p className="text-sm text-accent-600">Active Drivers</p>
                            </Card>
                            <Card padding="md" className="text-center bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                                <p className="text-2xl font-bold text-success-600">
                                    {formatCurrency(selectedOwner.totalEarnings)}
                                </p>
                                <p className="text-sm text-success-600">Total Earnings</p>
                            </Card>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" fullWidth>
                                View Fleet
                            </Button>
                            <Button variant="outline" fullWidth>
                                Payout History
                            </Button>
                            {selectedOwner.status === 'active' ? (
                                <Button variant="danger" fullWidth>
                                    Suspend Owner
                                </Button>
                            ) : (
                                <Button fullWidth>Activate Owner</Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
