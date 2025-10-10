import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { bookingService } from '../../services/booking.service';
import { cabService } from '../../services/cab.service';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

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
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar('Booking created successfully', { variant: 'success' });
      navigate('/bookings');
    },
    onError: () => {
      enqueueSnackbar('Failed to create booking', { variant: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BookingFormData) => bookingService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      enqueueSnackbar('Booking updated successfully', { variant: 'success' });
      navigate('/bookings');
    },
    onError: () => {
      enqueueSnackbar('Failed to update booking', { variant: 'error' });
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
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/bookings')} sx={{ mb: 2 }}>
          Back to Bookings
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Booking' : 'New Booking'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update booking information' : 'Create a new rental booking'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save booking. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Vehicle Selection
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Vehicle"
                  {...register('cabId')}
                  error={!!errors.cabId}
                  helperText={errors.cabId?.message}
                  defaultValue=""
                >
                  <MenuItem value="">Select a vehicle</MenuItem>
                  {cabs?.map((cab: any) => (
                    <MenuItem key={cab.id} value={cab.id}>
                      {cab.make} {cab.model} ({cab.registrationNumber}) - ${cab.dailyRentalRate || 0}/day
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {selectedCab && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info">
                    Selected: {selectedCab.make} {selectedCab.model} - Daily Rate: ${selectedCab.dailyRentalRate || 0}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  {...register('customerName')}
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Email"
                  type="email"
                  {...register('customerEmail')}
                  error={!!errors.customerEmail}
                  helperText={errors.customerEmail?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  {...register('customerPhone')}
                  error={!!errors.customerPhone}
                  helperText={errors.customerPhone?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  {...register('status')}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  defaultValue="PENDING"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rental Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('startDate')}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('endDate')}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Pickup Location"
                  {...register('pickupLocation')}
                  error={!!errors.pickupLocation}
                  helperText={errors.pickupLocation?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Dropoff Location (Optional)"
                  {...register('dropoffLocation')}
                  error={!!errors.dropoffLocation}
                  helperText={errors.dropoffLocation?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Total Amount (Optional)"
                  type="number"
                  {...register('totalAmount', { valueAsNumber: true })}
                  error={!!errors.totalAmount}
                  helperText={errors.totalAmount?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Booking' : 'Create Booking'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/bookings')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};
