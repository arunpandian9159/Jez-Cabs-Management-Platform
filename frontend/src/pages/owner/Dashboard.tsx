import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Car,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    Star,
    AlertCircle,
    Settings,
    MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { cabsService, type Cab } from '@/services';

// Types for owner dashboard display
interface OwnerStatsDisplay {
    totalCabs: number;
    activeCabs: number;
    totalDrivers: number;
    activeDrivers: number;
    monthlyRevenue: number;
    pendingPayments: number;
    avgRating: number;
}

interface CabDriverDisplay {
    name: string;
    rating: number;
    trips: number;
}
interface CabDisplay {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    status: string;
    driver: CabDriverDisplay | null;
    todayEarnings: number;
    rating: number;
}

export function OwnerDashboard() {
    const [ownerStats, setOwnerStats] = useState<OwnerStatsDisplay>({
        totalCabs: 0,
        activeCabs: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        avgRating: 0,
    });
    const [cabs, setCabs] = useState<CabDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch cabs statistics
                const stats = await cabsService.getStatistics();
                setOwnerStats({
                    totalCabs: stats.total || 0,
                    activeCabs: (stats.available || 0) + (stats.onTrip || 0),
                    totalDrivers: 0,
                    activeDrivers: 0,
                    monthlyRevenue: 0,
                    pendingPayments: 0,
                    avgRating: 0,
                });

                // Fetch cabs list - backend returns { data: cabs[], meta: {...} }
                const cabsResponse = await cabsService.findAll();
                const cabsArray = Array.isArray(cabsResponse) ? cabsResponse : cabsResponse.data || [];
                const formattedCabs: CabDisplay[] = cabsArray.map((c: Cab) => ({
                    id: c.id,
                    make: c.make,
                    model: c.model,
                    registrationNumber: c.registration_number,
                    status: c.status,
                    driver: c.driver ? {
                        name: `${c.driver.first_name} ${c.driver.last_name}`,
                        rating: c.driver.rating || 4.5,
                        trips: 0,
                    } : null,
                    todayEarnings: 0,
                    rating: c.rating || 4.5,
                }));
                setCabs(formattedCabs);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    // Loading state
    if (isLoading) {
        return <PageLoader message="Loading dashboard..." />;
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome, Fleet Owner!
                    </h1>
                    <p className="text-gray-500">
                        Manage your cabs and drivers
                    </p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => navigate('/owner/cabs')}>
                    Add New Cab
                </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Car className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {ownerStats.activeCabs}/{ownerStats.totalCabs}
                            </p>
                            <p className="text-sm text-gray-500">Active Cabs</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {ownerStats.activeDrivers}/{ownerStats.totalDrivers}
                            </p>
                            <p className="text-sm text-gray-500">Active Drivers</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-success-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(ownerStats.monthlyRevenue)}
                            </p>
                            <p className="text-sm text-gray-500">Monthly Revenue</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-warning-100 flex items-center justify-center">
                            <Star className="w-6 h-6 text-warning-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {ownerStats.avgRating}
                            </p>
                            <p className="text-sm text-gray-500">Fleet Rating</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Revenue Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm mb-1">Today's Fleet Earnings</p>
                            <p className="text-3xl font-bold">
                                {formatCurrency(cabs.reduce((acc, c) => acc + c.todayEarnings, 0))}
                            </p>
                            <p className="text-white/70 text-sm mt-2">
                                {cabs.filter((c) => c.status === 'active').length} cabs on road
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">+12% vs yesterday</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Fleet Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Fleet Overview</h2>
                        <Link to="/owner/cabs" className="text-sm text-primary-600 hover:text-primary-700">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {cabs.map((cab) => (
                            <div
                                key={cab.id}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* Cab Icon */}
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

                                {/* Cab Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-gray-900">
                                            {cab.make} {cab.model}
                                        </p>
                                        <StatusBadge status={cab.status} />
                                    </div>
                                    <p className="text-sm text-gray-500">{cab.registrationNumber}</p>
                                </div>

                                {/* Driver Info */}
                                {cab.driver ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm" name={cab.driver.name} />
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{cab.driver.name}</p>
                                            <div className="flex items-center gap-1 justify-end">
                                                <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                                <span className="text-xs text-gray-500">{cab.driver.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Badge variant="default" size="sm">No Driver</Badge>
                                )}

                                {/* Today's Earnings */}
                                <div className="text-right min-w-[80px]">
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(cab.todayEarnings)}
                                    </p>
                                    <p className="text-xs text-gray-500">Today</p>
                                </div>

                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-2 gap-4"
            >
                <Card padding="md" className="border-warning-200 bg-warning-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-warning-900 mb-1">
                                Pending Payments
                            </h3>
                            <p className="text-sm text-warning-700 mb-2">
                                You have {formatCurrency(ownerStats.pendingPayments)} in pending driver settlements.
                            </p>
                            <Button variant="outline" size="sm">
                                View Details
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card padding="md" className="border-error-200 bg-error-50">
                    <div className="flex items-start gap-3">
                        <Settings className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-error-900 mb-1">
                                Maintenance Due
                            </h3>
                            <p className="text-sm text-error-700 mb-2">
                                1 cab requires scheduled maintenance. Please schedule service.
                            </p>
                            <Button variant="outline" size="sm">
                                Schedule Now
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
