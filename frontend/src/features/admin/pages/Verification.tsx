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
  Users,
  Files,
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
import type { GroupedVerification, VerificationDocument } from '@/services/admin.service';

export function AdminVerification() {
  const {
    activeTab,
    searchQuery,
    typeFilter,
    selectedGroup,
    selectedDocument,
    rejectionReason,
    isProcessing,
    filteredGroupedVerifications,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalCount,
    uniqueUsersCount,
    setActiveTab,
    setSearchQuery,
    setTypeFilter,
    setSelectedGroup,
    setRejectionReason,
    handleApprove,
    handleReject,
    selectDocument,
    closeModal,
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
      case 'mixed':
        return <Badge variant="secondary">Mixed Status</Badge>;
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

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 border-warning-300 text-warning-700';
      case 'approved':
        return 'bg-success-100 border-success-300 text-success-700';
      case 'rejected':
        return 'bg-error-100 border-error-300 text-error-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getOverallStatusGradient = (status: string) => {
    switch (status) {
      case 'pending':
        return 'from-warning-400 to-warning-500';
      case 'approved':
        return 'from-success-400 to-success-500';
      case 'rejected':
        return 'from-error-400 to-error-500';
      case 'mixed':
        return 'from-purple-400 to-purple-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const renderGroupCard = (group: GroupedVerification, index: number) => {
    const pendingDocs = group.documents.filter((d) => d.status === 'pending').length;
    const approvedDocs = group.documents.filter((d) => d.status === 'approved').length;
    const rejectedDocs = group.documents.filter((d) => d.status === 'rejected').length;

    return (
      <motion.div
        key={group.userId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card
          padding="lg"
          className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary-500"
          onClick={() => setSelectedGroup(group)}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${getOverallStatusGradient(group.overallStatus)} text-white`}
            >
              <Files className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {group.applicant.name}
                </h3>
                {getStatusBadge(group.overallStatus)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {group.applicant.email}
              </p>

              {/* Document count badges */}
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  <Files className="w-3 h-3 mr-1" />
                  {group.documents.length} Documents
                </Badge>
                {pendingDocs > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {pendingDocs} Pending
                  </Badge>
                )}
                {approvedDocs > 0 && (
                  <Badge variant="success" className="text-xs">
                    {approvedDocs} Approved
                  </Badge>
                )}
                {rejectedDocs > 0 && (
                  <Badge variant="error" className="text-xs">
                    {rejectedDocs} Rejected
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(group.latestSubmittedAt)}
                </span>
                <span className="flex items-center gap-1 capitalize">
                  {getApplicantIcon(group.type)}
                  {group.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderDocumentItem = (doc: VerificationDocument, isSelected: boolean) => {
    return (
      <div
        key={doc.id}
        onClick={() => selectDocument(doc)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
          ? 'border-primary-500 bg-primary-50'
          : `${getDocumentStatusColor(doc.status)} hover:shadow-md`
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
            {getDocumentIcon(doc.documentType)}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 capitalize">
              {doc.documentType.replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-500">
              #{doc.documentNumber || 'N/A'}
            </p>
          </div>
          {getStatusBadge(doc.status)}
        </div>
      </div>
    );
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
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <AdminStatCard
          label="Applicants"
          value={uniqueUsersCount}
          icon={Users}
          color="primary"
          delay={0.1}
        />
        <AdminStatCard
          label="Total Documents"
          value={totalCount}
          icon={FileText}
          color="gray"
          delay={0.12}
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All ({uniqueUsersCount})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filteredGroupedVerifications.filter(g => g.overallStatus === 'pending' || g.documents.some(d => d.status === 'pending')).length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({filteredGroupedVerifications.filter(g => g.overallStatus === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({filteredGroupedVerifications.filter(g => g.overallStatus === 'rejected' || g.documents.some(d => d.status === 'rejected')).length})
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="w-4 h-4" />}
                className="w-full sm:w-64"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'driver', label: 'Drivers' },
                  { value: 'cab_owner', label: 'Cab Owners' },
                ]}
                value={typeFilter}
                onValueChange={setTypeFilter}
              />
            </div>
          </div>
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroupedVerifications.map((group, index) =>
                renderGroupCard(group, index)
              )}
              {filteredGroupedVerifications.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No verification requests found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>

      {/* Grouped User Modal */}
      <Modal
        open={!!selectedGroup}
        onOpenChange={closeModal}
        title="User Documents Verification"
        size="xl"
      >
        {selectedGroup && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <Avatar size="lg" name={selectedGroup.applicant.name} />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedGroup.applicant.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedGroup.applicant.email}</p>
                <p className="text-sm text-gray-500">{selectedGroup.applicant.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(selectedGroup.overallStatus)}
                <Badge variant="secondary" className="capitalize">
                  {selectedGroup.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Documents Grid */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Files className="w-5 h-5" />
                Submitted Documents ({selectedGroup.documents.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedGroup.documents.map((doc) =>
                  renderDocumentItem(doc, selectedDocument?.id === doc.id)
                )}
              </div>
            </div>

            {/* Selected Document Preview */}
            {selectedDocument && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-100 pt-6"
              >
                <Card padding="md" className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      {getDocumentIcon(selectedDocument.documentType)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedDocument.documentType.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Document #{selectedDocument.documentNumber || 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(selectedDocument.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Document Number</p>
                      <p className="font-medium text-gray-900">
                        {selectedDocument.documentNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(selectedDocument.submittedAt)}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Document Preview */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Document Preview
                  </p>
                  <div className="relative group">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                      {selectedDocument.documentUrl ? (
                        <img
                          src={selectedDocument.documentUrl}
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
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        View Full
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Pending Documents */}
                {selectedDocument.status === 'pending' && (
                  <>
                    <TextArea
                      label="Rejection Reason (if rejecting)"
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                      className="mt-4"
                    />
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={() => handleReject(selectedDocument.id)}
                        disabled={isProcessing || !rejectionReason}
                        leftIcon={<XCircle className="w-5 h-5" />}
                      >
                        Reject Document
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => handleApprove(selectedDocument.id)}
                        disabled={isProcessing}
                        leftIcon={<CheckCircle className="w-5 h-5" />}
                      >
                        Approve Document
                      </Button>
                    </div>
                  </>
                )}

                {/* Status Messages for Non-Pending Documents */}
                {selectedDocument.status === 'approved' && (
                  <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-success-600" />
                      <span className="font-medium text-success-700">
                        Document Approved
                      </span>
                    </div>
                    {selectedDocument.approvedAt && (
                      <p className="text-sm text-success-600">
                        Verified on {formatDate(selectedDocument.approvedAt)}
                      </p>
                    )}
                  </div>
                )}

                {selectedDocument.status === 'rejected' && (
                  <div className="p-4 bg-gradient-to-r from-error-50 to-error-100 rounded-xl mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-5 h-5 text-error-600" />
                      <span className="font-medium text-error-700">
                        Document Rejected
                      </span>
                    </div>
                    {selectedDocument.notes && (
                      <p className="text-sm text-error-600">
                        Reason: {selectedDocument.notes}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Prompt to select a document */}
            {!selectedDocument && (
              <div className="text-center py-8 text-gray-500 border-t border-gray-100">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a document above to review</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
