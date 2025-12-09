import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  IconButton,
  Alert,
  InputAdornment,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { driverService } from '../../services/driver.service';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Driver } from '../../types';
import { format } from 'date-fns';

export const DriverList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['drivers', { isActive: showActiveOnly || undefined }],
    queryFn: () => driverService.getAll({ isActive: showActiveOnly || undefined }),
  });

  const drivers = data?.data;

  const deleteMutation = useMutation({
    mutationFn: driverService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      enqueueSnackbar('Driver deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setDriverToDelete(null);
    },
    onError: () => {
      enqueueSnackbar('Failed to delete driver', { variant: 'error' });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: driverService.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      enqueueSnackbar('Driver status updated successfully', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Failed to update driver status', { variant: 'error' });
    },
  });

  const handleDeleteClick = (id: string) => {
    setDriverToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (driverToDelete) {
      await deleteMutation.mutateAsync(driverToDelete);
    }
  };

  const handleToggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync(id);
  };

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={6} />;
  }

  if (error) {
    return <Alert severity="error">Failed to load drivers. Please try again later.</Alert>;
  }

  const filteredDrivers = drivers?.filter((driver: Driver) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      driver.firstName.toLowerCase().includes(query) ||
      driver.lastName.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.phone.includes(query) ||
      driver.licenseNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box className="animate-scale-in">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)',
                }}
              >
                <Person sx={{ color: 'white', fontSize: 28 }} />
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
                  Driver Management
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Manage your driver roster efficiently
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/app/drivers/new')}
            className="btn-primary-modern"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)',
              background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(156, 39, 176, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Add Driver
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
          border: '1px solid rgba(156, 39, 176, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
              Search & Filter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Find drivers by name, contact details, or filter by status
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search by name, email, phone, or license number..."
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
                    border: '1px solid rgba(156, 39, 176, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(156, 39, 176, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid rgba(156, 39, 176, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 20px rgba(156, 39, 176, 0.15)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#9c27b0',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#9c27b0',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Active Drivers Only
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      {filteredDrivers && filteredDrivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers found"
          description={
            searchQuery || showActiveOnly
              ? 'Try adjusting your filters to see more results'
              : 'Get started by adding your first driver to your team'
          }
          actionLabel={!searchQuery && !showActiveOnly ? 'Add Driver' : undefined}
          onAction={!searchQuery && !showActiveOnly ? () => navigate('/app/drivers/new') : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredDrivers?.map((driver: Driver) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={driver.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {driver.firstName} {driver.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {driver.email}
                      </Typography>
                    </Box>
                    {driver.isActive ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip label="Inactive" color="default" size="small" />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      📞 {driver.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🪪 {driver.licenseNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 Expires: {driver.licenseExpiry ? format(new Date(driver.licenseExpiry), 'MMM dd, yyyy') : 'N/A'}
                    </Typography>
                  </Box>

                  {/* Expiry Warnings */}
                  <Box>
                    {driver.licenseExpiry && isExpired(driver.licenseExpiry) && (
                      <Alert severity="error" icon={<Warning />} sx={{ mb: 1 }}>
                        License expired
                      </Alert>
                    )}
                    {driver.licenseExpiry && !isExpired(driver.licenseExpiry) && isExpiringSoon(driver.licenseExpiry) && (
                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 1 }}>
                        License expiring soon
                      </Alert>
                    )}
                  </Box>

                  {driver.emergencyContact && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Emergency Contact
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {driver.emergencyContact}
                      </Typography>
                      {driver.emergencyPhone && (
                        <Typography variant="body2" color="text.secondary">
                          {driver.emergencyPhone}
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/ app / drivers / ${driver.id}/edit`)}
                    >
                      Edit
                    </Button >
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(driver.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Delete />
                    </IconButton>
                  </Box >
                  <Button
                    fullWidth
                    variant={driver.isActive ? 'outlined' : 'contained'}
                    color={driver.isActive ? 'warning' : 'success'}
                    onClick={() => handleToggleActive(driver.id)}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {driver.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </Box >
              </Card >
            </Grid >
          ))}
        </Grid >
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </div >
  );
};
