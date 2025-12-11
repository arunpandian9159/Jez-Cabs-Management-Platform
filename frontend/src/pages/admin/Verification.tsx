import { useState } from 'react';
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

// Mock verification requests
const verifications = [
    {
        id: 'v1',
        applicant: { name: 'Ganesh Kumar', email: 'ganesh@email.com', phone: '+91 98765 43210' },
        type: 'driver',
        documentType: 'Driving License',
        documentNumber: 'KA1234567890',
        submittedAt: '2025-12-10T09:30:00',
        status: 'pending',
        documentUrl: '/documents/license-1.pdf',
        notes: '',
    },
    {
        id: 'v2',
        applicant: { name: 'Lakshmi Devi', email: 'lakshmi@email.com', phone: '+91 98765 43211' },
        type: 'driver',
        documentType: 'Vehicle RC',
        documentNumber: 'KA01AB1234',
        submittedAt: '2025-12-10T11:15:00',
        status: 'pending',
        documentUrl: '/documents/rc-1.pdf',
        notes: '',
    },
    {
        id: 'v3',
        applicant: { name: 'Ravi Motors Pvt Ltd', email: 'ravi@ravimotors.com', phone: '+91 98765 43212' },
        type: 'cab_owner',
        documentType: 'Insurance Certificate',
        documentNumber: 'INS2024123456',
        submittedAt: '2025-12-09T14:20:00',
        status: 'pending',
        documentUrl: '/documents/insurance-1.pdf',
        notes: '',
    },
    {
        id: 'v4',
        applicant: { name: 'Suresh Menon', email: 'suresh@email.com', phone: '+91 98765 43213' },
        type: 'driver',
        documentType: 'Aadhaar Card',
        documentNumber: 'XXXX XXXX 1234',
        submittedAt: '2025-12-09T10:00:00',
        status: 'approved',
        documentUrl: '/documents/aadhaar-1.pdf',
        approvedAt: '2025-12-09T16:30:00',
        approvedBy: 'Admin User',
        notes: 'Verified successfully',
    },
    {
        id: 'v5',
        applicant: { name: 'Rajesh Patel', email: 'rajesh@email.com', phone: '+91 98765 43214' },
        type: 'driver',
        documentType: 'Driving License',
        documentNumber: 'MH9876543210',
        submittedAt: '2025-12-08T09:00:00',
        status: 'rejected',
        documentUrl: '/documents/license-2.pdf',
        rejectedAt: '2025-12-08T15:00:00',
        rejectedBy: 'Admin User',
        notes: 'Document expired. Please upload a valid license.',
    },
];

export function AdminVerification() {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState<typeof verifications[0] | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const filteredVerifications = verifications.filter((v) => {
        const matchesSearch =
            v.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || v.type === typeFilter;
        const matchesTab = activeTab === 'all' || v.status === activeTab;
        return matchesSearch && matchesType && matchesTab;
    });

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

    const pendingCount = verifications.filter(v => v.status === 'pending').length;
    const approvedCount = verifications.filter(v => v.status === 'approved').length;
    const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

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
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        fullWidth
                                        leftIcon={<CheckCircle className="w-5 h-5" />}
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
