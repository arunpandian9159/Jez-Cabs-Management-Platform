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
            <Card padding="lg" className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                        <Search className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No cabs found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    No cabs match your current filters. Try adjusting your search or filters.
                </p>
            </Card>
        );
    }

    return (
        <Card padding="none" className="overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Earnings (Month)</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cabs.map((cab, index) => (
                            <motion.tr
                                key={cab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cab.status === 'active' ? 'bg-success-50 text-success-600' :
                                                cab.status === 'maintenance' ? 'bg-error-50 text-error-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Car className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{cab.make} {cab.model}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{cab.registrationNumber}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <StatusBadge status={cab.status} />
                                </td>
                                <td className="py-4 px-6">
                                    <p className="font-medium text-gray-900">{formatCurrency(cab.metrics.thisMonthEarnings)}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
                                        <span className="font-medium text-gray-900">{cab.metrics.rating}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {cab.driver ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar size="sm" name={cab.driver.name} className="w-8 h-8 text-xs" />
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
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm">Unassigned</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewDetails(cab)}
                                        >
                                            View
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
