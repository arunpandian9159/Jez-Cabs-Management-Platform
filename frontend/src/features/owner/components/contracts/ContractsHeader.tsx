import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Contracts</h1>
          <p className="text-gray-500">
            Manage driver agreements and partnerships
          </p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={onAddNew}>
          New Contract
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card padding="md" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.activeContracts}
            </span>
          </div>
          <p className="text-sm text-gray-500">Active Contracts</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-warning-600" />
            <span className="text-2xl font-bold text-warning-600">
              {stats.expiringContracts}
            </span>
          </div>
          <p className="text-sm text-gray-500">Expiring Soon</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-error-600" />
            <span className="text-2xl font-bold text-error-600">
              {stats.expiredContracts}
            </span>
          </div>
          <p className="text-sm text-gray-500">Expired</p>
        </Card>
      </motion.div>
    </>
  );
}
