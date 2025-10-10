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
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../services/driver.service';

const driverSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  isActive: z.boolean(),
});

type DriverFormData = z.infer<typeof driverSchema>;

export const DriverForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: driver, isLoading: isLoadingDriver } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getOne(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (driver) {
      reset({
        ...driver,
        licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.split('T')[0] : '',
      });
    }
  }, [driver, reset]);

  const createMutation = useMutation({
    mutationFn: driverService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      navigate('/drivers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DriverFormData) => driverService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver', id] });
      navigate('/drivers');
    },
  });

  const onSubmit = async (data: DriverFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save driver:', error);
    }
  };

  if (isEditMode && isLoadingDriver) {
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
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/drivers')} sx={{ mb: 2 }}>
          Back to Drivers
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Driver' : 'Add New Driver'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update driver information' : 'Add a new driver to your roster'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save driver. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address (Optional)"
                  multiline
                  rows={2}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              License Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="License Number"
                  {...register('licenseNumber')}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="License Expiry Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('licenseExpiry')}
                  error={!!errors.licenseExpiry}
                  helperText={errors.licenseExpiry?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name (Optional)"
                  {...register('emergencyContact')}
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Emergency Contact Phone (Optional)"
                  {...register('emergencyPhone')}
                  error={!!errors.emergencyPhone}
                  helperText={errors.emergencyPhone?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <FormControlLabel
              control={<Switch {...register('isActive')} defaultChecked />}
              label="Active Driver"
            />
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
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Driver' : 'Add Driver'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/drivers')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

