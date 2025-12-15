import { motion } from 'framer-motion';
import {
    Phone,
    Mail,
    Car,
    Star,
    TrendingUp,
    CheckCircle,
    Target,
    IndianRupee,
    Calendar,
    MessageSquare,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { OwnerDriver } from '@/services/owner.service';

interface DriverDetailsModalProps {
    driver: OwnerDriver | null;
    onClose: () => void;
}

export function DriverDetailsModal({
    driver,
    onClose,
}: DriverDetailsModalProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    variant: 'success' as const,
                    label: 'Active',
                    gradient: 'from-success-500 to-success-600'
                };
            case 'inactive':
                return {
                    variant: 'default' as const,
                    label: 'Inactive',
                    gradient: 'from-gray-400 to-gray-500'
                };
            case 'pending':
                return {
                    variant: 'warning' as const,
                    label: 'Pending',
                    gradient: 'from-warning-500 to-warning-600'
                };
            default:
                return {
                    variant: 'default' as const,
                    label: status,
                    gradient: 'from-gray-400 to-gray-500'
                };
        }
    };

    const statusConfig = driver ? getStatusConfig(driver.status) : null;

    return (
        <Modal
            open={!!driver}
            onOpenChange={() => onClose()}
            title="Driver Details"
            description={driver ? `Details for ${driver.name}` : ''}
            size="md"
        >
            {driver && statusConfig && (
                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                    {/* Driver Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
                    >
                        <div className="relative">
                            <Avatar size="xl" name={driver.name} />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${statusConfig.gradient} border-2 border-white`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    {driver.phone}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">{driver.email}</p>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-2 bg-warning-50 rounded-xl">
                            <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                            <span className="font-bold text-warning-700 text-lg">
                                {(Number(driver.metrics.rating) || 0).toFixed(1)}
                            </span>
                        </div>
                    </motion.div>

                    {/* Performance Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Performance</h4>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <Card padding="sm" className="text-center bg-gradient-to-br from-success-50 to-success-100/50 border-success-200">
                                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center">
                                    <IndianRupee className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-bold text-success-700">
                                    {formatCurrency(driver.metrics.totalEarnings)}
                                </p>
                                <p className="text-xs text-success-600">Total</p>
                            </Card>

                            <Card padding="sm" className="text-center bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200">
                                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center">
                                    <IndianRupee className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-bold text-accent-700">
                                    {formatCurrency(driver.metrics.thisMonthEarnings)}
                                </p>
                                <p className="text-xs text-accent-600">This Month</p>
                            </Card>

                            <Card padding="sm" className="text-center bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
                                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-bold text-primary-700">
                                    {driver.metrics.totalTrips}
                                </p>
                                <p className="text-xs text-primary-600">Trips</p>
                            </Card>

                            <Card padding="sm" className="text-center bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200">
                                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-bold text-warning-700">
                                    {(Number(driver.metrics.rating) || 0).toFixed(1)}
                                </p>
                                <p className="text-xs text-warning-600">Rating</p>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Rates */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-accent-600" />
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rates</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <CheckCircle className="w-4 h-4 text-success-500" />
                                        <span className="text-sm">Acceptance Rate</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{driver.metrics.acceptanceRate}%</span>
                                </div>
                                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${driver.metrics.acceptanceRate}%` }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <CheckCircle className="w-4 h-4 text-primary-500" />
                                        <span className="text-sm">Completion Rate</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{driver.metrics.completionRate}%</span>
                                </div>
                                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${driver.metrics.completionRate}%` }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Assigned Vehicle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Car className="w-4 h-4 text-success-600" />
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Assigned Vehicle</h4>
                        </div>
                        {driver.cab ? (
                            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                                        <Car className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {driver.cab.make} {driver.cab.model}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {driver.cab.registrationNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gradient-to-br from-warning-50 to-warning-100/50 rounded-xl border border-warning-100 text-center">
                                <Car className="w-8 h-8 text-warning-400 mx-auto mb-2" />
                                <p className="text-warning-700 font-medium">No vehicle assigned</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Assign Vehicle
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="font-medium text-gray-900 text-sm">{formatDate(driver.joinedDate)}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                                <p className="text-xs text-gray-500">Last Active</p>
                                <p className="font-medium text-gray-900 text-sm">{driver.lastActive ? formatDate(driver.lastActive) : 'N/A'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-3 pt-4 border-t border-gray-100"
                    >
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Phone className="w-4 h-4" />}
                            className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700"
                        >
                            Call
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<MessageSquare className="w-4 h-4" />}
                            className="hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700"
                        >
                            Message
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Mail className="w-4 h-4" />}
                            className="hover:bg-success-50 hover:border-success-300 hover:text-success-700"
                        >
                            Email
                        </Button>
                    </motion.div>
                </div>
            )}
        </Modal>
    );
}
