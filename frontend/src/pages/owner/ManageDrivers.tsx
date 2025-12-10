import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../lib/utils';

// Mock drivers data
const drivers = [
    {
        id: 'd1',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh.k@email.com',
        avatar: null,
        status: 'active',
        cab: {
            make: 'Maruti',
            model: 'Swift Dzire',
            registrationNumber: 'KA 01 AB 1234',
        },
        metrics: {
            totalTrips: 156,
            rating: 4.8,
            acceptanceRate: 95,
            completionRate: 98,
            thisMonthEarnings: 42500,
            totalEarnings: 385000,
        },
        joinedDate: '2024-06-15',
        lastActive: '2025-12-10T14:30:00',
    },
    {
        id: 'd2',
        name: 'Suresh M.',
        phone: '+91 87654 32109',
        email: 'suresh.m@email.com',
        avatar: null,
        status: 'active',
        cab: {
            make: 'Hyundai',
            model: 'Creta',
            registrationNumber: 'KA 01 CD 5678',
        },
        metrics: {
            totalTrips: 89,
            rating: 4.6,
            acceptanceRate: 88,
            completionRate: 96,
            thisMonthEarnings: 58000,
            totalEarnings: 425000,
        },
        joinedDate: '2024-08-20',
        lastActive: '2025-12-10T12:15:00',
    },
    {
        id: 'd3',
        name: 'Mahesh R.',
        phone: '+91 76543 21098',
        email: 'mahesh.r@email.com',
        avatar: null,
        status: 'inactive',
        cab: null,
        metrics: {
            totalTrips: 234,
            rating: 4.9,
            acceptanceRate: 92,
            completionRate: 99,
            thisMonthEarnings: 0,
            totalEarnings: 520000,
        },
        joinedDate: '2024-03-10',
        lastActive: '2025-12-08T18:00:00',
    },
    {
        id: 'd4',
        name: 'Venkat S.',
        phone: '+91 65432 10987',
        email: 'venkat.s@email.com',
        avatar: null,
        status: 'pending',
        cab: null,
        metrics: {
            totalTrips: 0,
            rating: 0,
            acceptanceRate: 0,
            completionRate: 0,
            thisMonthEarnings: 0,
            totalEarnings: 0,
        },
        joinedDate: '2025-12-08',
        lastActive: null,
    },
];

export function ManageDrivers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDriver, setSelectedDriver] = useState<typeof drivers[0] | null>(null);

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Drivers</h1>
                    <p className="text-gray-500">View and manage your driver team</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />}>
                    Add Driver
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
                    <p className="text-sm text-gray-500">Total Drivers</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-success-600">
                        {drivers.filter((d) => d.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-500">Active</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-600">
                        {drivers.filter((d) => d.status === 'inactive').length}
                    </p>
                    <p className="text-sm text-gray-500">Inactive</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-warning-600">
                        {drivers.filter((d) => d.status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="md">
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
                {filteredDrivers.map((driver, index) => (
                    <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                    >
                        <Card padding="md" interactive onClick={() => setSelectedDriver(driver)}>
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <Avatar size="lg" name={driver.name} />

                                {/* Driver Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
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

                                {/* Metrics */}
                                {driver.status === 'active' && (
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 justify-center">
                                                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                                <span className="font-semibold">{driver.metrics.rating}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Rating</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{driver.metrics.totalTrips}</p>
                                            <p className="text-xs text-gray-500">Trips</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-success-600">
                                                {formatCurrency(driver.metrics.thisMonthEarnings)}
                                            </p>
                                            <p className="text-xs text-gray-500">This Month</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
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
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedDriver.name} />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedDriver.name}</h3>
                                <p className="text-gray-500">{selectedDriver.phone}</p>
                                <p className="text-sm text-gray-400">{selectedDriver.email}</p>
                            </div>
                        </div>

                        {/* Assigned Cab */}
                        {selectedDriver.cab ? (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">Assigned Vehicle</p>
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {selectedDriver.cab.make} {selectedDriver.cab.model}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedDriver.cab.registrationNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-warning-50 rounded-lg text-center">
                                <p className="text-warning-700">No vehicle assigned</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Assign Vehicle
                                </Button>
                            </div>
                        )}

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Acceptance Rate</p>
                                <p className="text-xl font-bold text-gray-900">{selectedDriver.metrics.acceptanceRate}%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Completion Rate</p>
                                <p className="text-xl font-bold text-gray-900">{selectedDriver.metrics.completionRate}%</p>
                            </div>
                            <div className="p-3 bg-success-50 rounded-lg">
                                <p className="text-sm text-success-600">Total Earnings</p>
                                <p className="text-xl font-bold text-success-900">
                                    {formatCurrency(selectedDriver.metrics.totalEarnings)}
                                </p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <p className="text-sm text-primary-600">Total Trips</p>
                                <p className="text-xl font-bold text-primary-900">{selectedDriver.metrics.totalTrips}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" fullWidth leftIcon={<Phone className="w-4 h-4" />}>
                                Call
                            </Button>
                            <Button variant="outline" fullWidth leftIcon={<Mail className="w-4 h-4" />}>
                                Email
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
