import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Fade,
  Grow,
  useTheme,
  alpha,
} from '@mui/material';
import {
  DirectionsCar,
  People,
  Book,
  AttachMoney,
  TrendingUp,
  Warning,
  Assessment,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import { format, subDays } from 'date-fns';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle, delay = 0 }) => {
  const theme = useTheme();

  return (
    <Grow in timeout={600 + delay}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color, 0.15)}`,
            '& .stat-icon': {
              transform: 'scale(1.1)',
            },
          },
        }}
        role="region"
        aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box
              className="stat-icon"
              sx={{
                bgcolor: alpha(color, 0.1),
                borderRadius: 3,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                border: `2px solid ${alpha(color, 0.2)}`,
              }}
              aria-hidden="true"
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { color, fontSize: 36 }
              } as any)}
            </Box>
          </Box>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              lineHeight: 1.2,
            }}
            id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {value}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.secondary, 0.8),
                fontWeight: 500,
                display: 'block',
                mt: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

export const Dashboard: React.FC = () => {
  const theme = useTheme();
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
    <Fade in timeout={800}>
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 400 }}>
            Welcome back! Here's what's happening with your fleet today.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {format(new Date(), 'MMM dd, yyyy \'at\' h:mm a')}
          </Typography>
        </Box>

        {/* KPI Cards Section */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Key Performance Indicators
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Fleet"
                value={stats?.fleet.totalCabs || 0}
                icon={<DirectionsCar />}
                color="#1976d2"
                subtitle={`${stats?.fleet.utilizationRate.toFixed(1) || 0}% utilization`}
                delay={0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Active Drivers"
                value={stats?.drivers.activeDrivers || 0}
                icon={<People />}
                color="#4caf50"
                subtitle={`${stats?.drivers.totalDrivers || 0} total drivers`}
                delay={100}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Active Bookings"
                value={stats?.bookings.activeBookings || 0}
                icon={<Book />}
                color="#ff9800"
                subtitle={`${stats?.bookings.pendingBookings || 0} pending`}
                delay={200}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Revenue"
                value={`$${stats?.revenue.totalRevenue.toLocaleString() || 0}`}
                icon={<AttachMoney />}
                color="#4caf50"
                subtitle={`${stats?.revenue.collectionRate.toFixed(1) || 0}% collected`}
                delay={300}
              />
            </Grid>
          </Grid>
        </Box>

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
    </Fade>
  );
};
