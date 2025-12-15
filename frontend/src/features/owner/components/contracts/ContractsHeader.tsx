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
        subtitle="Manage driver agreements and partnerships"
        icon={FileText}
        iconColor="primary"
        action={
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={onAddNew}>
            New Contract
          </Button>
        }
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <OwnerStatCard
          label="Active Contracts"
          value={stats.activeContracts}
          icon={CheckCircle}
          color="success"
          delay={0.1}
        />
        <OwnerStatCard
          label="Expiring Soon"
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
