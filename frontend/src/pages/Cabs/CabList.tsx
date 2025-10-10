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

  const { data: cabs, isLoading, error } = useQuery({
    queryKey: ['cabs', { status: statusFilter, search: searchQuery }],
    queryFn: () => cabService.getAll({ status: statusFilter, search: searchQuery }),
  });

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Fleet Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your vehicle fleet
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/cabs/new')}
          size="large"
        >
          Add Vehicle
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by registration, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
          onAction={!searchQuery && !statusFilter ? () => navigate('/cabs/new') : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {cabs?.map((cab: Cab) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cab.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {cab.make} {cab.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cab.year}
                      </Typography>
                    </Box>
                    <StatusBadge status={cab.status} />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={cab.registrationNumber}
                      size="small"
                      sx={{ fontWeight: 600, bgcolor: '#e3f2fd' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {cab.seatingCapacity && (
                      <Typography variant="body2" color="text.secondary">
                        Seats: {cab.seatingCapacity}
                      </Typography>
                    )}
                    {cab.fuelType && (
                      <Typography variant="body2" color="text.secondary">
                        Fuel: {cab.fuelType}
                      </Typography>
                    )}
                    {cab.dailyRentalRate && (
                      <Typography variant="body2" fontWeight={600} color="primary">
                        ${cab.dailyRentalRate}/day
                      </Typography>
                    )}
                  </Box>

                  {/* Expiry Warnings */}
                  <Box sx={{ mt: 2 }}>
                    {isExpired(cab.insuranceExpiry) && (
                      <Alert severity="error" icon={<Warning />} sx={{ mb: 1 }}>
                        Insurance expired
                      </Alert>
                    )}
                    {!isExpired(cab.insuranceExpiry) && isExpiringSoon(cab.insuranceExpiry) && (
                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 1 }}>
                        Insurance expiring soon
                      </Alert>
                    )}
                    {isExpired(cab.registrationExpiry) && (
                      <Alert severity="error" icon={<Warning />} sx={{ mb: 1 }}>
                        Registration expired
                      </Alert>
                    )}
                    {!isExpired(cab.registrationExpiry) && isExpiringSoon(cab.registrationExpiry) && (
                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 1 }}>
                        Registration expiring soon
                      </Alert>
                    )}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/cabs/${cab.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(cab.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Delete />
                  </IconButton>
                </Box>
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
    </Box>
  );
};

