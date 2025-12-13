import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/shared/utils';

interface RevenueCardProps {
    todaysEarnings: number;
    activeCabsCount: number;
}

export function RevenueCard({ todaysEarnings, activeCabsCount }: RevenueCardProps) {
    return (
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
                            {formatCurrency(todaysEarnings)}
                        </p>
                        <p className="text-white/70 text-sm mt-2">
                            {activeCabsCount} cabs on road
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">+12% vs yesterday</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
