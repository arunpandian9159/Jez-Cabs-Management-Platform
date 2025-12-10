import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    AlertTriangle,
    Clock,
    CheckCircle,
    XCircle,
    MessageCircle,
    ChevronRight,
    User,
    Car,
    DollarSign,
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
import { formatCurrency, formatDate } from '../../lib/utils';

// Mock disputes data
const disputes = [
    {
        id: 'd1',
        ticketNo: 'DSP-2024-001',
        customer: { name: 'Rahul Mehta', phone: '+91 98765 43210', email: 'rahul@email.com' },
        driver: { name: 'Ramesh Kumar', phone: '+91 98765 43211', vehicleNo: 'KA 01 AB 1234' },
        trip: { id: 'T123', from: 'Koramangala', to: 'Whitefield', date: '2025-12-10', fare: 450 },
        issue: 'Fare dispute',
        description: 'Customer claims the fare was higher than the estimated amount shown during booking.',
        priority: 'high',
        status: 'open',
        createdAt: '2025-12-10T09:30:00',
        messages: [
            { from: 'customer', text: 'I was charged ₹450 but the app showed ₹380 estimate.', time: '09:30' },
            { from: 'support', text: 'Thank you for reporting. We are looking into this.', time: '09:45' },
        ],
    },
    {
        id: 'd2',
        ticketNo: 'DSP-2024-002',
        customer: { name: 'Anita Sharma', phone: '+91 98765 43212', email: 'anita@email.com' },
        driver: { name: 'Suresh Menon', phone: '+91 98765 43213', vehicleNo: 'KA 01 CD 5678' },
        trip: { id: 'T124', from: 'Indiranagar', to: 'Electronic City', date: '2025-12-09', fare: 580 },
        issue: 'Driver behavior',
        description: 'Customer reports that the driver was rude and drove recklessly.',
        priority: 'high',
        status: 'in_progress',
        createdAt: '2025-12-09T14:20:00',
        assignedTo: 'Support Agent 1',
        messages: [
            { from: 'customer', text: 'The driver was very rude and drove dangerously.', time: '14:20' },
            { from: 'support', text: 'We apologize for your experience. We have initiated an investigation.', time: '14:45' },
        ],
    },
    {
        id: 'd3',
        ticketNo: 'DSP-2024-003',
        customer: { name: 'Vijay Kumar', phone: '+91 98765 43214', email: 'vijay@email.com' },
        driver: { name: 'Mahesh Rao', phone: '+91 98765 43215', vehicleNo: 'KA 09 GH 3456' },
        trip: { id: 'T125', from: 'HSR Layout', to: 'MG Road', date: '2025-12-08', fare: 320 },
        issue: 'Route deviation',
        description: 'Driver took a longer route than necessary, increasing the fare.',
        priority: 'medium',
        status: 'open',
        createdAt: '2025-12-08T16:00:00',
        messages: [],
    },
    {
        id: 'd4',
        ticketNo: 'DSP-2024-004',
        customer: { name: 'Priya Patel', phone: '+91 98765 43216', email: 'priya@email.com' },
        driver: { name: 'Vikram Patil', phone: '+91 98765 43217', vehicleNo: 'KA 05 EF 7890' },
        trip: { id: 'T126', from: 'Marathahalli', to: 'Majestic', date: '2025-12-07', fare: 290 },
        issue: 'Cancellation fee',
        description: 'Customer was charged a cancellation fee even though the driver cancelled.',
        priority: 'low',
        status: 'resolved',
        createdAt: '2025-12-07T11:15:00',
        resolvedAt: '2025-12-07T15:30:00',
        resolution: 'Refund of ₹50 cancellation fee processed.',
        messages: [],
    },
];

export function AdminDisputes() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] | null>(null);
    const [responseText, setResponseText] = useState('');

    const filteredDisputes = disputes.filter((dispute) => {
        const matchesSearch =
            dispute.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dispute.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dispute.issue.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter;
        const matchesTab = activeTab === 'all' || dispute.status === activeTab;
        return matchesSearch && matchesPriority && matchesTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge variant="warning">Open</Badge>;
            case 'in_progress':
                return <Badge variant="primary">In Progress</Badge>;
            case 'resolved':
                return <Badge variant="success">Resolved</Badge>;
            case 'closed':
                return <Badge variant="secondary">Closed</Badge>;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge variant="error">High Priority</Badge>;
            case 'medium':
                return <Badge variant="warning">Medium</Badge>;
            case 'low':
                return <Badge variant="secondary">Low</Badge>;
            default:
                return null;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <AlertTriangle className="w-5 h-5 text-warning-600" />;
            case 'in_progress':
                return <Clock className="w-5 h-5 text-primary-600" />;
            case 'resolved':
                return <CheckCircle className="w-5 h-5 text-success-600" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const openCount = disputes.filter(d => d.status === 'open').length;
    const inProgressCount = disputes.filter(d => d.status === 'in_progress').length;
    const resolvedCount = disputes.filter(d => d.status === 'resolved').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Dispute Management</h1>
                    <p className="text-gray-500">Handle customer complaints and resolutions</p>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{disputes.length}</p>
                    <p className="text-sm text-gray-500">Total Disputes</p>
                </Card>
                <Card padding="md" className="text-center border-warning-200">
                    <p className="text-3xl font-bold text-warning-600">{openCount}</p>
                    <p className="text-sm text-gray-500">Open</p>
                </Card>
                <Card padding="md" className="text-center border-primary-200">
                    <p className="text-3xl font-bold text-primary-600">{inProgressCount}</p>
                    <p className="text-sm text-gray-500">In Progress</p>
                </Card>
                <Card padding="md" className="text-center border-success-200">
                    <p className="text-3xl font-bold text-success-600">{resolvedCount}</p>
                    <p className="text-sm text-gray-500">Resolved</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="all">All ({disputes.length})</TabsTrigger>
                            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
                            <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
                            <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Search disputes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                prefix={<Search className="w-4 h-4" />}
                                className="w-64"
                            />
                            <Select
                                options={[
                                    { value: 'all', label: 'All Priorities' },
                                    { value: 'high', label: 'High' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'low', label: 'Low' },
                                ]}
                                value={priorityFilter}
                                onValueChange={setPriorityFilter}
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab}>
                        <Card padding="none">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ticket</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Issue</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Priority</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDisputes.map((dispute, index) => (
                                            <motion.tr
                                                key={dispute.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => setSelectedDispute(dispute)}
                                            >
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-primary-600">{dispute.ticketNo}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar size="xs" name={dispute.customer.name} />
                                                        <span className="text-sm text-gray-900">{dispute.customer.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{dispute.issue}</td>
                                                <td className="py-3 px-4">{getPriorityBadge(dispute.priority)}</td>
                                                <td className="py-3 px-4">{getStatusBadge(dispute.status)}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{formatDate(dispute.createdAt)}</td>
                                                <td className="py-3 px-4">
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* Dispute Detail Modal */}
            <Modal
                open={!!selectedDispute}
                onOpenChange={() => setSelectedDispute(null)}
                title={`Dispute ${selectedDispute?.ticketNo}`}
                size="lg"
            >
                {selectedDispute && (
                    <div className="space-y-6">
                        {/* Status & Priority */}
                        <div className="flex items-center gap-3">
                            {getStatusIcon(selectedDispute.status)}
                            {getStatusBadge(selectedDispute.status)}
                            {getPriorityBadge(selectedDispute.priority)}
                        </div>

                        {/* Issue Description */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{selectedDispute.issue}</h3>
                            <p className="text-gray-600">{selectedDispute.description}</p>
                        </div>

                        {/* Parties Involved */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="md" className="bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-500">Customer</span>
                                </div>
                                <p className="font-medium text-gray-900">{selectedDispute.customer.name}</p>
                                <p className="text-sm text-gray-500">{selectedDispute.customer.phone}</p>
                            </Card>
                            <Card padding="md" className="bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Car className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-500">Driver</span>
                                </div>
                                <p className="font-medium text-gray-900">{selectedDispute.driver.name}</p>
                                <p className="text-sm text-gray-500">{selectedDispute.driver.vehicleNo}</p>
                            </Card>
                        </div>

                        {/* Trip Details */}
                        <Card padding="md" className="bg-primary-50 border-primary-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-primary-600 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Trip on {formatDate(selectedDispute.trip.date)}
                                    </div>
                                    <p className="text-gray-900">
                                        {selectedDispute.trip.from} → {selectedDispute.trip.to}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Fare</p>
                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedDispute.trip.fare)}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Messages */}
                        {selectedDispute.messages.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Conversation</h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {selectedDispute.messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg ${msg.from === 'customer'
                                                ? 'bg-gray-100 mr-12'
                                                : 'bg-primary-100 ml-12'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-500 capitalize">
                                                    {msg.from}
                                                </span>
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Response Input */}
                        {selectedDispute.status !== 'resolved' && (
                            <div>
                                <TextArea
                                    label="Response"
                                    placeholder="Type your response to the customer..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            {selectedDispute.status === 'open' && (
                                <>
                                    <Button variant="outline" fullWidth>
                                        Assign to Agent
                                    </Button>
                                    <Button fullWidth leftIcon={<MessageCircle className="w-5 h-5" />}>
                                        Send Response
                                    </Button>
                                </>
                            )}
                            {selectedDispute.status === 'in_progress' && (
                                <>
                                    <Button variant="outline" fullWidth leftIcon={<DollarSign className="w-5 h-5" />}>
                                        Issue Refund
                                    </Button>
                                    <Button fullWidth leftIcon={<CheckCircle className="w-5 h-5" />}>
                                        Mark Resolved
                                    </Button>
                                </>
                            )}
                            {selectedDispute.status === 'resolved' && (
                                <div className="w-full p-4 bg-success-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="w-5 h-5 text-success-600" />
                                        <span className="font-medium text-success-700">Resolved</span>
                                    </div>
                                    <p className="text-sm text-success-600">{selectedDispute.resolution}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
