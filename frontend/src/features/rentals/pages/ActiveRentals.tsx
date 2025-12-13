import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Car,
    Calendar,
    Clock,
    Phone,
    ChevronRight,
    FileText,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { ROUTES } from '../../../lib/constants';
import { rentalsService, Rental } from '../../../services';

// Types for rental display
interface RentalDisplay {
    id: string;
    cab: {
        make: string;
        model: string;
        registrationNumber: string;
        color: string;
    };
    owner: {
        name: string;
        phone: string;
    };
    startDate: string;
    endDate: string;
    status: string;
    totalAmount: number;
    paidAmount: number;
    daysRemaining?: number;
    startOdometer?: number;
    currentOdometer?: number;
    rating?: number;
    refundAmount?: number;
}

export function ActiveRentals() {
    const [activeTab, setActiveTab] = useState('active');
    const [activeRentals, setActiveRentals] = useState<RentalDisplay[]>([]);
    const [pastRentals, setPastRentals] = useState<RentalDisplay[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    // Fetch rentals on mount
    useEffect(() => {
        const fetchRentals = async () => {
            try {
                setIsLoading(true);
                const rentals = await rentalsService.findAll();

                const formatRental = (r: Rental): RentalDisplay => ({
                    id: r.id,
                    cab: {
                        make: r.cab?.make || '',
                        model: r.cab?.model || '',
                        registrationNumber: r.cab?.registration_number || '',
                        color: r.cab?.color || 'Black',
                    },
                    owner: {
                        name: '',
                        phone: '',
                    },
                    startDate: r.start_date,
                    endDate: r.end_date,
                    status: r.status,
                    totalAmount: r.total_amount,
                    paidAmount: r.total_amount, // Assuming fully paid
                    daysRemaining: Math.max(0, Math.ceil((new Date(r.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
                });

                const active = rentals.filter((r: Rental) => r.status === 'active' || r.status === 'confirmed').map(formatRental);
                const past = rentals.filter((r: Rental) => r.status === 'completed' || r.status === 'cancelled').map(formatRental);

                setActiveRentals(active);
                setPastRentals(past);
            } catch (error) {
                console.error('Error fetching rentals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRentals();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        My Rentals
                    </h1>
                    <p className="text-gray-500">
                        Manage your rental bookings
                    </p>
                </div>
                <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
                    <Button>Browse Cabs</Button>
                </Link>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="active">
                            Active ({activeRentals.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">
                            Past ({pastRentals.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="mt-4">
                        {activeRentals.length === 0 ? (
                            <Card padding="lg" className="text-center">
                                <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    No active rentals
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    You don't have any active rental bookings right now.
                                </p>
                                <Link to={ROUTES.CUSTOMER.RENTALS_BROWSE}>
                                    <Button>Browse Available Cabs</Button>
                                </Link>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {activeRentals.map((rental, index) => (
                                    <motion.div
                                        key={rental.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card padding="md">
                                            <div className="flex items-start gap-4">
                                                {/* Cab image placeholder */}
                                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <Car className="w-10 h-10 text-gray-400" />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {rental.cab.make} {rental.cab.model}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {rental.cab.registrationNumber} • {rental.cab.color}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={rental.status} />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">
                                                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">
                                                                {rental.daysRemaining} days remaining
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between text-xs mb-1">
                                                            <span className="text-gray-500">Payment Progress</span>
                                                            <span className="font-medium">
                                                                {formatCurrency(rental.paidAmount)} / {formatCurrency(rental.totalAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary-500 rounded-full"
                                                                style={{ width: `${(rental.paidAmount / rental.totalAmount) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                                                            Call Owner
                                                        </Button>
                                                        <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                                                            View Details
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            Extend Rental
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-4">
                        <div className="space-y-4">
                            {pastRentals.map((rental, index) => (
                                <motion.div
                                    key={rental.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card padding="md">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Car className="w-8 h-8 text-gray-400" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {rental.cab.make} {rental.cab.model}
                                                    </h3>
                                                    <StatusBadge status={rental.status} />
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(rental.totalAmount)}
                                                </p>
                                                {rental.refundAmount && (
                                                    <p className="text-xs text-success-600">
                                                        Refund: {formatCurrency(rental.refundAmount)}
                                                    </p>
                                                )}
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}
