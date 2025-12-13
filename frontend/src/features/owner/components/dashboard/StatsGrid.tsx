import { motion } from 'framer-motion';
import { Car, Users, DollarSign, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/shared/utils';
import type { OwnerStatsDisplay } from '../../hooks/useOwnerDashboard';

interface StatsGridProps {
    stats: OwnerStatsDisplay;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
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
                            {stats.activeCabs}/{stats.totalCabs}
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
                            {stats.activeDrivers}/{stats.totalDrivers}
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
                            {formatCurrency(stats.monthlyRevenue)}
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
                            {stats.avgRating}
                        </p>
                        <p className="text-sm text-gray-500">Fleet Rating</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
