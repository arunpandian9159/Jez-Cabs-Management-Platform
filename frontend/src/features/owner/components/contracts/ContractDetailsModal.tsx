import { motion } from 'framer-motion';
import {
  User,
  FileText,
  Car,
  Eye,
  Download,
  Calendar,
  Shield,
  Handshake,
  Percent,
  Target,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Ban,
  Edit3
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { Contract } from '@/services/owner.service';

interface ContractDetailsModalProps {
  contract: Contract | null;
  isProcessing: boolean;
  onClose: () => void;
  onRenew: (id: string) => void;
  onTerminate: (id: string) => void;
}

export function ContractDetailsModal({
  contract,
  isProcessing,
  onClose,
  onRenew,
  onTerminate,
}: ContractDetailsModalProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: <Badge variant="success" className="gap-1 text-[10px] sm:text-xs"><CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Active</Badge>,
          color: 'success',
          gradient: 'from-success-500 to-success-600'
        };
      case 'expiring':
        return {
          badge: <Badge variant="warning" className="gap-1 text-[10px] sm:text-xs"><AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Expiring</Badge>,
          color: 'warning',
          gradient: 'from-warning-500 to-warning-600'
        };
      case 'expired':
        return {
          badge: <Badge variant="error" className="gap-1 text-[10px] sm:text-xs"><XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Expired</Badge>,
          color: 'error',
          gradient: 'from-error-500 to-error-600'
        };
      case 'pending':
        return {
          badge: <Badge variant="primary" className="gap-1 text-[10px] sm:text-xs"><Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Pending</Badge>,
          color: 'primary',
          gradient: 'from-primary-500 to-primary-600'
        };
      default:
        return {
          badge: null,
          color: 'gray',
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const getContractTypeConfig = (type: string) => {
    switch (type) {
      case 'driver':
        return {
          icon: <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
          label: 'Driver Agreement',
          gradient: 'from-primary-500 to-primary-600',
          bgLight: 'from-primary-50 to-primary-100/50',
          border: 'border-primary-200'
        };
      case 'platform':
        return {
          icon: <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
          label: 'Platform Partnership',
          gradient: 'from-accent-500 to-accent-600',
          bgLight: 'from-accent-50 to-accent-100/50',
          border: 'border-accent-200'
        };
      case 'insurance':
        return {
          icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
          label: 'Insurance Policy',
          gradient: 'from-success-500 to-success-600',
          bgLight: 'from-success-50 to-success-100/50',
          border: 'border-success-200'
        };
      default:
        return {
          icon: <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
          label: 'Contract',
          gradient: 'from-gray-400 to-gray-500',
          bgLight: 'from-gray-50 to-gray-100/50',
          border: 'border-gray-200'
        };
    }
  };

  const statusConfig = contract ? getStatusConfig(contract.status) : null;
  const typeConfig = contract ? getContractTypeConfig(contract.type) : null;

  return (
    <Modal
      open={!!contract}
      onOpenChange={() => onClose()}
      title="Contract Details"
      description={contract ? `Details for ${contract.title}` : ''}
      size="md"
    >
      {contract && typeConfig && statusConfig && (
        <div className="space-y-4 sm:space-y-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              {typeConfig.icon}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  {contract.title}
                </h2>
                {statusConfig.badge}
              </div>
              <p className="text-gray-500 text-xs sm:text-base truncate">{contract.partyName}</p>
              <p className="text-[10px] sm:text-sm text-gray-400 mt-0.5 sm:mt-1">{typeConfig.label}</p>
            </div>
          </motion.div>

          {/* Contract Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-br ${typeConfig.bgLight} rounded-xl sm:rounded-2xl ${typeConfig.border} border`}
          >
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-sm">Start</span>
              </div>
              <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base">
                {formatDate(contract.startDate)}
              </p>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-sm">End</span>
              </div>
              <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base">
                {formatDate(contract.endDate)}
              </p>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-sm">Vehicle</span>
              </div>
              <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base truncate">
                {contract.vehicleAssigned}
              </p>
            </div>
            {contract.commission && (
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                  <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-sm">Commission</span>
                </div>
                <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base">
                  {contract.commission}%
                </p>
              </div>
            )}
            {(contract.monthlyTarget ?? 0) > 0 && (
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-sm">Target</span>
                </div>
                <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base">
                  {formatCurrency(contract.monthlyTarget ?? 0)}
                </p>
              </div>
            )}
            {(contract.premium ?? 0) > 0 && (
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                  <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-sm">Premium</span>
                </div>
                <p className="font-semibold text-gray-900 ml-4 sm:ml-6 text-xs sm:text-base">
                  {formatCurrency(contract.premium ?? 0)}
                </p>
              </div>
            )}
          </motion.div>

          {/* Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Documents</h4>
            </div>

            {contract.documents.length > 0 ? (
              <div className="space-y-2">
                {contract.documents.map((doc, index) => (
                  <motion.div
                    key={doc}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center justify-between p-2 sm:p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 transition-colors flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <span className="text-gray-900 font-medium text-xs sm:text-base truncate">{doc}</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-1 sm:p-2"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 p-1 sm:p-2"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs sm:text-sm">No documents attached</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100"
          >
            <Button
              variant="outline"
              fullWidth
              disabled={isProcessing}
              leftIcon={<Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              className="hover:bg-gray-50 text-xs sm:text-sm"
            >
              Edit
            </Button>
            {contract.status === 'expiring' && (
              <Button
                fullWidth
                onClick={() => onRenew(contract.id)}
                disabled={isProcessing}
                loading={isProcessing}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-lg shadow-success-500/30 text-xs sm:text-sm"
              >
                Renew
              </Button>
            )}
            {contract.status === 'active' && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => onTerminate(contract.id)}
                disabled={isProcessing}
                loading={isProcessing}
                leftIcon={<Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                className="shadow-lg shadow-error-500/30 text-xs sm:text-sm"
              >
                End
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </Modal>
  );
}

