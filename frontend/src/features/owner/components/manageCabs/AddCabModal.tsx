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
      title="Add New Cab"
      size="lg"
    >
      <div className="space-y-4">
        {createError && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {createError}
          </div>
        )}

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
          <Input
            label="Seat Capacity"
            type="number"
            placeholder="e.g., 4"
            value={newCab.seat_capacity.toString()}
            onChange={(e) =>
              onFieldChange('seat_capacity', parseInt(e.target.value) || 4)
            }
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-3">Pricing (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Base Fare (₹)"
              type="number"
              placeholder="50"
              value={newCab.base_fare?.toString() || ''}
              onChange={(e) =>
                onFieldChange('base_fare', parseInt(e.target.value) || 0)
              }
            />
            <Input
              label="Per KM Rate (₹)"
              type="number"
              placeholder="12"
              value={newCab.per_km_rate?.toString() || ''}
              onChange={(e) =>
                onFieldChange('per_km_rate', parseInt(e.target.value) || 0)
              }
            />
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

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            fullWidth
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={onSubmit}
            loading={isCreating}
            disabled={isCreating}
          >
            Add Cab
          </Button>
        </div>
      </div>
    </Modal>
  );
}
