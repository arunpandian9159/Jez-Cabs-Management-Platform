import { motion } from 'framer-motion';
import {
  Search,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Building2,
  Car,
  CreditCard,
  ChevronRight,
  Eye,
  Download,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { TextArea } from '@/components/ui/Input/TextArea';
import { formatDate } from '@/shared/utils';
import { useAdminVerification } from '../hooks/useAdminVerification';
import { AdminPageHeader, AdminStatCard } from '../components';

export function AdminVerification() {
  const {
    activeTab,
    searchQuery,
    typeFilter,
    selectedVerification,
    rejectionReason,
    isProcessing,
    filteredVerifications,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalCount,
    setActiveTab,
    setSearchQuery,
    setTypeFilter,
    setSelectedVerification,
    setRejectionReason,
    handleApprove,
    handleReject,
  } = useAdminVerification();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Badge variant="warning">Pending Review</Badge>
          </motion.div>
        );
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'license':
        return <CreditCard className="w-5 h-5" />;
      case 'aadhaar':
      case 'pan':
        return <BadgeCheck className="w-5 h-5" />;
      case 'registration':
      case 'rc':
        return <Car className="w-5 h-5" />;
      case 'insurance':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getApplicantIcon = (applicantType: string) => {
    switch (applicantType) {
      case 'driver':
        return <User className="w-4 h-4" />;
      case 'cab_owner':
        return <Building2 className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Document Verification"
        subtitle="Review and verify driver and owner documents"
        icon={FileCheck}
        iconColor="warning"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <AdminStatCard
          label="Total Submissions"
          value={totalCount}
          icon={FileText}
          color="primary"
          delay={0.1}
        />
        <AdminStatCard
          label="Pending Review"
          value={pendingCount}
          icon={Clock}
          color="warning"
          delay={0.15}
        />
        <AdminStatCard
          label="Approved"
          value={approvedCount}
          icon={CheckCircle}
          color="success"
          delay={0.2}
        />
        <AdminStatCard
          label="Rejected"
          value={rejectedCount}
          icon={XCircle}
          color="error"
          delay={0.25}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="w-4 h-4" />}
                className="w-64"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'license', label: 'Driving License' },
                  { value: 'aadhaar', label: 'Aadhaar Card' },
                  { value: 'pan', label: 'PAN Card' },
                  { value: 'registration', label: 'Vehicle Registration' },
                  { value: 'insurance', label: 'Insurance' },
                ]}
                value={typeFilter}
                onValueChange={setTypeFilter}
              />
            </div>
          </div>
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-2 gap-4">
              {filteredVerifications.map((verification, index) => (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    padding="lg"
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary-500"
                    onClick={() => setSelectedVerification(verification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${verification.status === 'pending'
                          ? 'bg-gradient-to-br from-warning-400 to-warning-500 text-white'
                          : verification.status === 'approved'
                            ? 'bg-gradient-to-br from-success-400 to-success-500 text-white'
                            : 'bg-gradient-to-br from-error-400 to-error-500 text-white'
                        }`}>
                        {getDocumentIcon(verification.documentType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {verification.applicant.name}
                          </h3>
                          {getStatusBadge(verification.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 capitalize">
                          {verification.documentType.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(verification.submittedAt)}
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            {getApplicantIcon(verification.type)}
                            {verification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>

      <Modal
        open={!!selectedVerification}
        onOpenChange={() => setSelectedVerification(null)}
        title="Document Verification"
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name={selectedVerification.applicant.name} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedVerification.applicant.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedVerification.status)}
                  <Badge variant="secondary" className="capitalize">
                    {selectedVerification.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            <Card padding="md" className="bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  {getDocumentIcon(selectedVerification.documentType)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedVerification.documentType.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Document #{selectedVerification.documentNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Document Number</p>
                  <p className="font-medium text-gray-900">{selectedVerification.documentNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedVerification.submittedAt)}</p>
                </div>
              </div>
            </Card>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Document Preview</p>
              <div className="relative group">
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedVerification.documentUrl ? (
                    <img
                      src={selectedVerification.documentUrl}
                      alt="Document"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>No document preview available</p>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                    View Full
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {selectedVerification.status === 'pending' && (
              <>
                <TextArea
                  label="Rejection Reason (if rejecting)"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={() => handleReject(selectedVerification.id)}
                    disabled={isProcessing || !rejectionReason}
                    leftIcon={<XCircle className="w-5 h-5" />}
                  >
                    Reject Document
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleApprove(selectedVerification.id)}
                    disabled={isProcessing}
                    leftIcon={<CheckCircle className="w-5 h-5" />}
                  >
                    Approve Document
                  </Button>
                </div>
              </>
            )}

            {selectedVerification.status === 'approved' && (
              <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-success-700">Document Approved</span>
                </div>
                {selectedVerification.approvedAt && (
                  <p className="text-sm text-success-600">
                    Verified on {formatDate(selectedVerification.approvedAt)}
                  </p>
                )}
              </div>
            )}

            {selectedVerification.status === 'rejected' && (
              <div className="p-4 bg-gradient-to-r from-error-50 to-error-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-5 h-5 text-error-600" />
                  <span className="font-medium text-error-700">Document Rejected</span>
                </div>
                {selectedVerification.notes && (
                  <p className="text-sm text-error-600">
                    {selectedVerification.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
