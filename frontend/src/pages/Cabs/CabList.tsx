import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  DirectionsCar,
  Warning,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { cabService } from '../../services/cab.service';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Cab } from '../../types';

export const CabList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cabToDelete, setCabToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cabs', { status: statusFilter, search: searchQuery }],
    queryFn: () => cabService.getAll({ status: statusFilter, search: searchQuery }),
  });

  const cabs = data?.data;

  const deleteMutation = useMutation({
    mutationFn: cabService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      enqueueSnackbar('Vehicle deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setCabToDelete(null);
    },
    onError: () => {
      enqueueSnackbar('Failed to delete vehicle', { variant: 'error' });
    },
  });

  const handleDeleteClick = (id: string) => {
    setCabToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (cabToDelete) {
      await deleteMutation.mutateAsync(cabToDelete);
    }
  };

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={6} />;
  }

  if (error) {
    return <Alert severity="error">Failed to load vehicles. Please try again later.</Alert>;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box className="animate-scale-in">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1976d2, #0d9488)',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                }}
              >
                <DirectionsCar sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  className="text-gradient-primary"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Fleet Management
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Manage your vehicle fleet efficiently
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/app/cabs/new')}
            className="btn-primary-modern"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Add Vehicle
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Card
        className="card-modern"
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
              Search & Filter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Find vehicles by registration, make, model, or filter by status
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search by registration, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(25, 118, 210, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid rgba(25, 118, 210, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.15)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(25, 118, 210, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid rgba(25, 118, 210, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.15)',
                    },
                  },
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="RENTED">Rented</MenuItem>
                <MenuItem value="IN_MAINTENANCE">In Maintenance</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      {cabs && cabs.length === 0 ? (
        <EmptyState
          icon={DirectionsCar}
          title="No vehicles found"
          description={
            searchQuery || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Get started by adding your first vehicle to your fleet'
          }
          actionLabel={!searchQuery && !statusFilter ? 'Add Vehicle' : undefined}
          onAction={!searchQuery && !statusFilter ? () => navigate('/app/cabs/new') : undefined}
        />
      ) : (
        <Grid container spacing={4}>
          {cabs?.map((cab: Cab, index: number) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={cab.id}>
              <Card
                className="card-modern group"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animationDelay: `${index * 0.1}s`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.2)',
                    border: '1px solid rgba(25, 118, 210, 0.3)',
                    '& .cab-actions': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                    '& .cab-registration': {
                      transform: 'scale(1.05)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: cab.status === 'AVAILABLE'
                      ? 'linear-gradient(90deg, #4caf50, #2e7d32)'
                      : cab.status === 'RENTED'
                      ? 'linear-gradient(90deg, #2196f3, #1565c0)'
                      : 'linear-gradient(90deg, #ff9800, #f57c00)',
                    borderRadius: '16px 16px 0 0',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                          mb: 0.5,
                          color: 'text.primary',
                          fontSize: '1.4rem',
                        }}
                      >
                        {cab.make} {cab.model}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {cab.year}
                      </Typography>
                    </Box>
                    <StatusBadge status={cab.status} />
                  </Box>

                  {/* Registration */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      className="cab-registration"
                      label={cab.registration_number}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.2))',
                        color: 'primary.main',
                        border: '1px solid rgba(25, 118, 210, 0.3)',
                        transition: 'transform 0.3s ease',
                        px: 2,
                        py: 1,
                      }}
                    />
                  </Box>

                  {/* Vehicle Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {cab.seating_capacity && (
                      <Typography variant="body2" color="text.secondary">
                        Seats: {cab.seating_capacity}
                      </Typography>
                    )}
                    {cab.fuel_type && (
                      <Typography variant="body2" color="text.secondary">
                        Fuel: {cab.fuel_type}
                      </Typography>
                    )}
                    {cab.daily_rental_rate && (
                      <Typography variant="body2" fontWeight={600} color="primary">
                        ${cab.daily_rental_rate}/day
                      </Typography>
                    )}
                  </Box>

                  {/* Expiry Warnings */}
                  <Box sx={{ mt: 2 }}>
                    {isExpired(cab.insurance_expiry) && (
                      <Alert severity="error" icon={<Warning />} sx={{ mb: 1 }}>
                        Insurance expired
                      </Alert>
                    )}
                    {!isExpired(cab.insurance_expiry) && isExpiringSoon(cab.insurance_expiry) && (
                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 1 }}>
                        Insurance expiring soon
                      </Alert>
                    )}
                    {isExpired(cab.registration_expiry) && (
                      <Alert severity="error" icon={<Warning />} sx={{ mb: 1 }}>
                        Registration expired
                      </Alert>
                    )}
                    {!isExpired(cab.registration_expiry) && isExpiringSoon(cab.registration_expiry) && (
                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 1 }}>
                        Registration expiring soon
                      </Alert>
                    )}
                  </Box>
                  {/* Actions */}
                  <Box
                    className="cab-actions"
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 3,
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/app/cabs/${cab.id}/edit`)}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(cab.id)}
                      disabled={deleteMutation.isPending}
                      sx={{
                        color: 'error.main',
                        border: '1px solid',
                        borderColor: 'error.main',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
