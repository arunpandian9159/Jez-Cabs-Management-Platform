import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl animate-bounce-soft"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"></div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center relative z-10 animate-fade-in">
        <div className="w-full max-w-md mx-auto p-6 relative z-10">
          <div className="animate-fade-in-up">
            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border border-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-teal-600"></div>
              <CardHeader className="text-center pb-8">
                <div className="animate-scale-in">
                  <div className={`
                    w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl
                    transition-all duration-500 transform hover:scale-105
                    ${success
                      ? 'bg-green-50 border-4 border-green-500 shadow-xl shadow-green-500/30'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white/30 shadow-xl shadow-blue-500/30'
                    }
                  `}>
                    {success ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <span className="text-white">🚕</span>
                    )}
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <CardTitle className={`text-3xl sm:text-4xl font-bold mb-2 text-center ${
                    success ? 'bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent'
                  }`}>
                    {success ? 'Welcome Back!' : 'Jez Cabs Management'}
                  </CardTitle>
                  <p className="text-gray-600 text-center text-lg">
                    {success ? 'Login successful! Redirecting...' : 'Sign in to your account to continue'}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                {success ? (
                  <div className="text-center py-8 animate-fade-in">
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-600">
                      Redirecting to dashboard...
                    </h3>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                              errors.email ? 'text-red-500' : emailValue ? 'text-green-500' : 'text-gray-400'
                            }`} />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                              }`}
                              {...register('email')}
                              autoComplete="email"
                              autoFocus
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                          )}
                        </div>
                    </div>

                      <div className="animate-fade-in-up space-y-2" style={{ animationDelay: '0.5s' }}>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                            errors.password ? 'text-red-500' : passwordValue ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className={`pl-10 pr-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                              errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                            {...register('password')}
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                        )}
                      </div>

                      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <Button
                          type="submit"
                          className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                          disabled={isLoading || !isValid}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </div>

                      <div className="animate-fade-in-up text-center mt-6" style={{ animationDelay: '0.7s' }}>
                        <p className="text-gray-600">
                          Don't have an account?{' '}
                          <RouterLink
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                          >
                            Register here
                          </RouterLink>
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
