import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  Fade,
  Grow,
  useTheme,
  alpha,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  Phone,
  LocationOn,
  CheckCircle,
  PersonAdd,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyEmail: z.string().email('Invalid company email address'),
  companyPhone: z.string().optional(),
  companyAddress: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          py: { xs: 2, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            filter: 'blur(35px)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grow in timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Grow in timeout={1200}>
                  <Box
                    sx={{
                      width: { xs: 70, sm: 90 },
                      height: { xs: 70, sm: 90 },
                      borderRadius: 3,
                      bgcolor: success ? alpha(theme.palette.success.main, 0.1) : 'primary.main',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      mb: 3,
                      boxShadow: success
                        ? `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`
                        : `0 12px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      border: `3px solid ${success ? theme.palette.success.main : 'rgba(255, 255, 255, 0.3)'}`,
                    }}
                  >
                    {success ? <CheckCircle sx={{ fontSize: '3rem', color: 'success.main' }} /> : <PersonAdd sx={{ fontSize: '3rem' }} />}
                  </Box>
                </Grow>

                <Fade in timeout={1400}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight={800}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {success ? 'Account Created!' : 'Create Your Account'}
                  </Typography>
                </Fade>

                <Fade in timeout={1600}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {success ? 'Welcome to Jez Cabs! Redirecting...' : 'Start managing your cab rental business today'}
                  </Typography>
                </Fade>
              </Box>

              {success ? (
                <Fade in timeout={2000}>
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress size={80} sx={{ color: 'success.main', mb: 3 }} />
                    <Typography variant="h5" color="success.main" fontWeight={700} gutterBottom>
                      Setting up your account...
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      We're preparing your dashboard and getting everything ready for you.
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <>
                  {error && (
                    <Grow in>
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          fontWeight: 500,
                          '& .MuiAlert-icon': { fontSize: '1.2rem' }
                        }}
                      >
                        {error}
                      </Alert>
                    </Grow>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Personal Information Section */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Person sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          Personal Information
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="First Name"
                            {...register('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            autoFocus
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person sx={{ color: errors.firstName ? 'error.main' : watchedFields.firstName ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            {...register('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person sx={{ color: errors.lastName ? 'error.main' : watchedFields.lastName ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            autoComplete="email"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email sx={{ color: errors.email ? 'error.main' : watchedFields.email ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            autoComplete="new-password"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock sx={{ color: errors.password ? 'error.main' : watchedFields.password ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: 'text.secondary' }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: alpha(theme.palette.divider, 0.3) }} />

                    {/* Company Information Section */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Business sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          Company Information
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                          (Optional fields marked)
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Company Name"
                            {...register('companyName')}
                            error={!!errors.companyName}
                            helperText={errors.companyName?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Business sx={{ color: errors.companyName ? 'error.main' : watchedFields.companyName ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Company Email"
                            type="email"
                            {...register('companyEmail')}
                            error={!!errors.companyEmail}
                            helperText={errors.companyEmail?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email sx={{ color: errors.companyEmail ? 'error.main' : watchedFields.companyEmail ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Company Phone (Optional)"
                            {...register('companyPhone')}
                            error={!!errors.companyPhone}
                            helperText={errors.companyPhone?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone sx={{ color: watchedFields.companyPhone ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Company Address (Optional)"
                            multiline
                            rows={3}
                            {...register('companyAddress')}
                            error={!!errors.companyAddress}
                            helperText={errors.companyAddress?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                  <LocationOn sx={{ color: watchedFields.companyAddress ? 'success.main' : 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Grow in timeout={2400}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading || !isValid}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 3,
                          textTransform: 'none',
                          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover': {
                            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            opacity: 0.7,
                            transform: 'none',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isLoading ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </Grow>

                    <Fade in timeout={2600}>
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Already have an account?{' '}
                          <Link
                            component={RouterLink}
                            to="/login"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Sign in here
                          </Link>
                        </Typography>
                      </Box>
                    </Fade>
                  </form>
                </>
              )}
            </Paper>
          </Grow>
        </Container>
      </Box>
    </Fade>
  );
};
