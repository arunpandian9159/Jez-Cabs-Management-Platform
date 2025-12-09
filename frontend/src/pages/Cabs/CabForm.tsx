import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cabService } from '../../services/cab.service';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const cabSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  registration_number: z.string().min(1, 'Registration number is required'),
  vin: z.string().optional(),
  status: z.enum(['AVAILABLE', 'RENTED', 'IN_MAINTENANCE']),
  color: z.string().optional(),
  seating_capacity: z.number().optional(),
  fuel_type: z.string().optional(),
  insurance_expiry: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional(),
  registration_expiry: z.string().optional(),
  gps_device_id: z.string().optional(),
  daily_rental_rate: z.number().optional(),
  current_mileage: z.number().optional(),
  notes: z.string().optional(),
});

type CabFormData = z.infer<typeof cabSchema>;

export const CabForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: cab, isLoading: isLoadingCab } = useQuery({
    queryKey: ['cab', id],
    queryFn: () => cabService.getOne(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CabFormData>({
    resolver: zodResolver(cabSchema),
    defaultValues: {
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    if (cab) {
      reset({
        ...cab,
        year: Number(cab.year),
        seating_capacity: cab.seating_capacity ? Number(cab.seating_capacity) : undefined,
        daily_rental_rate: cab.daily_rental_rate ? Number(cab.daily_rental_rate) : undefined,
        current_mileage: cab.current_mileage ? Number(cab.current_mileage) : undefined,
        insurance_expiry: cab.insurance_expiry ? cab.insurance_expiry.split('T')[0] : undefined,
        registration_expiry: cab.registration_expiry ? cab.registration_expiry.split('T')[0] : undefined,
      });
    }
  }, [cab, reset]);

  const createMutation = useMutation({
    mutationFn: cabService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      toast.success('Vehicle created successfully');
      navigate('/app/cabs');
    },
    onError: () => {
      toast.error('Failed to create vehicle');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CabFormData) => cabService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      queryClient.invalidateQueries({ queryKey: ['cab', id] });
      toast.success('Vehicle updated successfully');
      navigate('/app/cabs');
    },
    onError: () => {
      toast.error('Failed to update vehicle');
    },
  });

  const onSubmit = async (data: CabFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  if (isEditMode && isLoadingCab) {
    return <LoadingSkeleton variant="form" />;
  }

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/app/cabs')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fleet
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">
            Failed to save vehicle. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  {...register('make')}
                  className={errors.make ? 'border-red-500' : ''}
                />
                {errors.make && (
                  <p className="text-sm text-red-600 mt-1">{errors.make.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...register('model')}
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && (
                  <p className="text-sm text-red-600 mt-1">{errors.model.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && (
                  <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  {...register('registration_number')}
                  className={errors.registration_number ? 'border-red-500' : ''}
                />
                {errors.registration_number && (
                  <p className="text-sm text-red-600 mt-1">{errors.registration_number.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vin">VIN (Optional)</Label>
                <Input
                  id="vin"
                  {...register('vin')}
                  className={errors.vin ? 'border-red-500' : ''}
                />
                {errors.vin && (
                  <p className="text-sm text-red-600 mt-1">{errors.vin.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select {...register('status')} defaultValue="AVAILABLE">
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                    <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="color">Color (Optional)</Label>
                <Input
                  id="color"
                  {...register('color')}
                  className={errors.color ? 'border-red-500' : ''}
                />
                {errors.color && (
                  <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type (Optional)</Label>
                <Input
                  id="fuel_type"
                  {...register('fuel_type')}
                  className={errors.fuel_type ? 'border-red-500' : ''}
                />
                {errors.fuel_type && (
                  <p className="text-sm text-red-600 mt-1">{errors.fuel_type.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Capacity & Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              <div>
                <Label htmlFor="seating_capacity">Seating Capacity (Optional)</Label>
                <Input
                  id="seating_capacity"
                  type="number"
                  {...register('seating_capacity', { valueAsNumber: true })}
                  className={errors.seating_capacity ? 'border-red-500' : ''}
                />
                {errors.seating_capacity && (
                  <p className="text-sm text-red-600 mt-1">{errors.seating_capacity.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="daily_rental_rate">Daily Rental Rate (Optional)</Label>
                <Input
                  id="daily_rental_rate"
                  type="number"
                  {...register('daily_rental_rate', { valueAsNumber: true })}
                  className={errors.daily_rental_rate ? 'border-red-500' : ''}
                />
                {errors.daily_rental_rate && (
                  <p className="text-sm text-red-600 mt-1">{errors.daily_rental_rate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="current_mileage">Current Mileage (Optional)</Label>
                <Input
                  id="current_mileage"
                  type="number"
                  {...register('current_mileage', { valueAsNumber: true })}
                  className={errors.current_mileage ? 'border-red-500' : ''}
                />
                {errors.current_mileage && (
                  <p className="text-sm text-red-600 mt-1">{errors.current_mileage.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Insurance & Registration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div>
                <Label htmlFor="insurance_provider">Insurance Provider (Optional)</Label>
                <Input
                  id="insurance_provider"
                  {...register('insurance_provider')}
                  className={errors.insurance_provider ? 'border-red-500' : ''}
                />
                {errors.insurance_provider && (
                  <p className="text-sm text-red-600 mt-1">{errors.insurance_provider.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="insurance_policy_number">Insurance Policy Number (Optional)</Label>
                <Input
                  id="insurance_policy_number"
                  {...register('insurance_policy_number')}
                  className={errors.insurance_policy_number ? 'border-red-500' : ''}
                />
                {errors.insurance_policy_number && (
                  <p className="text-sm text-red-600 mt-1">{errors.insurance_policy_number.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="insurance_expiry">Insurance Expiry (Optional)</Label>
                <Input
                  id="insurance_expiry"
                  type="date"
                  {...register('insurance_expiry')}
                  className={errors.insurance_expiry ? 'border-red-500' : ''}
                />
                {errors.insurance_expiry && (
                  <p className="text-sm text-red-600 mt-1">{errors.insurance_expiry.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="registration_expiry">Registration Expiry (Optional)</Label>
                <Input
                  id="registration_expiry"
                  type="date"
                  {...register('registration_expiry')}
                  className={errors.registration_expiry ? 'border-red-500' : ''}
                />
                {errors.registration_expiry && (
                  <p className="text-sm text-red-600 mt-1">{errors.registration_expiry.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Additional Information
            </h2>
            <div className="space-y-6">

              <div>
                <Label htmlFor="gps_device_id">GPS Device ID (Optional)</Label>
                <Input
                  id="gps_device_id"
                  {...register('gps_device_id')}
                  className={errors.gps_device_id ? 'border-red-500' : ''}
                />
                {errors.gps_device_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.gps_device_id.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  {...register('notes')}
                  className={errors.notes ? 'border-red-500' : ''}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/cabs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
