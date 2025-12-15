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
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case 'expiring':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-error-500" />;
      default:
        return <FileCheck className="w-5 h-5 text-gray-400" />;
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
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStatusGradient(cab.status)} flex items-center justify-center shadow-lg`}>
                <Car className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getStatusGradient(cab.status)}`} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {cab.make} {cab.model}
                </h2>
                <Badge
                  variant={cab.status === 'available' ? 'success' : cab.status === 'busy' ? 'warning' : 'error'}
                  className="capitalize"
                >
                  {cab.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <ClipboardList className="w-4 h-4" />
                  {cab.registrationNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
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
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-success-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Earnings & Performance</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Card padding="md" className="text-center bg-gradient-to-br from-success-50 to-success-100/50 border-success-200">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-md">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-success-700">
                  {formatCurrency(cab.metrics.totalEarnings)}
                </p>
                <p className="text-xs text-success-600">Total Earnings</p>
              </Card>

              <Card padding="md" className="text-center bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-primary-700">
                  {cab.metrics.totalTrips}
                </p>
                <p className="text-xs text-primary-600">Total Trips</p>
              </Card>

              <Card padding="md" className="text-center bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-md">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-accent-700">
                  {formatCurrency(cab.metrics.thisMonthEarnings)}
                </p>
                <p className="text-xs text-accent-600">This Month</p>
              </Card>

              <Card padding="md" className="text-center bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center shadow-md">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold text-warning-700">
                  {(Number(cab.metrics.rating) || 0).toFixed(1)}
                </p>
                <p className="text-xs text-warning-600">Rating</p>
              </Card>
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Vehicle Information</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span className="text-xs">Registration</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{cab.registrationNumber}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">Year</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{cab.year}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Palette className="w-3.5 h-3.5" />
                  <span className="text-xs">Color</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm capitalize">{cab.color}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Fuel className="w-3.5 h-3.5" />
                  <span className="text-xs">Fuel Type</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm capitalize">{cab.fuelType}</p>
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
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-accent-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Assigned Driver</h3>
              </div>
              <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 rounded-xl border border-accent-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {cab.driver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{cab.driver.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {cab.driver.trips} trips
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warning-500" />
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
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Service Schedule</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Last Service</p>
                <p className="font-semibold text-gray-900">{formatDate(cab.lastService)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
                <p className="text-xs text-primary-600 mb-1">Next Service</p>
                <p className="font-semibold text-primary-900">{formatDate(cab.nextService)}</p>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-4 h-4 text-success-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Documents</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(cab.documents).map(([docType, doc], index) => (
                <motion.div
                  key={docType}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    {getDocumentIcon(doc.status)}
                    <Badge
                      variant={
                        getDocumentStatusColor(doc.status) as
                        | 'success'
                        | 'warning'
                        | 'error'
                      }
                      className="capitalize text-xs"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-gray-900 capitalize text-sm">{docType}</p>
                  <p className="text-xs text-gray-500 mt-1">
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
