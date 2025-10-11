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
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary-400/10 rounded-full blur-2xl animate-bounce-soft"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"></div>
        </div>
      </div>

      <Fade in timeout={800}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
            <div className="animate-fade-in-up">
              <Paper
                elevation={0}
                className="glass-effect"
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: 6,
                  backdropFilter: 'blur(20px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '24px 24px 0 0',
                  },
                }}
              >
                <div className="text-center mb-8">
                  <div className="animate-scale-in">
                    <div className={`
                      w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl
                      transition-all duration-500 transform hover:scale-105
                      ${success
                        ? 'bg-success-50 border-4 border-success-500 shadow-xl shadow-success-500/30'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 border-4 border-white/30 shadow-xl shadow-primary-500/30'
                      }
                    `}>
                      {success ? (
                        <CheckCircle sx={{ fontSize: '3rem', color: 'success.main' }} />
                      ) : (
                        <span className="text-white">🚕</span>
                      )}
                    </div>
                  </div>

                  <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Typography
                      variant="h3"
                      component="h1"
                      className={`font-bold mb-2 text-center ${
                        success ? 'text-gradient-secondary' : 'text-gradient-primary'
                      }`}
                      sx={{
                        fontSize: { xs: '1.875rem', sm: '2.25rem' },
                        fontWeight: 800,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      {success ? 'Welcome Back!' : 'Jez Cabs Management'}
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-600 text-center mb-2"
                      sx={{ fontSize: '1.1rem', fontWeight: 400 }}
                    >
                      {success ? 'Login successful! Redirecting...' : 'Sign in to your account to continue'}
                    </Typography>
                  </div>
                </div>

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

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        autoComplete="email"
                        autoFocus
                        className="input-modern"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                              transform: 'translateY(-1px)',
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                              transform: 'translateY(-2px)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 500,
                          },
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{
                                  color: errors.email ? 'error.main' : emailValue ? 'success.main' : 'text.secondary',
                                  transition: 'color 0.2s ease'
                                }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
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
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                              transform: 'translateY(-1px)',
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                              transform: 'translateY(-2px)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 500,
                          },
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{
                                  color: errors.password ? 'error.main' : passwordValue ? 'success.main' : 'text.secondary',
                                  transition: 'color 0.2s ease'
                                }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{
                                    color: 'text.secondary',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      color: 'primary.main',
                                      transform: 'scale(1.1)',
                                    }
                                  }}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading || !isValid}
                        className="btn-primary-modern"
                        sx={{
                          py: 2.5,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 4,
                          textTransform: 'none',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
                            boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.45)}`,
                            transform: 'translateY(-3px)',
                          },
                          '&:disabled': {
                            opacity: 0.7,
                            transform: 'none',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                      <div className="text-center mt-6">
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                          Don't have an account?{' '}
                          <Link
                            component={RouterLink}
                            to="/register"
                            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                            sx={{
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Register here
                          </Link>
                        </Typography>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </Paper>
            </div>
          </Container>
        </Box>
      </Fade>
    </div>
  );
};
