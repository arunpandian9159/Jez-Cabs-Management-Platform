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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your rental bookings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/bookings/new')}
          size="large"
        >
          New Booking
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by customer name, email, or phone..."
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
          onAction={!searchQuery && !statusFilter ? () => navigate('/bookings/new') : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredBookings?.map((booking: Booking) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={booking.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {booking.customerName}
                    </Typography>
                    <StatusBadge status={booking.status} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.customerEmail}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.customerPhone}
                      </Typography>
                    </Box>
                    {booking.cab && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.cab.make} {booking.cab.model} ({booking.cab.registrationNumber})
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Rental Period
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {safeFormatDate(booking.startDate, 'MMM dd, yyyy')} -{' '}
                      {safeFormatDate(booking.endDate, 'MMM dd, yyyy')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={booking.pickupLocation} size="small" />
                    {booking.dropoffLocation && (
                      <Chip label={`→ ${booking.dropoffLocation}`} size="small" variant="outlined" />
                    )}
                  </Box>

                  {booking.totalAmount && (
                    <Typography variant="h6" color="primary" fontWeight={700} sx={{ mt: 2 }}>
                      ${booking.totalAmount.toLocaleString()}
                    </Typography>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(booking.id)}
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
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
};
