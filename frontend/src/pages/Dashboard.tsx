import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  DirectionsCar,
  People,
  Book,
  AttachMoney,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}20`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { sx: { color, fontSize: 32 } } as any)}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsService.getDashboardStats,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-over-time'],
    queryFn: () =>
      analyticsService.getRevenueOverTime({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      }),
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load dashboard data. Please try again later.
      </Alert>
    );
  }

  const fleetData = [
    { name: 'Available', value: stats?.fleet.availableCabs || 0 },
    { name: 'Rented', value: stats?.fleet.rentedCabs || 0 },
    { name: 'Maintenance', value: stats?.fleet.maintenanceCabs || 0 },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Here's what's happening with your fleet today.
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Fleet"
            value={stats?.fleet.totalCabs || 0}
            icon={<DirectionsCar />}
            color="#1976d2"
            subtitle={`${stats?.fleet.utilizationRate.toFixed(1) || 0}% utilization`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Drivers"
            value={stats?.drivers.activeDrivers || 0}
            icon={<People />}
            color="#4caf50"
            subtitle={`${stats?.drivers.totalDrivers || 0} total drivers`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Bookings"
            value={stats?.bookings.activeBookings || 0}
            icon={<Book />}
            color="#ff9800"
            subtitle={`${stats?.bookings.pendingBookings || 0} pending`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`$${stats?.revenue.totalRevenue.toLocaleString() || 0}`}
            icon={<AttachMoney />}
            color="#4caf50"
            subtitle={`${stats?.revenue.collectionRate.toFixed(1) || 0}% collected`}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Revenue Over Time (Last 30 Days)
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData || []}>
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
                  strokeWidth={2}
                  dot={{ fill: '#1976d2' }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Fleet Status */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Fleet Status
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fleetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fleetData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Revenue Breakdown
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    ${stats?.revenue.paidRevenue.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paid
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="warning.main">
                    ${stats?.revenue.pendingRevenue.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Warning sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Alerts & Notifications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(stats?.revenue.overdueInvoices ?? 0) > 0 && (
                <Alert severity="error">
                  {stats?.revenue.overdueInvoices} overdue invoice{(stats?.revenue.overdueInvoices ?? 0) > 1 ? 's' : ''}
                </Alert>
              )}
              {(stats?.fleet.maintenanceCabs ?? 0) > 0 && (
                <Alert severity="warning">
                  {stats?.fleet.maintenanceCabs} vehicle{(stats?.fleet.maintenanceCabs ?? 0) > 1 ? 's' : ''} in maintenance
                </Alert>
              )}
              {(stats?.bookings.pendingBookings ?? 0) > 0 && (
                <Alert severity="info">
                  {stats?.bookings.pendingBookings} pending booking{(stats?.bookings.pendingBookings ?? 0) > 1 ? 's' : ''}
                </Alert>
              )}
              {!stats?.revenue.overdueInvoices && !stats?.fleet.maintenanceCabs && !stats?.bookings.pendingBookings && (
                <Alert severity="success">
                  All systems running smoothly!
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

