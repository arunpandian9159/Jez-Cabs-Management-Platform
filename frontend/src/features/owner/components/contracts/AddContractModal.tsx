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
        return <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 'platform':
        return <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 'insurance':
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      default:
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
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


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Contract"
      description="Set up a new agreement with partners"
      size="md"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100"
        >
          <div className="relative flex-shrink-0">
            <motion.div
              className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getContractTypeGradient(contract.type)} flex items-center justify-center shadow-lg`}
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
              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </motion.div>
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-bold text-gray-900">New Contract</h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">Set up a new agreement</p>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {createError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200 rounded-xl"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error-600" />
              </div>
              <p className="text-error-700 text-xs sm:text-sm font-medium">{createError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contract Type Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Type *</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                className={`p-2 sm:p-4 rounded-xl border-2 transition-all ${contract.type === item.value
                  ? `border-${item.color}-500 bg-${item.color}-50`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-xl bg-gradient-to-br ${item.color === 'primary'
                  ? 'from-primary-400 to-primary-500'
                  : item.color === 'accent'
                    ? 'from-accent-400 to-accent-500'
                    : 'from-success-400 to-success-500'
                  } flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className={`text-[10px] sm:text-sm font-medium ${contract.type === item.value ? 'text-gray-900' : 'text-gray-600'
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
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Details</h3>
          </div>

          <Input
            label="Title *"
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
          className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Duration</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
            <Input
              label="Start *"
              type="date"
              value={contract.startDate}
              onChange={(e) => onFieldChange('startDate', e.target.value)}
            />
            <Input
              label="End *"
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
              className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-600" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver Terms</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-xl border border-primary-100">
                <div className="relative">
                  <Input
                    label="Commission (%)"
                    type="number"
                    placeholder="15"
                    value={contract.commission?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('commission', parseInt(e.target.value) || 0)
                    }
                  />
                  <Percent className="absolute right-3 top-8 sm:top-9 w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                </div>
                <div className="relative">
                  <Input
                    label="Target (₹)"
                    type="number"
                    placeholder="50000"
                    value={contract.monthlyTarget?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('monthlyTarget', parseInt(e.target.value) || 0)
                    }
                  />
                  <Target className="absolute right-3 top-8 sm:top-9 w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
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
              className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-600" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Insurance</h3>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-br from-success-50 to-success-100/30 rounded-xl border border-success-100">
                <div className="relative">
                  <Input
                    label="Premium (₹)"
                    type="number"
                    placeholder="25000"
                    value={contract.premium?.toString() || ''}
                    onChange={(e) =>
                      onFieldChange('premium', parseInt(e.target.value) || 0)
                    }
                  />
                  <IndianRupee className="absolute right-3 top-8 sm:top-9 w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-400" />
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
          className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100"
        >
          <Button
            variant="outline"
            fullWidth
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="hover:bg-gray-50 text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={onSubmit}
            loading={isCreating}
            disabled={isCreating}
            className={`bg-gradient-to-r ${getContractTypeGradient(contract.type)} hover:opacity-90 shadow-lg text-xs sm:text-sm`}
          >
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            Create
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

