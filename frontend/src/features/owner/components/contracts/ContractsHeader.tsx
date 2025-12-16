import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Plus, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OwnerPageHeader } from '../OwnerPageHeader';
import { OwnerStatCard } from '../OwnerStatCard';

interface ContractsHeaderProps {
  stats: {
    activeContracts: number;
    expiringContracts: number;
    expiredContracts: number;
  };
  onAddNew: () => void;
}

export function ContractsHeader({ stats, onAddNew }: ContractsHeaderProps) {
  return (
    <>
      <OwnerPageHeader
        title="Contracts"
        subtitle="Manage driver agreements"
        icon={FileText}
        iconColor="primary"
        action={
          <Button leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />} onClick={onAddNew} className="text-xs sm:text-sm">
            <span className="hidden sm:inline">New Contract</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2 sm:gap-4"
      >
        <OwnerStatCard
          label="Active"
          value={stats.activeContracts}
          icon={CheckCircle}
          color="success"
          delay={0.1}
        />
        <OwnerStatCard
          label="Expiring"
          value={stats.expiringContracts}
          icon={AlertCircle}
          color="warning"
          delay={0.15}
        />
        <OwnerStatCard
          label="Expired"
          value={stats.expiredContracts}
          icon={XCircle}
          color="error"
          delay={0.2}
        />
      </motion.div>
    </>
  );
}

