import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loading';
import { useOwnerDashboard } from '../hooks/useOwnerDashboard';
import {
  StatsGrid,
  RevenueCard,
  FleetOverview,
  AlertCards,
} from '../components/dashboard';

export function OwnerDashboard() {
  const {
    ownerStats,
    cabs,
    isLoading,
    todaysEarnings,
    activeCabsCount,
    handleAddNewCab,
  } = useOwnerDashboard();

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
          <p className="text-gray-500">Manage your cabs and drivers</p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={handleAddNewCab}
        >
          Add New Cab
        </Button>
      </motion.div>

      <StatsGrid stats={ownerStats} />

      <RevenueCard
        todaysEarnings={todaysEarnings}
        activeCabsCount={activeCabsCount}
      />

      <FleetOverview cabs={cabs} />

      <AlertCards pendingPayments={ownerStats.pendingPayments} />
    </div>
  );
}
