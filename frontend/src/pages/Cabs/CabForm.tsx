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
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cabService } from '../../services/cab.service';

const cabSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vin: z.string().optional(),
  status: z.enum(['AVAILABLE', 'RENTED', 'IN_MAINTENANCE']),
  color: z.string().optional(),
  seatingCapacity: z.number().optional(),
  fuelType: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  registrationExpiry: z.string().optional(),
  gpsDeviceId: z.string().optional(),
  dailyRentalRate: z.number().optional(),
  currentMileage: z.number().optional(),
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
        seatingCapacity: cab.seatingCapacity ? Number(cab.seatingCapacity) : undefined,
        dailyRentalRate: cab.dailyRentalRate ? Number(cab.dailyRentalRate) : undefined,
        currentMileage: cab.currentMileage ? Number(cab.currentMileage) : undefined,
        insuranceExpiry: cab.insuranceExpiry ? cab.insuranceExpiry.split('T')[0] : undefined,
        registrationExpiry: cab.registrationExpiry ? cab.registrationExpiry.split('T')[0] : undefined,
      });
    }
  }, [cab, reset]);

  const createMutation = useMutation({
    mutationFn: cabService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      navigate('/cabs');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CabFormData) => cabService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      queryClient.invalidateQueries({ queryKey: ['cab', id] });
      navigate('/cabs');
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/cabs')} sx={{ mb: 2 }}>
          Back to Fleet
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save vehicle. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Make"
                  {...register('make')}
                  error={!!errors.make}
                  helperText={errors.make?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Model"
                  {...register('model')}
                  error={!!errors.model}
                  helperText={errors.model?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  error={!!errors.year}
                  helperText={errors.year?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  {...register('registrationNumber')}
                  error={!!errors.registrationNumber}
                  helperText={errors.registrationNumber?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="VIN (Optional)"
                  {...register('vin')}
                  error={!!errors.vin}
                  helperText={errors.vin?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  {...register('status')}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  defaultValue="AVAILABLE"
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="RENTED">Rented</MenuItem>
                  <MenuItem value="IN_MAINTENANCE">In Maintenance</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Color (Optional)"
                  {...register('color')}
                  error={!!errors.color}
                  helperText={errors.color?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Fuel Type (Optional)"
                  {...register('fuelType')}
                  error={!!errors.fuelType}
                  helperText={errors.fuelType?.message}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Capacity & Pricing
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Seating Capacity (Optional)"
                  type="number"
                  {...register('seatingCapacity', { valueAsNumber: true })}
                  error={!!errors.seatingCapacity}
                  helperText={errors.seatingCapacity?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Daily Rental Rate (Optional)"
                  type="number"
                  {...register('dailyRentalRate', { valueAsNumber: true })}
                  error={!!errors.dailyRentalRate}
                  helperText={errors.dailyRentalRate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Current Mileage (Optional)"
                  type="number"
                  {...register('currentMileage', { valueAsNumber: true })}
                  error={!!errors.currentMileage}
                  helperText={errors.currentMileage?.message}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Insurance & Registration
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Insurance Provider (Optional)"
                  {...register('insuranceProvider')}
                  error={!!errors.insuranceProvider}
                  helperText={errors.insuranceProvider?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Insurance Policy Number (Optional)"
                  {...register('insurancePolicyNumber')}
                  error={!!errors.insurancePolicyNumber}
                  helperText={errors.insurancePolicyNumber?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Insurance Expiry (Optional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('insuranceExpiry')}
                  error={!!errors.insuranceExpiry}
                  helperText={errors.insuranceExpiry?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Registration Expiry (Optional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('registrationExpiry')}
                  error={!!errors.registrationExpiry}
                  helperText={errors.registrationExpiry?.message}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="GPS Device ID (Optional)"
                  {...register('gpsDeviceId')}
                  error={!!errors.gpsDeviceId}
                  helperText={errors.gpsDeviceId?.message}
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

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/cabs')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

