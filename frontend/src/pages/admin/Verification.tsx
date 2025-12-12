import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Download,
    Calendar,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { TextArea } from '../../components/ui/TextArea';
import { formatDate } from '../../lib/utils';
import { adminService, type Verification, type VerificationStats } from '../../services/admin.service';

export function AdminVerification() {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // API state
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [stats, setStats] = useState<VerificationStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch verifications on mount
    useEffect(() => {
        const fetchVerifications = async () => {
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
        };

        fetchVerifications();
    }, []);

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
            setVerifications((prev) =>
                prev.map((v) => (v.id === id ? updated : v))
            );
            setStats((prev) => ({
                ...prev,
                pending: prev.pending - 1,
                approved: prev.approved + 1,
            }));
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
            setVerifications((prev) =>
                prev.map((v) => (v.id === id ? updated : v))
            );
            setStats((prev) => ({
                ...prev,
                pending: prev.pending - 1,
                rejected: prev.rejected + 1,
            }));
            setSelectedVerification(null);
            setRejectionReason('');
        } catch (err) {
            console.error('Error rejecting verification:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="warning">Pending</Badge>;
            case 'approved':
                return <Badge variant="success">Approved</Badge>;
            case 'rejected':
                return <Badge variant="error">Rejected</Badge>;
            default:
                return null;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-warning-600" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-success-600" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-error-600" />;
            default:
                return null;
        }
    };

    const pendingCount = stats.pending;
    const approvedCount = stats.approved;
    const rejectedCount = stats.rejected;

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading verification requests...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Document Verification</h1>
                <p className="text-gray-500">Review and verify submitted documents</p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{verifications.length}</p>
                    <p className="text-sm text-gray-500">Total Submissions</p>
                </Card>
                <Card padding="md" className="text-center border-warning-200">
                    <p className="text-3xl font-bold text-warning-600">{pendingCount}</p>
                    <p className="text-sm text-gray-500">Pending Review</p>
                </Card>
                <Card padding="md" className="text-center border-success-200">
                    <p className="text-3xl font-bold text-success-600">{approvedCount}</p>
                    <p className="text-sm text-gray-500">Approved</p>
                </Card>
                <Card padding="md" className="text-center border-error-200">
                    <p className="text-3xl font-bold text-error-600">{rejectedCount}</p>
                    <p className="text-sm text-gray-500">Rejected</p>
                </Card>
            </motion.div>

            {/* Tabs & Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                            <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
                            <TabsTrigger value="all">All ({verifications.length})</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                prefix={<Search className="w-4 h-4" />}
                                className="w-64"
                            />
                            <Select
                                options={[
                                    { value: 'all', label: 'All Types' },
                                    { value: 'driver', label: 'Driver' },
                                    { value: 'cab_owner', label: 'Cab Owner' },
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
                                >
                                    <Card
                                        padding="md"
                                        interactive
                                        onClick={() => setSelectedVerification(verification)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="md" name={verification.applicant.name} />
                                                <div>
                                                    <p className="font-medium text-gray-900">{verification.applicant.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{verification.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(verification.status)}
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg mb-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{verification.documentType}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{verification.documentNumber}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Submitted {formatDate(verification.submittedAt)}
                                            </span>
                                            <Button size="sm" variant="ghost" leftIcon={<Eye className="w-4 h-4" />}>
                                                Review
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* Verification Detail Modal */}
            <Modal
                open={!!selectedVerification}
                onOpenChange={() => {
                    setSelectedVerification(null);
                    setRejectionReason('');
                }}
                title="Document Verification"
                size="lg"
            >
                {selectedVerification && (
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="flex items-center gap-3">
                            {getStatusIcon(selectedVerification.status)}
                            {getStatusBadge(selectedVerification.status)}
                            <span className="text-sm text-gray-500">
                                Submitted on {formatDate(selectedVerification.submittedAt)}
                            </span>
                        </div>

                        {/* Applicant Info */}
                        <Card padding="md" className="bg-gray-50">
                            <div className="flex items-center gap-4">
                                <Avatar size="lg" name={selectedVerification.applicant.name} />
                                <div>
                                    <p className="font-semibold text-gray-900">{selectedVerification.applicant.name}</p>
                                    <p className="text-sm text-gray-500">{selectedVerification.applicant.email}</p>
                                    <p className="text-sm text-gray-500">{selectedVerification.applicant.phone}</p>
                                </div>
                                <Badge variant="secondary" className="ml-auto capitalize">
                                    {selectedVerification.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        </Card>

                        {/* Document Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Document Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-500">Document Type</p>
                                    <p className="font-medium text-gray-900">{selectedVerification.documentType}</p>
                                </div>
                                <div className="p-3 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-500">Document Number</p>
                                    <p className="font-medium text-gray-900">{selectedVerification.documentNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Document Preview Placeholder */}
                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 mb-3">Document Preview</p>
                            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                                Download Document
                            </Button>
                        </div>

                        {/* Rejection Reason (for pending) */}
                        {selectedVerification.status === 'pending' && (
                            <TextArea
                                label="Rejection Reason (if rejecting)"
                                placeholder="Enter reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={2}
                            />
                        )}

                        {/* Notes (for approved/rejected) */}
                        {selectedVerification.notes && (
                            <div className={`p-4 rounded-lg ${selectedVerification.status === 'approved' ? 'bg-success-50' : 'bg-error-50'
                                }`}>
                                <p className={`text-sm ${selectedVerification.status === 'approved' ? 'text-success-700' : 'text-error-700'
                                    }`}>
                                    {selectedVerification.notes}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            {selectedVerification.status === 'pending' ? (
                                <>
                                    <Button
                                        variant="danger"
                                        fullWidth
                                        leftIcon={<XCircle className="w-5 h-5" />}
                                        onClick={() => handleReject(selectedVerification.id)}
                                        disabled={isProcessing || !rejectionReason.trim()}
                                        loading={isProcessing}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        fullWidth
                                        leftIcon={<CheckCircle className="w-5 h-5" />}
                                        onClick={() => handleApprove(selectedVerification.id)}
                                        disabled={isProcessing}
                                        loading={isProcessing}
                                    >
                                        Approve
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" fullWidth onClick={() => setSelectedVerification(null)}>
                                    Close
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
