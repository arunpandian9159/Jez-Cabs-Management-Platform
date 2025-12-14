import { motion } from 'framer-motion';
import {
    Search,
    Plus,
    MoreVertical,
    Car,
    User,
    Calendar,
    Fuel,
    Users,
    Wrench,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/shared/utils';
import { useAdminVehicles } from '../hooks/useAdminVehicles';

export function AdminVehicles() {
    const {
        searchQuery,
        typeFilter,
        statusFilter,
        selectedVehicle,
        showActionMenu,
        filteredVehicles,
        sedanCount,
        suvCount,
        hatchbackCount,
        luxuryCount,
        totalCount,
        activeCount,
        maintenanceCount,
        inactiveCount,
        setSearchQuery,
        setTypeFilter,
        setStatusFilter,
        setSelectedVehicle,
        toggleActionMenu,
        closeModal,
    } = useAdminVehicles();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'maintenance':
                return <Badge variant="warning">Maintenance</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return null;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'sedan':
                return <Badge variant="primary">Sedan</Badge>;
            case 'suv':
                return <Badge variant="info">SUV</Badge>;
            case 'hatchback':
                return <Badge variant="secondary">Hatchback</Badge>;
            case 'luxury':
                return <Badge variant="warning">Luxury</Badge>;
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
                        Vehicle Management
                    </h1>
                    <p className="text-gray-500">
                        Manage fleet vehicles, maintenance, and assignments
                    </p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />}>Add Vehicle</Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{sedanCount}</p>
                    <p className="text-sm text-gray-500">Sedans</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-accent-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{suvCount}</p>
                    <p className="text-sm text-gray-500">SUVs</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{hatchbackCount}</p>
                    <p className="text-sm text-gray-500">Hatchbacks</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{luxuryCount}</p>
                    <p className="text-sm text-gray-500">Luxury</p>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2"
            >
                <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-success-500"></span>
                        Active: {activeCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-warning-500"></span>
                        Maintenance: {maintenanceCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        Inactive: {inactiveCount}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="font-medium">Total: {totalCount}</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
            >
                <Input
                    placeholder="Search by make, model, plate, or driver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<Search className="w-4 h-4" />}
                    className="w-80"
                />
                <Select
                    options={[
                        { value: 'all', label: 'All Types' },
                        { value: 'sedan', label: 'Sedan' },
                        { value: 'suv', label: 'SUV' },
                        { value: 'hatchback', label: 'Hatchback' },
                        { value: 'luxury', label: 'Luxury' },
                    ]}
                    value={typeFilter}
                    onValueChange={setTypeFilter}
                />
                <Select
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'maintenance', label: 'Maintenance' },
                        { value: 'inactive', label: 'Inactive' },
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
                                        Vehicle
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Type
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Driver
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Trips
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Last Service
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVehicles.map((vehicle, index) => (
                                    <motion.tr
                                        key={vehicle.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer"
                                                onClick={() => setSelectedVehicle(vehicle)}
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Car className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {vehicle.make} {vehicle.model}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{vehicle.plateNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{getTypeBadge(vehicle.type)}</td>
                                        <td className="py-3 px-4">
                                            {vehicle.driverName ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{vehicle.driverName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {vehicle.totalTrips.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {formatDate(vehicle.lastService)}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(vehicle.status)}</td>
                                        <td className="py-3 px-4 relative">
                                            <button
                                                onClick={() => toggleActionMenu(vehicle.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                            {showActionMenu === vehicle.id && (
                                                <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Edit className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Wrench className="w-4 h-4" /> Maintenance
                                                    </button>
                                                    {vehicle.status === 'active' ? (
                                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warning-600 hover:bg-warning-50">
                                                            <AlertCircle className="w-4 h-4" /> Mark Inactive
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
                open={!!selectedVehicle}
                onOpenChange={closeModal}
                title="Vehicle Details"
                size="md"
            >
                {selectedVehicle && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Car className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedVehicle.make} {selectedVehicle.model}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {getTypeBadge(selectedVehicle.type)}
                                    {getStatusBadge(selectedVehicle.status)}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Car className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Plate Number</p>
                                    <p className="text-sm text-gray-900">{selectedVehicle.plateNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Year</p>
                                    <p className="text-sm text-gray-900">{selectedVehicle.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Fuel className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Fuel Type</p>
                                    <p className="text-sm text-gray-900">{selectedVehicle.fuelType}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Seating Capacity</p>
                                    <p className="text-sm text-gray-900">{selectedVehicle.seatingCapacity} seats</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Assigned Driver</p>
                                    <p className="text-sm text-gray-900">
                                        {selectedVehicle.driverName || 'Not Assigned'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Wrench className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Last Service</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedVehicle.lastService)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="md" className="text-center bg-primary-50">
                                <p className="text-2xl font-bold text-primary-600">
                                    {selectedVehicle.totalTrips.toLocaleString()}
                                </p>
                                <p className="text-sm text-primary-600">Total Trips</p>
                            </Card>
                            <Card padding="md" className="text-center bg-warning-50">
                                <p className="text-2xl font-bold text-warning-600">
                                    {formatDate(selectedVehicle.insuranceExpiry)}
                                </p>
                                <p className="text-sm text-warning-600">Insurance Expiry</p>
                            </Card>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" fullWidth>
                                View Trips
                            </Button>
                            <Button variant="outline" fullWidth>
                                Maintenance Log
                            </Button>
                            <Button fullWidth>Reassign Driver</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
