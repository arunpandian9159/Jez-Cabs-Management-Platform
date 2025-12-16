import { motion } from 'framer-motion';
import {
  Car,
  Calendar,
  Fuel,
  Palette,
  ClipboardList,
  TrendingUp,
  Wrench,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  IndianRupee,
  User,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { CabDisplay } from '../../hooks/useManageCabs';

interface CabDetailsModalProps {
  cab: CabDisplay | null;
  onClose: () => void;
  getDocumentStatusColor: (status: string) => string;
}

export function CabDetailsModal({
  cab,
  onClose,
  getDocumentStatusColor,
}: CabDetailsModalProps) {
  const getDocumentIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />;
      case 'expiring':
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error-500" />;
      default:
        return <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'available':
        return 'from-success-500 to-success-600';
      case 'busy':
        return 'from-warning-500 to-warning-600';
      case 'maintenance':
        return 'from-error-500 to-error-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Modal
      open={!!cab}
      onOpenChange={() => onClose()}
      title={cab ? `${cab.make} ${cab.model}` : 'Cab Details'}
      description={cab ? `Vehicle details for ${cab.registrationNumber}` : ''}
      size="md"
    >
      {cab && (
        <div className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
          >
            <div className="relative flex-shrink-0">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getStatusGradient(cab.status)} flex items-center justify-center shadow-lg`}>
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br ${getStatusGradient(cab.status)}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  {cab.make} {cab.model}
                </h2>
                <Badge
                  variant={cab.status === 'available' ? 'success' : cab.status === 'busy' ? 'warning' : 'error'}
                  className="capitalize"
                >
                  {cab.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                  {cab.registrationNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {cab.year}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Earnings Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-600" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Earnings & Performance</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Card padding="sm" className="text-center bg-gradient-to-br from-success-50 to-success-100/50 border-success-200 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-md">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-sm sm:text-lg font-bold text-success-700 truncate">
                  {formatCurrency(cab.metrics.totalEarnings)}
                </p>
                <p className="text-[10px] sm:text-xs text-success-600">Total</p>
              </Card>

              <Card padding="sm" className="text-center bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-sm sm:text-lg font-bold text-primary-700">
                  {cab.metrics.totalTrips}
                </p>
                <p className="text-[10px] sm:text-xs text-primary-600">Trips</p>
              </Card>

              <Card padding="sm" className="text-center bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-md">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-sm sm:text-lg font-bold text-accent-700 truncate">
                  {formatCurrency(cab.metrics.thisMonthEarnings)}
                </p>
                <p className="text-[10px] sm:text-xs text-accent-600">Month</p>
              </Card>

              <Card padding="sm" className="text-center bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-sm sm:text-lg font-bold text-warning-700">
                  {(Number(cab.metrics.rating) || 0).toFixed(1)}
                </p>
                <p className="text-[10px] sm:text-xs text-warning-600">Rating</p>
              </Card>
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Vehicle Info</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5 sm:mb-1">
                  <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">Registration</span>
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{cab.registrationNumber}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5 sm:mb-1">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">Year</span>
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">{cab.year}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5 sm:mb-1">
                  <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">Color</span>
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm capitalize">{cab.color}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5 sm:mb-1">
                  <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">Fuel</span>
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm capitalize">{cab.fuelType}</p>
              </div>
            </div>
          </motion.div>

          {/* Driver Info */}
          {cab.driver && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-600" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver</h3>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 rounded-xl border border-accent-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md flex-shrink-0">
                    {cab.driver.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cab.driver.name}</p>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {cab.driver.trips} trips
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-warning-500" />
                        {(Number(cab.driver.rating) || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Service</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Last Service</p>
                <p className="font-semibold text-gray-900 text-xs sm:text-base">{formatDate(cab.lastService)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
                <p className="text-[10px] sm:text-xs text-primary-600 mb-0.5 sm:mb-1">Next Service</p>
                <p className="font-semibold text-primary-900 text-xs sm:text-base">{formatDate(cab.nextService)}</p>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-600" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Documents</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {Object.entries(cab.documents).map(([docType, doc], index) => (
                <motion.div
                  key={docType}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    {getDocumentIcon(doc.status)}
                    <Badge
                      variant={
                        getDocumentStatusColor(doc.status) as
                        | 'success'
                        | 'warning'
                        | 'error'
                      }
                      className="capitalize text-[10px] sm:text-xs"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-gray-900 capitalize text-xs sm:text-sm truncate">{docType}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
                    Exp: {formatDate(doc.expiry)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </Modal>
  );
}

