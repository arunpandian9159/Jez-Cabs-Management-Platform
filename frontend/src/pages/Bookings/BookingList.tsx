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
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Book,
  Person,
  DirectionsCar,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { bookingService } from '../../services/booking.service';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Booking } from '../../types';
import { format, parseISO } from 'date-fns';

const safeFormatDate = (dateString: string, formatString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', { status: statusFilter, search: searchQuery }],
    queryFn: () => bookingService.getAll(statusFilter ? { status: statusFilter } : undefined),
  });

  const bookings = data?.data;

  const deleteMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      enqueueSnackbar('Booking deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    },
    onError: () => {
      enqueueSnackbar('Failed to delete booking', { variant: 'error' });
    },
  });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete) {
      await deleteMutation.mutateAsync(bookingToDelete);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={6} />;
  }

  if (error) {
    return <Alert severity="error">Failed to load bookings. Please try again later.</Alert>;
  }

  const filteredBookings = bookings?.filter((booking: Booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.customerName.toLowerCase().includes(query) ||
      booking.customerEmail.toLowerCase().includes(query) ||
      booking.customerPhone.includes(query)
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
                  background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
                }}
              >
                <Book sx={{ color: 'white', fontSize: 28 }} />
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
                  Booking Management
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Manage your rental bookings efficiently
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/app/bookings/new')}
            className="btn-primary-modern"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(33, 150, 243, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            New Booking
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
          border: '1px solid rgba(33, 150, 243, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
              Search & Filter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Find bookings by customer details or filter by status
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search by customer name, email, or phone..."
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
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid rgba(33, 150, 243, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 20px rgba(33, 150, 243, 0.15)',
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
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid rgba(33, 150, 243, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 20px rgba(33, 150, 243, 0.15)',
                    },
                  },
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      {filteredBookings && filteredBookings.length === 0 ? (
        <EmptyState
          icon={Book}
          title="No bookings found"
          description={
            searchQuery || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Get started by creating your first booking to manage your rental operations'
          }
          actionLabel={!searchQuery && !statusFilter ? 'New Booking' : undefined}
          onAction={!searchQuery && !statusFilter ? () => navigate('/app/bookings/new') : undefined}
        />
      ) : (
        <Grid container spacing={4}>
          {filteredBookings?.map((booking: Booking, index: number) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={booking.id}>
              <Card
                className="card-modern group animate-fade-in-up"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(33, 150, 243, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animationDelay: `${index * 0.1}s`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    '& .booking-actions': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: booking.status === 'ACTIVE'
                      ? 'linear-gradient(90deg, #4caf50, #2e7d32)'
                      : booking.status === 'PENDING'
                      ? 'linear-gradient(90deg, #ff9800, #f57c00)'
                      : booking.status === 'COMPLETED'
                      ? 'linear-gradient(90deg, #2196f3, #1565c0)'
                      : 'linear-gradient(90deg, #f44336, #c62828)',
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
                          fontSize: '1.3rem',
                        }}
                      >
                        {booking.customerName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Booking #{booking.id.slice(-8)}
                      </Typography>
                    </Box>
                    <StatusBadge status={booking.status} />
                  </Box>

                  {/* Customer Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Person sx={{ fontSize: 18, color: 'primary.main' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          EMAIL
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          {booking.customerEmail}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Person sx={{ fontSize: 18, color: 'success.main' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          PHONE
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          {booking.customerPhone}
                        </Typography>
                      </Box>
                    </Box>

                    {booking.cab && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <DirectionsCar sx={{ fontSize: 18, color: 'warning.main' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            VEHICLE
                          </Typography>
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {booking.cab.make} {booking.cab.model}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.cab.registration_number}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Rental Period */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(33, 150, 243, 0.1))',
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                      p: 3,
                      borderRadius: 3,
                      mb: 3,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                      RENTAL PERIOD
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
                      {safeFormatDate(booking.startDate, 'MMM dd, yyyy')} -{' '}
                      {safeFormatDate(booking.endDate, 'MMM dd, yyyy')}
                    </Typography>
                  </Box>

                  {/* Locations */}
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    <Chip
                      label={booking.pickupLocation}
                      sx={{
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2))',
                        color: 'success.main',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                      }}
                    />
                    {booking.dropoffLocation && (
                      <Chip
                        label={`→ ${booking.dropoffLocation}`}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderColor: 'warning.main',
                          color: 'warning.main',
                        }}
                      />
                    )}
                  </Box>

                  {/* Total Amount */}
                  {booking.totalAmount && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2))',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        textAlign: 'center',
                        mb: 3,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                        TOTAL AMOUNT
                      </Typography>
                      <Typography variant="h5" color="success.main" fontWeight={800} sx={{ mt: 0.5 }}>
                        ${booking.totalAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box
                    className="booking-actions"
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 2,
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/app/bookings/${booking.id}/edit`)}
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
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(booking.id)}
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
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
