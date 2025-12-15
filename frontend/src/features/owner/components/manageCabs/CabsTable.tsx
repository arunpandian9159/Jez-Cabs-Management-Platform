import { motion } from 'framer-motion';
import { Car, Star, MoreVertical, Search, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/shared/utils';
import type { CabDisplay } from '../../hooks/useManageCabs';

interface CabsTableProps {
    cabs: CabDisplay[];
    onViewDetails: (cab: CabDisplay) => void;
}

export function CabsTable({ cabs, onViewDetails }: CabsTableProps) {
    if (cabs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Card padding="lg" className="text-center py-16 bg-gradient-to-br from-gray-50 to-white">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No cabs found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        No cabs match your current filters. Try adjusting your search or filters.
                    </p>
                </Card>
            </motion.div>
        );
    }

    const statusColors = {
        active: {
            bg: 'bg-success-100',
            gradient: 'from-success-500 to-success-600',
            text: 'text-success-600',
        },
        maintenance: {
            bg: 'bg-error-100',
            gradient: 'from-error-500 to-error-600',
            text: 'text-error-600',
        },
        idle: {
            bg: 'bg-gray-100',
            gradient: 'from-gray-500 to-gray-600',
            text: 'text-gray-600',
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card padding="none" className="overflow-hidden shadow-lg border-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Earnings (Month)</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cabs.map((cab, index) => {
                                const colors = statusColors[cab.status as keyof typeof statusColors] || statusColors.idle;
                                return (
                                    <motion.tr
                                        key={cab.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + index * 0.03 }}
                                        className="hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}
                                                >
                                                    <Car className="w-5 h-5 text-white" />
                                                </motion.div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{cab.make} {cab.model}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{cab.registrationNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={cab.status} />
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-gray-900">{formatCurrency(cab.metrics.thisMonthEarnings)}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-warning-50 rounded-lg w-fit">
                                                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                                <span className="font-semibold text-warning-700">{cab.metrics.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {cab.driver ? (
                                                <div className="flex items-center gap-3">
                                                    <Avatar size="sm" name={cab.driver.name} className="w-9 h-9 text-xs" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{cab.driver.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">{cab.driver.trips} trips</span>
                                                            <span className="text-gray-300">•</span>
                                                            <div className="flex items-center gap-0.5">
                                                                <Star className="w-3 h-3 text-warning-400 fill-warning-400" />
                                                                <span className="text-xs text-gray-600">{cab.driver.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-warning-100 to-warning-200 flex items-center justify-center">
                                                        <AlertCircle className="w-4 h-4 text-warning-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-warning-600">Unassigned</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onViewDetails(cab)}
                                                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                                                >
                                                    View
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}
