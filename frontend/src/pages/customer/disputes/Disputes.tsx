import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    MessageSquare,
    Clock,
    ChevronRight,
    Plus,
    FileText,
    CheckCircle,
    XCircle,
    HelpCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { TextArea } from '../../../components/ui/TextArea';
import { Select } from '../../../components/ui/Select';
import { formatCurrency, formatRelativeTime } from '../../../lib/utils';

// Mock disputes
const disputes = [
    {
        id: 'd1',
        tripId: 't1',
        type: 'overcharge',
        subject: 'Overcharged for the trip',
        description: 'The fare shown was ₹280 but I was charged ₹320',
        status: 'open',
        createdAt: '2025-12-10T15:00:00',
        amount: 40,
        trip: {
            pickup: 'Koramangala',
            destination: 'Whitefield',
            date: '2025-12-10T14:30:00',
        },
        messages: 2,
    },
    {
        id: 'd2',
        tripId: 't3',
        type: 'driver_behavior',
        subject: 'Driver took longer route',
        description: 'The driver intentionally took a longer route increasing the fare',
        status: 'resolved',
        createdAt: '2025-12-05T18:00:00',
        resolvedAt: '2025-12-07T10:00:00',
        resolution: 'Partial refund of ₹150 credited to wallet',
        amount: 150,
        trip: {
            pickup: 'Bangalore',
            destination: 'Mysore',
            date: '2025-12-05T06:00:00',
        },
        messages: 5,
    },
    {
        id: 'd3',
        tripId: 't2',
        type: 'cancellation',
        subject: 'Unfair cancellation charge',
        description: 'Driver cancelled after 5 minutes but I was charged',
        status: 'closed',
        createdAt: '2025-12-08T10:00:00',
        closedAt: '2025-12-08T12:00:00',
        resolution: 'Claim rejected - Cancellation was initiated by customer',
        amount: 50,
        trip: {
            pickup: 'Indiranagar',
            destination: 'Electronic City',
            date: '2025-12-08T09:00:00',
        },
        messages: 3,
    },
];

const disputeTypes = [
    { value: 'overcharge', label: 'Overcharged' },
    { value: 'driver_behavior', label: 'Driver Behavior' },
    { value: 'cancellation', label: 'Cancellation Issue' },
    { value: 'lost_item', label: 'Lost Item' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'other', label: 'Other' },
];

export function Disputes() {
    const [activeTab, setActiveTab] = useState('all');
    const [showNewDispute, setShowNewDispute] = useState(false);
    const [disputeType, setDisputeType] = useState('');
    const [disputeDescription, setDisputeDescription] = useState('');

    const filteredDisputes = disputes.filter((d) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'open') return d.status === 'open';
        if (activeTab === 'resolved') return d.status === 'resolved' || d.status === 'closed';
        return true;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <Clock className="w-4 h-4 text-warning-500" />;
            case 'resolved':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'closed':
                return <XCircle className="w-4 h-4 text-error-500" />;
            default:
                return <HelpCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Disputes & Issues
                    </h1>
                    <p className="text-gray-500">
                        Report and track issues with your trips
                    </p>
                </div>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewDispute(true)}>
                    New Dispute
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
            >
                <Card padding="md" className="text-center">
                    <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {disputes.filter((d) => d.status === 'open').length}
                    </p>
                    <p className="text-sm text-gray-500">Open</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {disputes.filter((d) => d.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-gray-500">Resolved</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </Card>
            </motion.div>

            {/* Disputes List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All ({disputes.length})</TabsTrigger>
                        <TabsTrigger value="open">
                            Open ({disputes.filter((d) => d.status === 'open').length})
                        </TabsTrigger>
                        <TabsTrigger value="resolved">
                            Resolved ({disputes.filter((d) => d.status !== 'open').length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-4">
                        {filteredDisputes.length === 0 ? (
                            <Card padding="lg" className="text-center">
                                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900 mb-2">No disputes found</h3>
                                <p className="text-gray-500">You haven't raised any disputes yet.</p>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {filteredDisputes.map((dispute, index) => (
                                    <motion.div
                                        key={dispute.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card padding="md" interactive>
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dispute.status === 'open'
                                                    ? 'bg-warning-100'
                                                    : dispute.status === 'resolved'
                                                        ? 'bg-success-100'
                                                        : 'bg-gray-100'
                                                    }`}>
                                                    {getStatusIcon(dispute.status)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">
                                                                {dispute.subject}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {dispute.trip.pickup} → {dispute.trip.destination}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={dispute.status} />
                                                    </div>

                                                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                                                        {dispute.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>
                                                            Created {formatRelativeTime(dispute.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {dispute.messages} messages
                                                        </span>
                                                        {dispute.amount && (
                                                            <span className="font-medium text-gray-700">
                                                                {formatCurrency(dispute.amount)} {dispute.status === 'resolved' ? 'refunded' : 'claimed'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {dispute.resolution && (
                                                        <div className={`mt-2 p-2 rounded-lg text-sm ${dispute.status === 'resolved'
                                                            ? 'bg-success-50 text-success-700'
                                                            : 'bg-gray-50 text-gray-600'
                                                            }`}>
                                                            {dispute.resolution}
                                                        </div>
                                                    )}
                                                </div>

                                                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* New Dispute Modal */}
            <Modal
                open={showNewDispute}
                onOpenChange={setShowNewDispute}
                title="Report an Issue"
                size="md"
            >
                <div className="space-y-4">
                    <Select
                        label="Issue Type"
                        options={disputeTypes}
                        value={disputeType}
                        onValueChange={setDisputeType}
                        placeholder="Select issue type"
                    />

                    <Select
                        label="Select Trip"
                        options={[
                            { value: 't1', label: 'Koramangala → Whitefield (Dec 10)' },
                            { value: 't2', label: 'Indiranagar → Electronic City (Dec 8)' },
                            { value: 't3', label: 'Bangalore → Mysore (Dec 5)' },
                        ]}
                        placeholder="Select the trip"
                    />

                    <TextArea
                        label="Describe the issue"
                        placeholder="Please provide details about the issue..."
                        rows={4}
                        value={disputeDescription}
                        onChange={(e) => setDisputeDescription(e.target.value)}
                    />

                    <div className="bg-info-50 border border-info-200 rounded-lg p-3">
                        <p className="text-sm text-info-700">
                            Our support team will review your dispute and respond within 24-48 hours.
                            You can track the status in your disputes list.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowNewDispute(false)}>
                            Cancel
                        </Button>
                        <Button fullWidth onClick={() => setShowNewDispute(false)}>
                            Submit Dispute
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
