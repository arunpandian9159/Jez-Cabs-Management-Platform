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
            <Badge variant="warning">Expiring Soon</Badge>
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
        return <User className="w-5 h-5 text-white" />;
      case 'platform':
        return <FileText className="w-5 h-5 text-white" />;
      default:
        return <Car className="w-5 h-5 text-white" />;
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
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="driver">
              Driver ({stats.contractsByType.driver})
            </TabsTrigger>
            <TabsTrigger value="platform">
              Platform ({stats.contractsByType.platform})
            </TabsTrigger>
            <TabsTrigger value="insurance">
              Insurance ({stats.contractsByType.insurance})
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3">
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
              className="w-64"
            />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
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
          <div className="space-y-3">
            {contracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.03 }}
                whileHover={{ scale: 1.005 }}
              >
                <Card
                  padding="md"
                  interactive
                  onClick={() => onContractSelect(contract)}
                  className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary-500"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconGradient(contract.type)} flex items-center justify-center shadow-lg`}
                    >
                      {getContractIcon(contract.type)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {contract.title}
                        </p>
                        {getStatusBadge(contract.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{contract.partyName}</span>
                        <span>•</span>
                        <span>{contract.vehicleAssigned}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDate(contract.startDate)} –{' '}
                          {formatDate(contract.endDate)}
                        </span>
                      </div>
                      {contract.commission && (
                        <p className="text-sm font-bold text-gray-900">
                          {contract.commission}% commission
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
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
