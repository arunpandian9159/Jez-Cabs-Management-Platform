import { motion } from 'framer-motion';
import { Car, Star, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/shared/utils';
import type { CabDisplay } from '../../hooks/useManageCabs';

interface CabsGridProps {
    cabs: CabDisplay[];
    onViewDetails: (cab: CabDisplay) => void;
}

export function CabsGrid({ cabs, onViewDetails }: CabsGridProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabs.map((cab, index) => (
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
                                onClick={() => onViewDetails(cab)}
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
    );
}
