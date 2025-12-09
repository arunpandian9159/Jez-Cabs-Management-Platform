import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[80px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="animate-fade-in-up">
          <Card className="glass-effect-premium shadow-2xl border-0 relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" />

            {/* Decorative corner gradient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-bl-full" />

            <CardHeader className="text-center pb-8 pt-10">
              {/* Logo */}
              <div className="animate-scale-in">
                <div className={`
                  w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl
                  transition-all duration-500 transform hover:scale-105 hover:rotate-3
                  ${success
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/30'
                    : 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-xl shadow-blue-500/30'
                  }
                `}>
                  {success ? (
                    <CheckCircle className="h-12 w-12 text-white animate-scale-in" />
                  ) : (
                    <span className="text-white filter drop-shadow-lg">🚕</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="animate-fade-in-up stagger-1">
                <CardTitle className={`text-3xl sm:text-4xl font-black mb-3 text-center ${success ? 'text-gradient-secondary' : 'text-gradient-primary'
                  }`}>
                  {success ? 'Welcome Back!' : 'Welcome Back'}
                </CardTitle>
                <p className="text-gray-600 text-center text-lg">
                  {success ? 'Login successful! Redirecting...' : 'Sign in to your account to continue'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pb-10">
              {success ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto relative" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mt-6">
                    Redirecting to dashboard...
                  </h3>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    {/* Email field */}
                    <div className="animate-fade-in-up stagger-2 space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${errors.email ? 'text-red-400' : emailValue ? 'text-green-500' : 'text-gray-400'
                          }`}>
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-12 h-14 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.email
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          {...register('email')}
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="animate-fade-in-up stagger-3 space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative group">
                        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${errors.password ? 'text-red-400' : passwordValue ? 'text-green-500' : 'text-gray-400'
                          }`}>
                          <Lock className="h-5 w-5" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className={`pl-12 pr-12 h-14 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.password
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          {...register('password')}
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Submit button */}
                    <div className="animate-fade-in-up stagger-4 pt-2">
                      <Button
                        type="submit"
                        className="group w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:transform-none rounded-xl"
                        disabled={isLoading || !isValid}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Register link */}
                    <div className="animate-fade-in-up stagger-5 text-center pt-4">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <RouterLink
                          to="/register"
                          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                        >
                          Create one now
                        </RouterLink>
                      </p>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Secure & Encrypted</span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      256-bit SSL
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="h-4 w-4 text-teal-500" />
                      GDPR Compliant
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-8 animate-fade-in-up stagger-6">
          <RouterLink
            to="/"
            className="text-white/70 hover:text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </RouterLink>
        </div>
      </div>
    </div>
  );
};
