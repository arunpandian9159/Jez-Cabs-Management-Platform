import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  User,
  FileText,
  Car,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { formatDate } from '@/shared/utils';
import type { Contract } from '@/services/owner.service';

interface ContractsListProps {
  contracts: Contract[];
  activeTab: string;
  searchQuery: string;
  statusFilter: string;
  stats: {
    total: number;
    contractsByType: { driver: number; platform: number; insurance: number };
  };
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onContractSelect: (contract: Contract) => void;
}

export function ContractsList({
  contracts,
  activeTab,
  searchQuery,
  statusFilter,
  stats,
  onTabChange,
  onSearchChange,
  onStatusChange,
  onContractSelect,
}: ContractsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expiring':
        return (
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Badge variant="warning" className="text-[10px] sm:text-xs">Expiring</Badge>
          </motion.div>
        );
      case 'expired':
        return <Badge variant="error">Expired</Badge>;
      case 'pending':
        return <Badge variant="primary">Pending</Badge>;
      default:
        return null;
    }
  };

  const getContractIcon = (type: string) => {
    switch (type) {
      case 'driver':
        return <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
      case 'platform':
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
      default:
        return <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
  };

  const getIconGradient = (type: string) => {
    switch (type) {
      case 'driver':
        return 'from-primary-500 to-primary-600';
      case 'platform':
        return 'from-accent-500 to-accent-600';
      default:
        return 'from-success-500 to-success-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <TabsRoot value={activeTab} onValueChange={onTabChange}>
        {/* Tabs and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <TabsList className="flex-wrap gap-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="driver" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Driver ({stats.contractsByType.driver})</span>
              <span className="sm:hidden">{stats.contractsByType.driver}</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Platform ({stats.contractsByType.platform})</span>
              <span className="sm:hidden">{stats.contractsByType.platform}</span>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Insurance ({stats.contractsByType.insurance})</span>
              <span className="sm:hidden">{stats.contractsByType.insurance}</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 sm:gap-3">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
              className="flex-1 sm:w-48 md:w-64"
            />
            <Select
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'expiring', label: 'Expiring' },
                { value: 'expired', label: 'Expired' },
              ]}
              value={statusFilter}
              onValueChange={onStatusChange}
            />
          </div>
        </div>

        <TabsContent value={activeTab}>
          <div className="space-y-2 sm:space-y-3">
            {contracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.03 }}
                whileHover={{ scale: 1.005 }}
              >
                <Card
                  padding="sm"
                  interactive
                  onClick={() => onContractSelect(contract)}
                  className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary-500 sm:p-4"
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getIconGradient(contract.type)} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      {getContractIcon(contract.type)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <p className="font-semibold text-gray-900 text-xs sm:text-base truncate">
                          {contract.title}
                        </p>
                        {getStatusBadge(contract.status)}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-gray-500">
                        <span className="font-medium truncate">{contract.partyName}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{contract.vehicleAssigned}</span>
                      </div>
                    </div>
                    {/* Date & Commission - hidden on mobile */}
                    <div className="hidden md:block text-right">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDate(contract.startDate)} – {formatDate(contract.endDate)}
                        </span>
                      </div>
                      {contract.commission && (
                        <p className="text-sm font-bold text-gray-900">
                          {contract.commission}% commission
                        </p>
                      )}
                    </div>
                    {/* Mobile: show commission only */}
                    <div className="md:hidden text-right min-w-[50px] flex-shrink-0">
                      {contract.commission && (
                        <p className="text-xs font-bold text-gray-900">
                          {contract.commission}%
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </TabsRoot>
    </motion.div>
  );
}

