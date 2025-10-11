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
import { invoiceService } from '../../services/invoice.service';
import { bookingService } from '../../services/booking.service';

const invoiceSchema = z.object({
  bookingId: z.string().min(1, 'Booking is required'),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
  discount: z.number().min(0, 'Discount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getOne(id!),
    enabled: isEditMode,
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getAll(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: 'DRAFT',
      taxRate: 10,
      discount: 0,
    },
  });

  const subtotal = watch('subtotal') || 0;
  const taxRate = watch('taxRate') || 0;
  const discount = watch('discount') || 0;

  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount - discount;

  useEffect(() => {
    if (invoice) {
      reset({
        ...invoice,
        subtotal: Number(invoice.subtotal),
        taxRate: Number(invoice.taxRate),
        discount: Number(invoice.discount),
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
      });
    }
  }, [invoice, reset]);

  const createMutation = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      navigate('/app/invoices');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InvoiceFormData) => invoiceService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      navigate('/app/invoices');
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData = {
        ...data,
        taxAmount,
        totalAmount,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync(invoiceData as any);
      } else {
        await createMutation.mutateAsync(invoiceData as any);
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  if (isEditMode && isLoadingInvoice) {
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
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/app/invoices')} sx={{ mb: 2 }}>
          Back to Invoices
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Invoice' : 'New Invoice'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update invoice information' : 'Create a new invoice'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save invoice. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Invoice Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Booking"
                  {...register('bookingId')}
                  error={!!errors.bookingId}
                  helperText={errors.bookingId?.message}
                  defaultValue=""
                >
                  <MenuItem value="">Select a booking</MenuItem>
                  {bookings?.map((booking: any) => (
                    <MenuItem key={booking.id} value={booking.id}>
                      {booking.customerName} - {booking.cab?.registrationNumber || 'N/A'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  {...register('status')}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  defaultValue="DRAFT"
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="SENT">Sent</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('dueDate')}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pricing
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Subtotal"
                  type="number"
                  {...register('subtotal', { valueAsNumber: true })}
                  error={!!errors.subtotal}
                  helperText={errors.subtotal?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  {...register('taxRate', { valueAsNumber: true })}
                  error={!!errors.taxRate}
                  helperText={errors.taxRate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  {...register('discount', { valueAsNumber: true })}
                  error={!!errors.discount}
                  helperText={errors.discount?.message}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={600}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tax ({taxRate}%):
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={600}>
                    ${taxAmount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Discount:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    -${discount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ borderTop: '2px solid #ddd', pt: 2, mt: 1 }}>
                    <Grid container>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="h6" fontWeight={700}>
                          Total:
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          ${totalAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              {...register('notes')}
              error={!!errors.notes}
              helperText={errors.notes?.message}
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
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Create Invoice'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/app/invoices')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};
