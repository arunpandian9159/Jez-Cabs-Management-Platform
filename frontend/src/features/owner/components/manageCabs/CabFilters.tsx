import { motion } from 'framer-motion';
import { Search, Plus, Car } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { OwnerPageHeader } from '../OwnerPageHeader';

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
      <OwnerPageHeader
        title="Manage Cabs"
        subtitle="View and manage your fleet"
        icon={Car}
        iconColor="accent"
        action={
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={onAddNew}>
            Add New Cab
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="md" className="bg-gradient-to-r from-gray-50 to-white border-gray-200">
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
