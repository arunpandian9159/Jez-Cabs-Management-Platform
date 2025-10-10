import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Fade,
  Grow,
  useTheme,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';
import StarIcon from '@mui/icons-material/Star';

const features = [
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Fleet Management',
    description: 'Comprehensive cab fleet tracking and management system with real-time GPS monitoring, maintenance scheduling, and utilization analytics.',
    delay: 0,
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Driver Management',
    description: 'Complete driver profiles, scheduling, performance tracking, and automated shift management for optimal fleet operations.',
    delay: 100,
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Analytics & Reports',
    description: 'Detailed insights and reporting for business intelligence with customizable dashboards and automated report generation.',
    delay: 200,
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with reliable data management, encrypted communications, and comprehensive backup systems.',
    delay: 300,
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Real-time Updates',
    description: 'Live tracking and instant notifications for all operations with push notifications and real-time status updates.',
    delay: 400,
  },
  {
    icon: <SupportIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and maintenance with dedicated account managers and priority response times.',
    delay: 500,
  },
];

export const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Fade in timeout={1000}>
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: { xs: 10, md: 16 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              filter: 'blur(40px)',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Grow in timeout={1200}>
                <Box
                  sx={{
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    mb: 4,
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  🚕
                </Box>
              </Grow>

              <Fade in timeout={1400}>
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' },
                    mb: 3,
                    lineHeight: 1.1,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Jez Cabs Management Platform
                </Typography>
              </Fade>

              <Fade in timeout={1600}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 5,
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    maxWidth: 900,
                    mx: 'auto',
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  Streamline your cab business operations with our comprehensive management platform.
                  Manage fleets, drivers, bookings, and analytics all in one place.
                </Typography>
              </Fade>

              <Grow in timeout={1800}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  justifyContent="center"
                  sx={{ mb: 6 }}
                >
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      bgcolor: 'white',
                      color: 'primary.main',
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        bgcolor: 'grey.50',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      color: 'white',
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign Up Free
                  </Button>
                </Stack>
              </Grow>

              <Fade in timeout={2000}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  flexWrap="wrap"
                  sx={{ mb: 4 }}
                >
                  {[
                    { label: 'Fleet Management', icon: '🚗' },
                    { label: 'Driver Tracking', icon: '👨‍🚗' },
                    { label: 'Booking System', icon: '📅' },
                    { label: 'Analytics', icon: '📊' },
                  ].map((chip) => (
                    <Chip
                      key={chip.label}
                      label={`${chip.icon} ${chip.label}`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        fontWeight: 500,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Fade>

              <Fade in timeout={2200}>
                <Box sx={{ mt: 6 }}>
                  <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
                    Trusted by 500+ cab operators worldwide
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#ffd700', fontSize: 24 }} />
                    ))}
                    <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                      4.9/5 rating
                    </Typography>
                  </Stack>
                </Box>
              </Fade>
            </Box>
          </Container>
        </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Powerful Features for Modern Cab Management
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Everything you need to run a successful cab business efficiently and effectively
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Grow in timeout={800 + feature.delay}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                    role="article"
                    aria-labelledby={`feature-${index}-title`}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          mb: 3,
                          transition: 'all 0.3s ease',
                          p: 2,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: theme.palette.text.primary,
                        }}
                        id={`feature-${index}-title`}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Ready to Transform Your Cab Business?
            </Typography>
          </Fade>

          <Fade in timeout={1200}>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.5,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Join thousands of cab operators who trust Jez Cabs Management Platform to streamline their operations and boost profitability.
            </Typography>
          </Fade>

          <Grow in timeout={1400}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  bgcolor: 'white',
                  color: 'primary.main',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    bgcolor: 'grey.50',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Free Trial
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Grow>

          <Fade in timeout={1600}>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
              No credit card required • 14-day free trial • Cancel anytime
            </Typography>
          </Fade>
        </Container>
      </Box>
      </Box>
    </Fade>
  );
};
