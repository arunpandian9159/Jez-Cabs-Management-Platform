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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Cab Owner Management
                    </h1>
                    <p className="text-gray-500">
                        Manage cab owners, their fleets, and payouts
                    </p>
                </div>
                <Button leftIcon={<UserPlus className="w-5 h-5" />}>Add Owner</Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-5 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                    <p className="text-sm text-gray-500">Total Owners</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-success-600">{activeCount}</p>
                    <p className="text-sm text-gray-500">Active</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-warning-600">{pendingCount}</p>
                    <p className="text-sm text-gray-500">Pending</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-primary-600">{totalCabs}</p>
                    <p className="text-sm text-gray-500">Total Cabs</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-success-600">{formatCurrency(totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </Card>
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Owner
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Company
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Cabs
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Drivers
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Earnings
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOwners.map((owner, index) => (
                                    <motion.tr
                                        key={owner.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
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
                                        <td className="py-3 px-4">
                                            {owner.companyName ? (
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{owner.companyName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Individual</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-primary-600" />
                                                <span className="text-sm font-medium text-gray-900">{owner.totalCabs}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900">{owner.totalDrivers}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {formatCurrency(owner.totalEarnings)}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(owner.status)}</td>
                                        <td className="py-3 px-4 relative">
                                            <button
                                                onClick={() => toggleActionMenu(owner.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                            {showActionMenu === owner.id && (
                                                <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Edit className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Car className="w-4 h-4" /> View Fleet
                                                    </button>
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FileText className="w-4 h-4" /> Documents
                                                    </button>
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Wallet className="w-4 h-4" /> Payouts
                                                    </button>
                                                    {owner.status === 'active' ? (
                                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50">
                                                            <Ban className="w-4 h-4" /> Suspend
                                                        </button>
                                                    ) : (
                                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-success-600 hover:bg-success-50">
                                                            <CheckCircle className="w-4 h-4" /> Activate
                                                        </button>
                                                    )}
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50">
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

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
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Joined</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedOwner.joinedAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Bank Account</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.bankAccount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">PAN Number</p>
                                    <p className="text-sm text-gray-900">{selectedOwner.panNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Building2 className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">GST Number</p>
                                    <p className="text-sm text-gray-900">
                                        {selectedOwner.gstNumber || 'Not Registered'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Card padding="md" className="text-center bg-primary-50">
                                <p className="text-2xl font-bold text-primary-600">
                                    {selectedOwner.totalCabs}
                                </p>
                                <p className="text-sm text-primary-600">Total Cabs</p>
                            </Card>
                            <Card padding="md" className="text-center bg-info-50">
                                <p className="text-2xl font-bold text-info-600">
                                    {selectedOwner.totalDrivers}
                                </p>
                                <p className="text-sm text-info-600">Active Drivers</p>
                            </Card>
                            <Card padding="md" className="text-center bg-success-50">
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
