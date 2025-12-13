import { useState, useEffect, useCallback } from 'react';
import { adminService, type Verification, type VerificationStats } from '@/services/admin.service';

export function useAdminVerification() {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [stats, setStats] = useState<VerificationStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
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

    const filteredVerifications = verifications.filter((v) => {
        const matchesSearch =
            v.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || v.type === typeFilter;
        const matchesTab = activeTab === 'all' || v.status === activeTab;
        return matchesSearch && matchesType && matchesTab;
    });

    const handleApprove = async (id: string) => {
        try {
            setIsProcessing(true);
            const updated = await adminService.approveVerification(id);
            setVerifications((prev) => prev.map((v) => (v.id === id ? updated : v)));
            setStats((prev) => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }));
            setSelectedVerification(null);
        } catch (err) {
            console.error('Error approving verification:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (id: string) => {
        if (!rejectionReason.trim()) return;
        try {
            setIsProcessing(true);
            const updated = await adminService.rejectVerification(id, rejectionReason);
            setVerifications((prev) => prev.map((v) => (v.id === id ? updated : v)));
            setStats((prev) => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
            setSelectedVerification(null);
            setRejectionReason('');
        } catch (err) {
            console.error('Error rejecting verification:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const closeModal = () => {
        setSelectedVerification(null);
        setRejectionReason('');
    };

    return {
        // State
        activeTab,
        searchQuery,
        typeFilter,
        selectedVerification,
        rejectionReason,
        verifications,
        filteredVerifications,
        stats,
        isLoading,
        error,
        isProcessing,
        // Computed
        pendingCount: stats.pending,
        approvedCount: stats.approved,
        rejectedCount: stats.rejected,
        totalCount: verifications.length,
        // Actions
        setActiveTab,
        setSearchQuery,
        setTypeFilter,
        setSelectedVerification,
        setRejectionReason,
        handleApprove,
        handleReject,
        closeModal,
    };
}
