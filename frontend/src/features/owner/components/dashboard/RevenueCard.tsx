import { motion } from 'framer-motion';
import { DollarSign, Car, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/shared/utils';

interface RevenueCardProps {
  todaysEarnings: number;
  activeCabsCount: number;
}

export function RevenueCard({
  todaysEarnings,
  activeCabsCount,
}: RevenueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card
        padding="lg"
        className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white overflow-hidden relative"
      >
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-white/80 text-sm font-medium">Today's Fleet Earnings</p>
            </div>
            <p className="text-4xl font-bold mb-2">
              {formatCurrency(todaysEarnings)}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                <Car className="w-4 h-4" />
                <span className="text-sm font-medium">{activeCabsCount} cabs on road</span>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4"
          >
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-5 h-5 text-green-300" />
              <span className="text-2xl font-bold text-green-300">+12%</span>
            </div>
            <span className="text-xs text-white/70">vs yesterday</span>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-accent-400/20 blur-2xl" />
      </Card>
    </motion.div>
  );
}
