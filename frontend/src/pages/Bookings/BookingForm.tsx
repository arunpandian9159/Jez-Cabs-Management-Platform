import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingService } from '../../services/booking.service';
import { cabService } from '../../services/cab.service';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

const bookingSchema = z.object({
  cabId: z.string().min(1, 'Vehicle is required'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: booking, isLoading: isLoadingBooking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getOne(id!),
    enabled: isEditMode,
  });

  const { data: cabs } = useQuery({
    queryKey: ['cabs', { status: 'AVAILABLE' }],
    queryFn: () => cabService.getAll({ status: 'AVAILABLE' }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: 'PENDING',
    },
  });

  const selectedCabId = watch('cabId');
  const selectedCab = cabs?.find((cab: any) => cab.id === selectedCabId);

  useEffect(() => {
    if (booking) {
      reset({
        ...booking,
        startDate: booking.startDate ? booking.startDate.split('T')[0] : '',
        endDate: booking.endDate ? booking.endDate.split('T')[0] : '',
        totalAmount: booking.totalAmount ? Number(booking.totalAmount) : undefined,
      });
    }
  }, [booking, reset]);

  const createMutation = useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully');
      navigate('/app/bookings');
    },
    onError: () => {
      toast.error('Failed to create booking');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BookingFormData) => bookingService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking updated successfully');
      navigate('/app/bookings');
    },
    onError: () => {
      toast.error('Failed to update booking');
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
  };

  if (isEditMode && isLoadingBooking) {
    return <LoadingSkeleton variant="form" />;
  }

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/app/bookings')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit Booking' : 'New Booking'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update booking information' : 'Create a new rental booking'}
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">
            Failed to save booking. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Vehicle Selection
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cabId">Vehicle</Label>
                <Select {...register('cabId')} defaultValue="">
                  <SelectTrigger className={errors.cabId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a vehicle</SelectItem>
                    {cabs?.map((cab: any) => (
                      <SelectItem key={cab.id} value={cab.id}>
                        {cab.make} {cab.model} ({cab.registrationNumber}) - ${cab.dailyRentalRate || 0}/day
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cabId && (
                  <p className="text-sm text-red-600 mt-1">{errors.cabId.message}</p>
                )}
              </div>
              {selectedCab && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    Selected: {selectedCab.make} {selectedCab.model} - Daily Rate: ${selectedCab.dailyRentalRate || 0}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  {...register('customerName')}
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register('customerEmail')}
                  className={errors.customerEmail ? 'border-red-500' : ''}
                />
                {errors.customerEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  {...register('customerPhone')}
                  className={errors.customerPhone ? 'border-red-500' : ''}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select {...register('status')} defaultValue="PENDING">
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rental Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  {...register('pickupLocation')}
                  className={errors.pickupLocation ? 'border-red-500' : ''}
                />
                {errors.pickupLocation && (
                  <p className="text-sm text-red-600 mt-1">{errors.pickupLocation.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="dropoffLocation">Dropoff Location (Optional)</Label>
                <Input
                  id="dropoffLocation"
                  {...register('dropoffLocation')}
                  className={errors.dropoffLocation ? 'border-red-500' : ''}
                />
                {errors.dropoffLocation && (
                  <p className="text-sm text-red-600 mt-1">{errors.dropoffLocation.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount (Optional)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  {...register('totalAmount', { valueAsNumber: true })}
                  className={errors.totalAmount ? 'border-red-500' : ''}
                />
                {errors.totalAmount && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalAmount.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
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
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Booking' : 'Create Booking'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/bookings')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
