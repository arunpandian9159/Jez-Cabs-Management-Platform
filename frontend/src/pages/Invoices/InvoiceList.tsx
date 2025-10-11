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
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Receipt,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../../services/invoice.service';
import { StatusBadge } from '../../components/StatusBadge';
import { Invoice } from '../../types';
import { format, parseISO } from 'date-fns';

const safeFormatDate = (dateString: string, formatString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices', { status: statusFilter }],
    queryFn: () => invoiceService.getAll(statusFilter ? { status: statusFilter } : undefined),
  });

  const invoices = data?.data;

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: invoiceService.markAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaidMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load invoices. Please try again later.</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Invoices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your billing and invoices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/app/invoices/new')}
          size="large"
        >
          New Invoice
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="SENT">Sent</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Invoices Grid */}
      {invoices && invoices.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No invoices found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {statusFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first invoice'}
            </Typography>
            {!statusFilter && (
              <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/app/invoices/new')}>
                New Invoice
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {invoices?.map((invoice: Invoice) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={invoice.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {invoice.booking?.customerName || 'N/A'}
                      </Typography>
                    </Box>
                    <StatusBadge status={invoice.status} />
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                      ${invoice.totalAmount?.toLocaleString() ?? 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Amount
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${invoice.subtotal?.toLocaleString() ?? 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Tax ({invoice.taxRate}%):
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${invoice.taxAmount?.toLocaleString() ?? 'N/A'}
                      </Typography>
                    </Box>
                    {invoice.discount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Discount:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          -${invoice.discount?.toLocaleString() ?? 'N/A'}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {safeFormatDate(invoice.dueDate, 'MMM dd, yyyy')}
                    </Typography>
                    {invoice.paidDate && (
                      <Typography variant="body2" color="success.main">
                        Paid: {safeFormatDate(invoice.paidDate, 'MMM dd, yyyy')}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/app/invoices/${invoice.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(invoice.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleMarkAsPaid(invoice.id)}
                      disabled={markAsPaidMutation.isPending}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
