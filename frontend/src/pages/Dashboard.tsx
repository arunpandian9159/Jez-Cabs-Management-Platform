import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
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
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay * 0.1}s` }}>
      <Card
        className="card-modern group"
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(color, 0.02)}, ${alpha(color, 0.08)})`,
          border: `1px solid ${alpha(color, 0.1)}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: `0 25px 50px ${alpha(color, 0.25)}`,
            border: `1px solid ${alpha(color, 0.3)}`,
            '& .stat-icon': {
              transform: 'scale(1.15) rotate(5deg)',
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              color: 'white',
            },
            '& .stat-value': {
              transform: 'scale(1.05)',
            },
            '& .stat-bg': {
              opacity: 1,
              transform: 'scale(1.2)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)})`,
            borderRadius: '16px 16px 0 0',
          },
        }}
        role="region"
        aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {/* Background decoration */}
        <Box
          className="stat-bg"
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(color, 0.1)}, transparent)`,
            opacity: 0.5,
            transition: 'all 0.4s ease',
            transform: 'scale(1)',
          }}
        />

        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {title}
              </Typography>
              <Typography
                className="stat-value"
                variant="h2"
                fontWeight={900}
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1,
                  transition: 'transform 0.3s ease',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(color, 0.8)})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontWeight: 500,
                    display: 'block',
                    mt: 1,
                    fontSize: '0.85rem',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Box
              className="stat-icon"
              sx={{
                background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha(color, 0.25)})`,
                borderRadius: 4,
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `2px solid ${alpha(color, 0.2)}`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
              }}
              aria-hidden="true"
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: {
                  color,
                  fontSize: 40,
                  transition: 'all 0.3s ease',
                }
              } as any)}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
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
    <div className="animate-fade-in-up">
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Box className="animate-scale-in" sx={{ mb: 3 }}>
            <Typography
              variant="h2"
              fontWeight={900}
              className="text-gradient-primary"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '1.25rem',
                maxWidth: 600,
              }}
            >
              Welcome back! Here's what's happening with your fleet today.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                width: 'fit-content',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite',
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Last updated: {format(new Date(), 'MMM dd, yyyy \'at\' h:mm a')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* KPI Cards Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 3,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Assessment sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                Key Performance Indicators
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Real-time insights into your business performance
              </Typography>
            </Box>
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

      {/* Charts Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
              borderRadius: 3,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: `0 8px 20px ${alpha(theme.palette.success.main, 0.3)}`,
            }}
          >
            <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
              Analytics & Insights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Detailed performance metrics and trends
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            className="card-modern"
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
                borderRadius: '16px 16px 0 0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.25)})`,
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <TrendingUp sx={{ color: 'primary.main', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Revenue Over Time
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Last 30 days performance
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              borderRadius: 2,
              overflow: 'hidden',
              background: alpha(theme.palette.background.paper, 0.5),
              p: 2,
            }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.primary.main, 0.1)} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 12,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.grey[900], 0.15)}`,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: theme.palette.primary.main, strokeWidth: 2 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Fleet Status */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            className="card-modern"
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.warning.main})`,
                borderRadius: '16px 16px 0 0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.25)})`,
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                }}
              >
                <DirectionsCar sx={{ color: 'secondary.main', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Fleet Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Current cab distribution
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              borderRadius: 2,
              overflow: 'hidden',
              background: alpha(theme.palette.background.paper, 0.5),
              p: 2,
              mb: 3,
            }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={fleetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {fleetData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                      borderRadius: 12,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.grey[900], 0.15)}`,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 3 }}>
              {fleetData.map((item, index) => (
                <Box
                  key={item.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    background: alpha(COLORS[index % COLORS.length], 0.1),
                    border: `1px solid ${alpha(COLORS[index % COLORS.length], 0.2)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      background: alpha(COLORS[index % COLORS.length], 0.15),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: COLORS[index % COLORS.length],
                        mr: 2,
                        boxShadow: `0 2px 8px ${alpha(COLORS[index % COLORS.length], 0.3)}`,
                      }}
                    />
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
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
    </div>
  );
};
