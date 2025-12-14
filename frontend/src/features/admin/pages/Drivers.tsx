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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useAdminDrivers } from '../hooks/useAdminDrivers';

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

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
        );
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
                        Driver Management
                    </h1>
                    <p className="text-gray-500">
                        Manage driver accounts, vehicles, and verification
                    </p>
                </div>
                <Button leftIcon={<UserPlus className="w-5 h-5" />}>Add Driver</Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                    <p className="text-sm text-gray-500">Total Drivers</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-success-600">{activeCount}</p>
                    <p className="text-sm text-gray-500">Active</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-warning-600">{pendingCount}</p>
                    <p className="text-sm text-gray-500">Pending Verification</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-400">{inactiveCount}</p>
                    <p className="text-sm text-gray-500">Inactive</p>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
            >
                <Input
                    placeholder="Search by name, email, phone, or vehicle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<Search className="w-4 h-4" />}
                    className="w-80"
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
                                        Driver
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Vehicle
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Rating
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Trips
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
                                {filteredDrivers.map((driver, index) => (
                                    <motion.tr
                                        key={driver.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer"
                                                onClick={() => setSelectedDriver(driver)}
                                            >
                                                <Avatar size="sm" name={driver.name} />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {driver.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{driver.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-900">{driver.vehicleNumber}</p>
                                                    <p className="text-xs text-gray-500">{driver.vehicleType}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{renderStars(driver.rating)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {driver.totalTrips.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {formatCurrency(driver.totalEarnings)}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(driver.status)}</td>
                                        <td className="py-3 px-4 relative">
                                            <button
                                                onClick={() => toggleActionMenu(driver.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                            {showActionMenu === driver.id && (
                                                <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Edit className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FileText className="w-4 h-4" /> Documents
                                                    </button>
                                                    {driver.status === 'active' ? (
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
                open={!!selectedDriver}
                onOpenChange={closeModal}
                title="Driver Details"
                size="md"
            >
                {selectedDriver && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedDriver.name} />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedDriver.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusBadge(selectedDriver.status)}
                                    {renderStars(selectedDriver.rating)}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm text-gray-900">{selectedDriver.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedDriver.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Car className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Vehicle</p>
                                    <p className="text-sm text-gray-900">
                                        {selectedDriver.vehicleNumber} ({selectedDriver.vehicleType})
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Joined</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedDriver.joinedAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">License Number</p>
                                    <p className="text-sm text-gray-900">{selectedDriver.licenseNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">License Expiry</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedDriver.licenseExpiry)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="md" className="text-center bg-primary-50">
                                <p className="text-2xl font-bold text-primary-600">
                                    {selectedDriver.totalTrips.toLocaleString()}
                                </p>
                                <p className="text-sm text-primary-600">Total Trips</p>
                            </Card>
                            <Card padding="md" className="text-center bg-success-50">
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
