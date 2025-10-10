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
  InputAdornment,
  IconButton,
  Fade,
  Grow,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, CheckCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await login(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
            top: '20%',
            right: '15%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            filter: 'blur(30px)',
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
                    {success ? <CheckCircle sx={{ fontSize: '3rem', color: 'success.main' }} /> : '🚕'}
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
                    {success ? 'Welcome Back!' : 'Jez Cabs Management'}
                  </Typography>
                </Fade>

                <Fade in timeout={1600}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {success ? 'Login successful! Redirecting...' : 'Sign in to your account'}
                  </Typography>
                </Fade>
              </Box>

              {success ? (
                <Fade in timeout={1800}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={60} sx={{ color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      Redirecting to dashboard...
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
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        autoComplete="email"
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
                              <Email sx={{ color: errors.email ? 'error.main' : emailValue ? 'success.main' : 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        autoComplete="current-password"
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
                              <Lock sx={{ color: errors.password ? 'error.main' : passwordValue ? 'success.main' : 'text.secondary' }} />
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
                    </Box>

                    <Grow in timeout={2000}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading || !isValid}
                        sx={{
                          py: 1.8,
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
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Grow>

                    <Fade in timeout={2200}>
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Don't have an account?{' '}
                          <Link
                            component={RouterLink}
                            to="/register"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Register here
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
