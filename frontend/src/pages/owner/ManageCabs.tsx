import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Car,
    Plus,
    Search,
    Star,
    MoreVertical,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { formatCurrency, formatDate } from '../../lib/utils';

// Mock cabs data
const cabs = [
    {
        id: 'c1',
        make: 'Maruti',
        model: 'Swift Dzire',
        year: 2023,
        color: 'White',
        registrationNumber: 'KA 01 AB 1234',
        fuelType: 'Petrol',
        status: 'active',
        driver: {
            id: 'd1',
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            rating: 4.8,
            trips: 156,
        },
        metrics: {
            totalTrips: 1248,
            totalEarnings: 385000,
            thisMonthEarnings: 42500,
            rating: 4.8,
        },
        documents: {
            registration: { status: 'valid', expiry: '2026-03-15' },
            insurance: { status: 'valid', expiry: '2025-06-20' },
            permit: { status: 'expiring', expiry: '2025-01-10' },
        },
        lastService: '2025-11-15',
        nextService: '2025-12-15',
    },
    {
        id: 'c2',
        make: 'Hyundai',
        model: 'Creta',
        year: 2022,
        color: 'Black',
        registrationNumber: 'KA 01 CD 5678',
        fuelType: 'Diesel',
        status: 'active',
        driver: {
            id: 'd2',
            name: 'Suresh M.',
            phone: '+91 87654 32109',
            rating: 4.6,
            trips: 89,
        },
        metrics: {
            totalTrips: 892,
            totalEarnings: 425000,
            thisMonthEarnings: 58000,
            rating: 4.9,
        },
        documents: {
            registration: { status: 'valid', expiry: '2025-08-20' },
            insurance: { status: 'valid', expiry: '2025-09-15' },
            permit: { status: 'valid', expiry: '2026-02-28' },
        },
        lastService: '2025-10-20',
        nextService: '2025-12-20',
    },
    {
        id: 'c3',
        make: 'Toyota',
        model: 'Innova Crysta',
        year: 2023,
        color: 'Silver',
        registrationNumber: 'KA 05 EF 9012',
        fuelType: 'Diesel',
        status: 'maintenance',
        driver: null,
        metrics: {
            totalTrips: 567,
            totalEarnings: 280000,
            thisMonthEarnings: 0,
            rating: 4.7,
        },
        documents: {
            registration: { status: 'valid', expiry: '2026-05-10' },
            insurance: { status: 'valid', expiry: '2025-12-01' },
            permit: { status: 'valid', expiry: '2026-04-15' },
        },
        lastService: '2025-12-05',
        nextService: '2026-01-05',
    },
];

export function ManageCabs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCab, setSelectedCab] = useState<typeof cabs[0] | null>(null);

    const filteredCabs = cabs.filter((cab) => {
        const matchesSearch = `${cab.make} ${cab.model} ${cab.registrationNumber}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cab.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getDocumentStatusColor = (status: string) => {
        switch (status) {
            case 'valid':
                return 'success';
            case 'expiring':
                return 'warning';
            case 'expired':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Cabs</h1>
                    <p className="text-gray-500">View and manage your fleet</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />}>\r
                    Add New Cab\r
                </Button>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="md">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by make, model, or registration..."
                                prefix={<Search className="w-4 h-4" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'active', label: 'Active' },
                                { value: 'idle', label: 'Idle' },
                                { value: 'maintenance', label: 'Maintenance' },
                            ]}
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Cabs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCabs.map((cab, index) => (
                    <motion.div
                        key={cab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                    >
                        <Card padding="none" className="overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cab.status === 'active'
                                            ? 'bg-success-100'
                                            : cab.status === 'maintenance'
                                                ? 'bg-error-100'
                                                : 'bg-gray-100'
                                            }`}>
                                            <Car className={`w-6 h-6 ${cab.status === 'active'
                                                ? 'text-success-600'
                                                : cab.status === 'maintenance'
                                                    ? 'text-error-600'
                                                    : 'text-gray-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {cab.make} {cab.model}
                                            </h3>
                                            <p className="text-sm text-gray-500">{cab.registrationNumber}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={cab.status} />
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="p-4 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">This Month</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(cab.metrics.thisMonthEarnings)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                        <span className="font-semibold text-gray-900">{cab.metrics.rating}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Driver */}
                            <div className="px-4 pb-4">
                                {cab.driver ? (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Avatar size="sm" name={cab.driver.name} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{cab.driver.name}</p>
                                            <p className="text-xs text-gray-500">{cab.driver.trips} trips</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                            <span className="text-sm">{cab.driver.rating}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">No driver assigned</p>
                                        <Button variant="link" size="sm" className="mt-1">
                                            Assign Driver
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    onClick={() => setSelectedCab(cab)}
                                >
                                    View Details
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Cab Details Modal */}
            <Modal
                open={!!selectedCab}
                onOpenChange={() => setSelectedCab(null)}
                title={selectedCab ? `${selectedCab.make} ${selectedCab.model}` : ''}
                size="lg"
            >
                {selectedCab && (
                    <TabsRoot defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="earnings">Earnings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Registration</p>
                                    <p className="font-medium">{selectedCab.registrationNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="font-medium">{selectedCab.year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Color</p>
                                    <p className="font-medium">{selectedCab.color}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fuel Type</p>
                                    <p className="font-medium">{selectedCab.fuelType}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-900 mb-3">Service Schedule</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Last Service</p>
                                        <p className="font-medium">{formatDate(selectedCab.lastService)}</p>
                                    </div>
                                    <div className="p-3 bg-primary-50 rounded-lg">
                                        <p className="text-sm text-primary-600">Next Service</p>
                                        <p className="font-medium text-primary-900">{formatDate(selectedCab.nextService)}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-4 space-y-3">
                            {Object.entries(selectedCab.documents).map(([docType, doc]) => (
                                <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">{docType}</p>
                                        <p className="text-sm text-gray-500">Expires: {formatDate(doc.expiry)}</p>
                                    </div>
                                    <Badge variant={getDocumentStatusColor(doc.status) as 'success' | 'warning' | 'error'}>
                                        {doc.status}
                                    </Badge>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="earnings" className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Card padding="md" className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(selectedCab.metrics.totalEarnings)}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Earnings</p>
                                </Card>
                                <Card padding="md" className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {selectedCab.metrics.totalTrips}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Trips</p>
                                </Card>
                            </div>
                        </TabsContent>
                    </TabsRoot>
                )}
            </Modal>
        </div>
    );
}
