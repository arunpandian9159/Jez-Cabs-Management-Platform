import { motion } from 'framer-motion';
import { AlertCircle, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/shared/utils';

interface AlertCardsProps {
    pendingPayments: number;
}

export function AlertCards({ pendingPayments }: AlertCardsProps) {
    return (
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
                            You have {formatCurrency(pendingPayments)} in pending driver settlements.
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
    );
}
