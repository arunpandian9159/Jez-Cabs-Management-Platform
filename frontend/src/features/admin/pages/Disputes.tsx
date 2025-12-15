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
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { TextArea } from '@/components/ui/Input/TextArea';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useAdminDisputes } from '../hooks/useAdminDisputes';
import { AdminPageHeader, AdminStatCard } from '../components';

export function AdminDisputes() {
  const {
    activeTab,
    searchQuery,
    priorityFilter,
    selectedDispute,
    responseText,
    filteredDisputes,
    openCount,
    inProgressCount,
    resolvedCount,
    totalCount,
    setActiveTab,
    setSearchQuery,
    setPriorityFilter,
    setSelectedDispute,
    setResponseText,
  } = useAdminDisputes();

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
        return (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Badge variant="error">High Priority</Badge>
          </motion.div>
        );
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dispute Management"
        subtitle="Handle customer complaints and resolutions"
        icon={AlertTriangle}
        iconColor="warning"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <AdminStatCard
          label="Total Disputes"
          value={totalCount}
          icon={MessageSquare}
          color="primary"
          delay={0.1}
        />
        <AdminStatCard
          label="Open"
          value={openCount}
          icon={AlertTriangle}
          color="warning"
          delay={0.15}
        />
        <AdminStatCard
          label="In Progress"
          value={inProgressCount}
          icon={Clock}
          color="primary"
          delay={0.2}
        />
        <AdminStatCard
          label="Resolved"
          value={resolvedCount}
          icon={CheckCircle}
          color="success"
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
              <TabsTrigger value="all" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">All<span className="hidden sm:inline"> ({totalCount})</span></TabsTrigger>
              <TabsTrigger value="open" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">Open<span className="hidden sm:inline"> ({openCount})</span></TabsTrigger>
              <TabsTrigger value="in_progress" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">
                <span className="sm:hidden">Progress</span><span className="hidden sm:inline">In Progress ({inProgressCount})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">
                Resolved<span className="hidden sm:inline"> ({resolvedCount})</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="Search disputes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="w-4 h-4" />}
                className="w-full sm:w-64"
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
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Issue
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Date
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDisputes.map((dispute, index) => (
                      <motion.tr
                        key={dispute.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-primary-600 text-xs sm:text-sm">
                            {dispute.ticketNo}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">
                            {dispute.customer.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate hidden md:table-cell">
                          {dispute.issue}
                        </td>
                        <td className="py-4 px-4 text-[10px] sm:text-xs md:text-sm">
                          {getPriorityBadge(dispute.priority)}
                        </td>
                        <td className="py-4 px-4 text-[10px] sm:text-xs md:text-sm">
                          {getStatusBadge(dispute.status)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 hidden sm:table-cell">
                          {formatDate(dispute.createdAt)}
                        </td>
                        <td className="py-4 px-4">
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

      <Modal
        open={!!selectedDispute}
        onOpenChange={() => setSelectedDispute(null)}
        title={`Dispute ${selectedDispute?.ticketNo}`}
        size="lg"
      >
        {selectedDispute && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(selectedDispute.status)}
              {getStatusBadge(selectedDispute.status)}
              {getPriorityBadge(selectedDispute.priority)}
            </div>
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                {selectedDispute.issue}
              </h3>
              <p className="text-gray-600">{selectedDispute.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card padding="md" className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    Customer
                  </span>
                </div>
                <p className="font-medium text-gray-900">
                  {selectedDispute.customer.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedDispute.customer.phone}
                </p>
              </Card>
              <Card padding="md" className="bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-accent-600">
                    Driver
                  </span>
                </div>
                <p className="font-medium text-gray-900">
                  {selectedDispute.driver.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedDispute.driver.vehicleNo}
                </p>
              </Card>
            </div>
            <Card padding="md" className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-primary-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    Trip on {formatDate(selectedDispute.trip.date)}
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedDispute.trip.from} → {selectedDispute.trip.to}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Fare</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedDispute.trip.fare)}
                  </p>
                </div>
              </div>
            </Card>
            {selectedDispute.messages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Conversation
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {selectedDispute.messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-xl ${msg.from === 'customer' ? 'bg-gray-100 mr-12' : 'bg-gradient-to-r from-primary-100 to-primary-50 ml-12'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 capitalize">
                          {msg.from}
                        </span>
                        <span className="text-xs text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {selectedDispute.status !== 'resolved' && (
              <TextArea
                label="Response"
                placeholder="Type your response to the customer..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
              />
            )}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {selectedDispute.status === 'open' && (
                <>
                  <Button variant="outline" fullWidth>
                    Assign to Agent
                  </Button>
                  <Button
                    fullWidth
                    leftIcon={<MessageCircle className="w-5 h-5" />}
                  >
                    Send Response
                  </Button>
                </>
              )}
              {selectedDispute.status === 'in_progress' && (
                <>
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<DollarSign className="w-5 h-5" />}
                  >
                    Issue Refund
                  </Button>
                  <Button
                    fullWidth
                    leftIcon={<CheckCircle className="w-5 h-5" />}
                  >
                    Mark Resolved
                  </Button>
                </>
              )}
              {selectedDispute.status === 'resolved' && (
                <div className="w-full p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                    <span className="font-medium text-success-700">
                      Resolved
                    </span>
                  </div>
                  <p className="text-sm text-success-600">
                    {selectedDispute.resolution}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
