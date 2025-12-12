import { useState, useEffect } from 'react';
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
import { PageLoader } from '../../components/ui/Loading';
import { formatCurrency, formatDate } from '../../lib/utils';
import { cabsService, type Cab, type CreateCabDto } from '../../services';

// Types for cab display
interface CabDriverDisplay {
    id: string;
    name: string;
    phone: string;
    rating: number;
    trips: number;
}
interface CabMetricsDisplay {
    totalTrips: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    rating: number;
}
interface DocumentStatusDisplay {
    status: string;
    expiry: string;
}
interface CabDocumentsDisplay {
    registration: DocumentStatusDisplay;
    insurance: DocumentStatusDisplay;
    permit: DocumentStatusDisplay;
}
interface CabDisplay {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    fuelType: string;
    status: string;
    driver: CabDriverDisplay | null;
    metrics: CabMetricsDisplay;
    documents: CabDocumentsDisplay;
    lastService: string;
    nextService: string;
}

// Initial form state for new cab
const initialNewCab: CreateCabDto = {
    registration_number: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    cab_type: 'sedan',
    seat_capacity: 4,
    fuel_type: 'petrol',
    base_fare: 50,
    per_km_rate: 12,
    daily_rate: 1500,
};

export function ManageCabs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCab, setSelectedCab] = useState<CabDisplay | null>(null);
    const [cabs, setCabs] = useState<CabDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // New cab modal state
    const [showNewCabModal, setShowNewCabModal] = useState(false);
    const [newCab, setNewCab] = useState<CreateCabDto>(initialNewCab);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Fetch cabs on mount
    useEffect(() => {
        fetchCabs();
    }, []);

    const fetchCabs = async () => {
        try {
            setIsLoading(true);
            // Backend returns { data: cabs[], meta: {...} }
            const cabsResponse = await cabsService.findAll();
            const cabsArray = Array.isArray(cabsResponse) ? cabsResponse : cabsResponse.data || [];
            const formattedCabs: CabDisplay[] = cabsArray.map((c: Cab) => ({
                id: c.id,
                make: c.make,
                model: c.model,
                year: c.year || 2023,
                color: c.color,
                registrationNumber: c.registration_number,
                fuelType: c.fuel_type || 'petrol',
                status: c.status,
                driver: c.driver ? {
                    id: c.driver.id,
                    name: `${c.driver.first_name} ${c.driver.last_name}`,
                    phone: c.driver.phone || '',
                    rating: c.driver.rating || 4.5,
                    trips: 0,
                } : null,
                metrics: {
                    totalTrips: c.total_trips || 0,
                    totalEarnings: 0,
                    thisMonthEarnings: 0,
                    rating: c.rating || 4.5,
                },
                documents: {
                    registration: { status: 'valid', expiry: new Date().toISOString() },
                    insurance: { status: 'valid', expiry: new Date().toISOString() },
                    permit: { status: 'valid', expiry: new Date().toISOString() },
                },
                lastService: new Date().toISOString(),
                nextService: new Date().toISOString(),
            }));
            setCabs(formattedCabs);
        } catch (error) {
            console.error('Error fetching cabs:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    // Handle new cab form submission
    const handleCreateCab = async () => {
        // Validate required fields
        if (!newCab.registration_number || !newCab.make || !newCab.model || !newCab.color) {
            setCreateError('Please fill in all required fields');
            return;
        }

        try {
            setIsCreating(true);
            setCreateError(null);
            await cabsService.create(newCab);
            setShowNewCabModal(false);
            setNewCab(initialNewCab);
            // Refresh the cabs list
            await fetchCabs();
        } catch (error) {
            console.error('Error creating cab:', error);
            setCreateError('Failed to create cab. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    // Handle form field changes
    const handleNewCabChange = (field: keyof CreateCabDto, value: string | number) => {
        setNewCab(prev => ({ ...prev, [field]: value }));
        setCreateError(null);
    };

    if (isLoading) {
        return <PageLoader message="Loading cabs..." />;
    }

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
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowNewCabModal(true)}>
                    Add New Cab
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

            {/* Add New Cab Modal */}
            <Modal
                open={showNewCabModal}
                onOpenChange={(open) => {
                    setShowNewCabModal(open);
                    if (!open) {
                        setNewCab(initialNewCab);
                        setCreateError(null);
                    }
                }}
                title="Add New Cab"
                size="lg"
            >
                <div className="space-y-4">
                    {createError && (
                        <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                            {createError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Registration Number *"
                            placeholder="e.g., KA-01-AB-1234"
                            value={newCab.registration_number}
                            onChange={(e) => handleNewCabChange('registration_number', e.target.value)}
                        />
                        <Input
                            label="Make *"
                            placeholder="e.g., Toyota"
                            value={newCab.make}
                            onChange={(e) => handleNewCabChange('make', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Model *"
                            placeholder="e.g., Innova"
                            value={newCab.model}
                            onChange={(e) => handleNewCabChange('model', e.target.value)}
                        />
                        <Input
                            label="Year"
                            type="number"
                            placeholder="e.g., 2023"
                            value={newCab.year.toString()}
                            onChange={(e) => handleNewCabChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Color *"
                            placeholder="e.g., White"
                            value={newCab.color}
                            onChange={(e) => handleNewCabChange('color', e.target.value)}
                        />
                        <Select
                            label="Cab Type"
                            options={[
                                { value: 'sedan', label: 'Sedan' },
                                { value: 'suv', label: 'SUV' },
                                { value: 'hatchback', label: 'Hatchback' },
                                { value: 'luxury', label: 'Luxury' },
                                { value: 'van', label: 'Van' },
                                { value: 'auto', label: 'Auto' },
                            ]}
                            value={newCab.cab_type}
                            onValueChange={(value) => handleNewCabChange('cab_type', value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Fuel Type"
                            options={[
                                { value: 'petrol', label: 'Petrol' },
                                { value: 'diesel', label: 'Diesel' },
                                { value: 'cng', label: 'CNG' },
                                { value: 'electric', label: 'Electric' },
                                { value: 'hybrid', label: 'Hybrid' },
                            ]}
                            value={newCab.fuel_type}
                            onValueChange={(value) => handleNewCabChange('fuel_type', value)}
                        />
                        <Input
                            label="Seat Capacity"
                            type="number"
                            placeholder="e.g., 4"
                            value={newCab.seat_capacity.toString()}
                            onChange={(e) => handleNewCabChange('seat_capacity', parseInt(e.target.value) || 4)}
                        />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Pricing (Optional)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Base Fare (₹)"
                                type="number"
                                placeholder="50"
                                value={newCab.base_fare?.toString() || ''}
                                onChange={(e) => handleNewCabChange('base_fare', parseInt(e.target.value) || 0)}
                            />
                            <Input
                                label="Per KM Rate (₹)"
                                type="number"
                                placeholder="12"
                                value={newCab.per_km_rate?.toString() || ''}
                                onChange={(e) => handleNewCabChange('per_km_rate', parseInt(e.target.value) || 0)}
                            />
                            <Input
                                label="Daily Rate (₹)"
                                type="number"
                                placeholder="1500"
                                value={newCab.daily_rate?.toString() || ''}
                                onChange={(e) => handleNewCabChange('daily_rate', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setShowNewCabModal(false);
                                setNewCab(initialNewCab);
                                setCreateError(null);
                            }}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleCreateCab}
                            loading={isCreating}
                            disabled={isCreating}
                        >
                            Add Cab
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
