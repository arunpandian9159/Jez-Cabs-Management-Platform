import { motion, AnimatePresence } from 'framer-motion';
import { Car, Fuel, Users, DollarSign, AlertCircle, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CreateCabDto } from '@/services';

interface AddCabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCab: CreateCabDto;
  isCreating: boolean;
  createError: string | null;
  onFieldChange: (field: keyof CreateCabDto, value: string | number) => void;
  onSubmit: () => void;
}

export function AddCabModal({
  open,
  onOpenChange,
  newCab,
  isCreating,
  createError,
  onFieldChange,
  onSubmit,
}: AddCabModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title=""
      size="lg"
    >
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 pb-4 border-b border-gray-100"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Car className="w-7 h-7 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Cab</h2>
            <p className="text-sm text-gray-500">Register a new vehicle to your fleet</p>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {createError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-error-600" />
              </div>
              <p className="text-error-700 text-sm font-medium">{createError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Information Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Vehicle Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registration Number *"
              placeholder="e.g., KA-01-AB-1234"
              value={newCab.registration_number}
              onChange={(e) =>
                onFieldChange('registration_number', e.target.value)
              }
            />
            <Input
              label="Make *"
              placeholder="e.g., Toyota"
              value={newCab.make}
              onChange={(e) => onFieldChange('make', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Model *"
              placeholder="e.g., Innova"
              value={newCab.model}
              onChange={(e) => onFieldChange('model', e.target.value)}
            />
            <Input
              label="Year"
              type="number"
              placeholder="e.g., 2023"
              value={newCab.year.toString()}
              onChange={(e) =>
                onFieldChange(
                  'year',
                  parseInt(e.target.value) || new Date().getFullYear()
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Color *"
              placeholder="e.g., White"
              value={newCab.color}
              onChange={(e) => onFieldChange('color', e.target.value)}
            />
            <Select
              label="Cab Type"
              options={[
                { value: 'sedan', label: 'Sedan' },
                { value: 'suv', label: 'SUV' },
                { value: 'hatchback', label: 'Hatchback' },
                { value: 'luxury', label: 'Luxury' },
                { value: 'van', label: 'Van' },
                { value: 'auto', label: 'Auto' },
              ]}
              value={newCab.cab_type}
              onValueChange={(value) => onFieldChange('cab_type', value)}
            />
          </div>
        </motion.div>

        {/* Specifications Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Fuel className="w-4 h-4 text-accent-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Specifications</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Fuel Type"
              options={[
                { value: 'petrol', label: 'Petrol' },
                { value: 'diesel', label: 'Diesel' },
                { value: 'cng', label: 'CNG' },
                { value: 'electric', label: 'Electric' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
              value={newCab.fuel_type}
              onValueChange={(value) => onFieldChange('fuel_type', value)}
            />
            <div className="relative">
              <Input
                label="Seat Capacity"
                type="number"
                placeholder="e.g., 4"
                value={newCab.seat_capacity.toString()}
                onChange={(e) =>
                  onFieldChange('seat_capacity', parseInt(e.target.value) || 4)
                }
              />
              <Users className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-success-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pricing (Optional)</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
            <div>
              <Input
                label="Base Fare (₹)"
                type="number"
                placeholder="50"
                value={newCab.base_fare?.toString() || ''}
                onChange={(e) =>
                  onFieldChange('base_fare', parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Input
                label="Per KM Rate (₹)"
                type="number"
                placeholder="12"
                value={newCab.per_km_rate?.toString() || ''}
                onChange={(e) =>
                  onFieldChange('per_km_rate', parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Input
                label="Daily Rate (₹)"
                type="number"
                placeholder="1500"
                value={newCab.daily_rate?.toString() || ''}
                onChange={(e) =>
                  onFieldChange('daily_rate', parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pt-4 border-t border-gray-100"
        >
          <Button
            variant="outline"
            fullWidth
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={onSubmit}
            loading={isCreating}
            disabled={isCreating}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30"
          >
            <Car className="w-4 h-4 mr-2" />
            Add Cab
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
