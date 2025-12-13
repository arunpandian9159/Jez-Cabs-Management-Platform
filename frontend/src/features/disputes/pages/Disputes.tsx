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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { TextArea } from '@/components/ui/Input/TextArea';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatRelativeTime } from '@/shared/utils';
import {
  useDisputes,
  disputeTypes,
  type DisputeDisplay,
} from '../hooks/useDisputes';

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

export function Disputes() {
  const {
    activeTab,
    showNewDispute,
    disputeType,
    disputeDescription,
    selectedTripId,
    tripOptions,
    filteredDisputes,
    openCount,
    resolvedCount,
    totalCount,
    setActiveTab,
    setShowNewDispute,
    setDisputeType,
    setDisputeDescription,
    setSelectedTripId,
    handleSubmitDispute,
  } = useDisputes();

  return (
    <div className="space-y-6">
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
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewDispute(true)}
        >
          New Dispute
        </Button>
      </motion.div>

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
          <p className="text-2xl font-bold text-gray-900">{openCount}</p>
          <p className="text-sm text-gray-500">Open</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
          <p className="text-sm text-gray-500">Resolved</p>
        </Card>
        <Card padding="md" className="text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {filteredDisputes.length === 0 ? (
              <Card padding="lg" className="text-center">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  No disputes found
                </h3>
                <p className="text-gray-500">
                  You haven't raised any disputes yet.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredDisputes.map((dispute, index) => (
                  <DisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    index={index}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </TabsRoot>
      </motion.div>

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
            options={tripOptions}
            value={selectedTripId}
            onValueChange={setSelectedTripId}
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
              Our support team will review your dispute and respond within 24-48
              hours. You can track the status in your disputes list.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowNewDispute(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSubmitDispute}
              disabled={!selectedTripId || !disputeType || !disputeDescription}
            >
              Submit Dispute
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DisputeCard({
  dispute,
  index,
  getStatusIcon,
}: {
  dispute: DisputeDisplay;
  index: number;
  getStatusIcon: (s: string) => React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card padding="md" interactive>
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${dispute.status === 'open' ? 'bg-warning-100' : dispute.status === 'resolved' ? 'bg-success-100' : 'bg-gray-100'}`}
          >
            {getStatusIcon(dispute.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-medium text-gray-900">{dispute.subject}</h3>
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
              <span>Created {formatRelativeTime(dispute.createdAt)}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {dispute.messages} messages
              </span>
              {dispute.amount && (
                <span className="font-medium text-gray-700">
                  {formatCurrency(dispute.amount)}{' '}
                  {dispute.status === 'resolved' ? 'refunded' : 'claimed'}
                </span>
              )}
            </div>
            {dispute.resolution && (
              <div
                className={`mt-2 p-2 rounded-lg text-sm ${dispute.status === 'resolved' ? 'bg-success-50 text-success-700' : 'bg-gray-50 text-gray-600'}`}
              >
                {dispute.resolution}
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </Card>
    </motion.div>
  );
}
