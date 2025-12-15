import { useState, useEffect, useCallback } from 'react';
import {
  adminService,
  groupVerificationsByUser,
  type Verification,
  type VerificationStats,
  type GroupedVerification,
  type VerificationDocument,
} from '@/services/admin.service';

export function useAdminVerification() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupedVerification | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [groupedVerifications, setGroupedVerifications] = useState<GroupedVerification[]>([]);
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchVerifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [verificationsData, statsData] = await Promise.all([
        adminService.getVerifications(),
        adminService.getVerificationStats(),
      ]);
      setVerifications(verificationsData);
      setGroupedVerifications(groupVerificationsByUser(verificationsData));
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to load verification requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Filter grouped verifications
  const filteredGroupedVerifications = groupedVerifications.filter((group) => {
    const matchesSearch =
      group.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.documents.some(
        (d) =>
          d.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = typeFilter === 'all' || group.type === typeFilter;

    // Match tab based on overall status or if any document matches the tab status
    const matchesTab =
      activeTab === 'all' ||
      group.overallStatus === activeTab ||
      group.documents.some((d) => d.status === activeTab);

    return matchesSearch && matchesType && matchesTab;
  });

  const handleApprove = async (documentId: string) => {
    try {
      setIsProcessing(true);
      const updated = await adminService.approveVerification(documentId);

      // Update the local state
      setVerifications((prev) =>
        prev.map((v) => (v.id === documentId ? updated : v))
      );

      // Re-group verifications using the updated data
      const newVerifications = verifications.map((v) =>
        v.id === documentId ? updated : v
      );
      setGroupedVerifications(groupVerificationsByUser(newVerifications));

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));

      // Update selected document if viewing
      if (selectedDocument?.id === documentId) {
        setSelectedDocument({ ...selectedDocument, status: 'approved', approvedAt: new Date().toISOString() });
      }

      // Update the selected group's document
      if (selectedGroup) {
        setSelectedGroup({
          ...selectedGroup,
          documents: selectedGroup.documents.map((d) =>
            d.id === documentId ? { ...d, status: 'approved', approvedAt: new Date().toISOString() } : d
          ),
        });
      }
    } catch (err) {
      console.error('Error approving verification:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (documentId: string) => {
    if (!rejectionReason.trim()) return;
    try {
      setIsProcessing(true);
      const updated = await adminService.rejectVerification(documentId, rejectionReason);

      // Update the local state
      setVerifications((prev) =>
        prev.map((v) => (v.id === documentId ? updated : v))
      );

      // Re-group verifications using the updated data
      const newVerifications = verifications.map((v) =>
        v.id === documentId ? updated : v
      );
      setGroupedVerifications(groupVerificationsByUser(newVerifications));

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));

      // Update selected document if viewing
      if (selectedDocument?.id === documentId) {
        setSelectedDocument({ ...selectedDocument, status: 'rejected', notes: rejectionReason });
      }

      // Update the selected group's document
      if (selectedGroup) {
        setSelectedGroup({
          ...selectedGroup,
          documents: selectedGroup.documents.map((d) =>
            d.id === documentId ? { ...d, status: 'rejected', notes: rejectionReason } : d
          ),
        });
      }

      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting verification:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setSelectedDocument(null);
    setRejectionReason('');
  };

  const selectDocument = (doc: VerificationDocument) => {
    setSelectedDocument(doc);
    setRejectionReason('');
  };

  // Count unique users with pending documents
  const pendingUsersCount = groupedVerifications.filter(
    (g) => g.overallStatus === 'pending' || g.documents.some((d) => d.status === 'pending')
  ).length;

  return {
    // State
    activeTab,
    searchQuery,
    typeFilter,
    selectedGroup,
    selectedDocument,
    rejectionReason,
    verifications,
    groupedVerifications,
    filteredGroupedVerifications,
    stats,
    isLoading,
    error,
    isProcessing,
    // Computed
    pendingCount: stats.pending,
    approvedCount: stats.approved,
    rejectedCount: stats.rejected,
    totalCount: verifications.length,
    uniqueUsersCount: groupedVerifications.length,
    pendingUsersCount,
    // Actions
    setActiveTab,
    setSearchQuery,
    setTypeFilter,
    setSelectedGroup,
    setSelectedDocument,
    setRejectionReason,
    handleApprove,
    handleReject,
    closeModal,
    selectDocument,
  };
}

