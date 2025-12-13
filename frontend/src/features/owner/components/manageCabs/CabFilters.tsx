import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface CabFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddNew: () => void;
}

export function CabFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onAddNew,
}: CabFiltersProps) {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Cabs</h1>
          <p className="text-gray-500">View and manage your fleet</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={onAddNew}>
          Add New Cab
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="md">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by make, model, or registration..."
                prefix={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'idle', label: 'Idle' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
              value={statusFilter}
              onValueChange={onStatusChange}
            />
          </div>
        </Card>
      </motion.div>
    </>
  );
}
