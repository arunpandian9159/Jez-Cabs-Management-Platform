import { Plus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loading';
import { useOwnerDashboard } from '../hooks/useOwnerDashboard';
import { OwnerPageHeader } from '../components/OwnerPageHeader';
import {
  StatsGrid,
  FleetOverview,
  AlertCards,
} from '../components/dashboard';

export function OwnerDashboard() {
  const {
    ownerStats,
    cabs,
    isLoading,
    todaysEarnings,
    handleAddNewCab,
  } = useOwnerDashboard();

  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Welcome, Fleet Owner!"
        subtitle="Manage your cabs and drivers"
        icon={LayoutDashboard}
        iconColor="primary"
        action={
          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={handleAddNewCab}
          >
            Add New Cab
          </Button>
        }
      />

      <StatsGrid stats={ownerStats} todaysEarnings={todaysEarnings} />

      <FleetOverview cabs={cabs} />

      <AlertCards pendingPayments={ownerStats.pendingPayments} />
    </div>
  );
}
