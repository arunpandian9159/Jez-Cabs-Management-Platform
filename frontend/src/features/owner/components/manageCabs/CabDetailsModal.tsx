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
  MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
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
      title=""
      size="lg"
    >
      {cab && (
        <div className="space-y-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 pb-4 border-b border-gray-100"
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

          {/* Enhanced Tabs */}
          <TabsRoot defaultValue="overview">
            <TabsList className="bg-gray-100/80 p-1 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <MapPin className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <FileCheck className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                Earnings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Vehicle Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <ClipboardList className="w-4 h-4" />
                    <span className="text-sm">Registration</span>
                  </div>
                  <p className="font-semibold text-gray-900">{cab.registrationNumber}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Year</span>
                  </div>
                  <p className="font-semibold text-gray-900">{cab.year}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">Color</span>
                  </div>
                  <p className="font-semibold text-gray-900 capitalize">{cab.color}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Fuel className="w-4 h-4" />
                    <span className="text-sm">Fuel Type</span>
                  </div>
                  <p className="font-semibold text-gray-900 capitalize">{cab.fuelType}</p>
                </div>
              </motion.div>

              {/* Service Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-4 h-4 text-primary-600" />
                  <h4 className="font-semibold text-gray-900">Service Schedule</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Last Service</p>
                    <p className="font-semibold text-gray-900">{formatDate(cab.lastService)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
                    <p className="text-sm text-primary-600 mb-1">Next Service</p>
                    <p className="font-semibold text-primary-900">{formatDate(cab.nextService)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Driver Info */}
              {cab.driver && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 rounded-xl border border-accent-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                      {cab.driver.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{cab.driver.name}</p>
                      <p className="text-sm text-gray-500">{cab.driver.trips} trips • ★ {(Number(cab.driver.rating) || 0).toFixed(1)}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-6 space-y-3">
              {Object.entries(cab.documents).map(([docType, doc], index) => (
                <motion.div
                  key={docType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.status)}
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{docType}</p>
                      <p className="text-sm text-gray-500">
                        Expires: {formatDate(doc.expiry)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      getDocumentStatusColor(doc.status) as
                      | 'success'
                      | 'warning'
                      | 'error'
                    }
                    className="capitalize"
                  >
                    {doc.status}
                  </Badge>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="earnings" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card padding="lg" className="text-center bg-gradient-to-br from-success-50 to-success-100/50 border-success-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-lg shadow-success-500/30">
                      <IndianRupee className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-success-700">
                      {formatCurrency(cab.metrics.totalEarnings)}
                    </p>
                    <p className="text-sm text-success-600 mt-1">Total Earnings</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card padding="lg" className="text-center bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-primary-700">
                      {cab.metrics.totalTrips}
                    </p>
                    <p className="text-sm text-primary-600 mt-1">Total Trips</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card padding="lg" className="text-center bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/30">
                      <IndianRupee className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-accent-700">
                      {formatCurrency(cab.metrics.thisMonthEarnings)}
                    </p>
                    <p className="text-sm text-accent-600 mt-1">This Month</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card padding="lg" className="text-center bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center shadow-lg shadow-warning-500/30">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-warning-700">
                      ★ {(Number(cab.metrics.rating) || 0).toFixed(1)}
                    </p>
                    <p className="text-sm text-warning-600 mt-1">Rating</p>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </TabsRoot>
        </div>
      )}
    </Modal>
  );
}
