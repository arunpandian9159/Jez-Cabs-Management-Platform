import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  Shield,
  Handshake,
  AlertCircle,
  Calendar,
  Percent,
  Target,
  IndianRupee,
  Sparkles
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CreateContractDto } from '@/services/owner.service';

interface AddContractModalProps {
  open: boolean;
  contract: CreateContractDto;
  isCreating: boolean;
  createError: string | null;
  onOpenChange: (open: boolean) => void;
  onFieldChange: <K extends keyof CreateContractDto>(
    field: K,
    value: CreateContractDto[K]
  ) => void;
  onSubmit: () => void;
}

export function AddContractModal({
  open,
  contract,
  isCreating,
  createError,
  onOpenChange,
  onFieldChange,
  onSubmit,
}: AddContractModalProps) {
  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'driver':
        return <User className="w-6 h-6 text-white" />;
      case 'platform':
        return <Handshake className="w-6 h-6 text-white" />;
      case 'insurance':
        return <Shield className="w-6 h-6 text-white" />;
      default:
        return <FileText className="w-6 h-6 text-white" />;
    }
  };

  const getContractTypeGradient = (type: string) => {
    switch (type) {
      case 'driver':
        return 'from-primary-500 to-primary-600';
      case 'platform':
        return 'from-accent-500 to-accent-600';
      case 'insurance':
        return 'from-success-500 to-success-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'driver':
        return 'Driver Agreement';
      case 'platform':
        return 'Platform Partnership';
      case 'insurance':
        return 'Insurance Policy';
      default:
        return 'Contract';
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title=""
      size="lg"
    >
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 pb-4 border-b border-gray-100"
        >
          <div className="relative">
            <motion.div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getContractTypeGradient(contract.type)} flex items-center justify-center shadow-lg`}
              animate={{
                boxShadow: contract.type === 'driver'
                  ? '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                  : contract.type === 'platform'
                    ? '0 10px 25px -5px rgba(168, 85, 247, 0.4)'
                    : '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
              }}
            >
              {getContractTypeIcon(contract.type)}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Contract</h2>
            <p className="text-sm text-gray-500">Set up a new agreement with partners</p>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {createError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-error-600" />
              </div>
              <p className="text-error-700 text-sm font-medium">{createError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contract Type Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">Contract Type *</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'driver', label: 'Driver', icon: User, color: 'primary' },
              { value: 'platform', label: 'Platform', icon: Handshake, color: 'accent' },
              { value: 'insurance', label: 'Insurance', icon: Shield, color: 'success' },
            ].map((item) => (
              <motion.button
                key={item.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFieldChange('type', item.value as 'driver' | 'platform' | 'insurance')}
                className={`p-4 rounded-xl border-2 transition-all ${contract.type === item.value
                    ? `border-${item.color}-500 bg-${item.color}-50`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color === 'primary'
                    ? 'from-primary-400 to-primary-500'
                    : item.color === 'accent'
                      ? 'from-accent-400 to-accent-500'
                      : 'from-success-400 to-success-500'
                  } flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className={`text-sm font-medium ${contract.type === item.value ? 'text-gray-900' : 'text-gray-600'
                  }`}>{item.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contract Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contract Details</h3>
          </div>

          <Input
            label="Contract Title *"
            placeholder="e.g., Driver Employment Agreement"
            value={contract.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
          />

          <Input
            label="Party Name *"
            placeholder="e.g., John Doe"
            value={contract.partyName}
            onChange={(e) => onFieldChange('partyName', e.target.value)}
          />
        </motion.div>

        {/* Duration Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-accent-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Duration</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
            <Input
              label="Start Date *"
              type="date"
              value={contract.startDate}
              onChange={(e) => onFieldChange('startDate', e.target.value)}
            />
            <Input
              label="End Date *"
              type="date"
              value={contract.endDate}
              onChange={(e) => onFieldChange('endDate', e.target.value)}
            />
          </div>
        </motion.div>

        {/* Conditional Fields based on Contract Type */}
        <AnimatePresence mode="wait">
          {contract.type === 'driver' && (
            <motion.div
              key="driver-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-success-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver Terms</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-xl border border-primary-100">
                <div className="relative">
                  <Input
                    label="Commission Rate (%)"
                    type="number"
                    placeholder="15"
                    value={contract.commission?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('commission', parseInt(e.target.value) || 0)
                    }
                  />
                  <Percent className="absolute right-3 top-9 w-4 h-4 text-primary-400" />
                </div>
                <div className="relative">
                  <Input
                    label="Monthly Target (₹)"
                    type="number"
                    placeholder="50000"
                    value={contract.monthlyTarget?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('monthlyTarget', parseInt(e.target.value) || 0)
                    }
                  />
                  <Target className="absolute right-3 top-9 w-4 h-4 text-primary-400" />
                </div>
              </div>
            </motion.div>
          )}

          {contract.type === 'insurance' && (
            <motion.div
              key="insurance-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-success-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Insurance Terms</h3>
              </div>

              <div className="p-4 bg-gradient-to-br from-success-50 to-success-100/30 rounded-xl border border-success-100">
                <div className="relative">
                  <Input
                    label="Premium Amount (₹)"
                    type="number"
                    placeholder="25000"
                    value={contract.premium?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('premium', parseInt(e.target.value) || 0)
                    }
                  />
                  <IndianRupee className="absolute right-3 top-9 w-4 h-4 text-success-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pt-4 border-t border-gray-100"
        >
          <Button
            variant="outline"
            fullWidth
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={onSubmit}
            loading={isCreating}
            disabled={isCreating}
            className={`bg-gradient-to-r ${getContractTypeGradient(contract.type)} hover:opacity-90 shadow-lg`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Contract
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
