import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Assessment, TrendingUp } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export const Reports: React.FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsService.getDashboardStats,
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenue-over-time-report'],
    queryFn: () =>
      analyticsService.getRevenueOverTime({
        startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      }),
  });

  const chartData = revenueData?.data;

  if (isLoadingStats || isLoadingRevenue) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive business insights and performance metrics
        </Typography>
      </Box>

      {/* Revenue Report */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Revenue Trend (Last 90 Days)
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ fill: '#1976d2', r: 4 }}
                name="Daily Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fleet Utilization */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Fleet Utilization
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {stats?.fleet.utilizationRate.toFixed(1)}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall Utilization Rate
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {stats?.fleet.availableCabs}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Available Vehicles
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Booking Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Total Bookings</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.bookings.totalBookings}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Active Bookings</Typography>
                  <Typography variant="h6" fontWeight={700} color="info.main">
                    {stats?.bookings.activeBookings}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Completed Bookings</Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {stats?.bookings.completedBookings}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revenue Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Total Revenue</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    ${stats?.revenue.totalRevenue?.toLocaleString() ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Paid Revenue</Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    ${stats?.revenue.paidRevenue?.toLocaleString() ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body1">Pending Revenue</Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.main">
                    ${stats?.revenue.pendingRevenue?.toLocaleString() ?? 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
