import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  MapPin,
  CheckCircle,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl animate-bounce-soft"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"></div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center py-4 md:py-8 relative z-10 animate-fade-in">
        <div className="w-full max-w-4xl mx-auto p-6 relative z-10">
          <div className="animate-scale-in">
            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>

              {/* Header */}
              <CardHeader className="text-center pb-6">
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
                      <UserPlus className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <CardTitle className={`text-3xl sm:text-4xl font-bold mb-2 text-center ${
                    success ? 'bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent'
                  }`}>
                    {success ? 'Account Created!' : 'Create Your Account'}
                  </CardTitle>
                  <p className="text-gray-600 text-center text-lg font-medium">
                    {success ? 'Welcome to Jez Cabs! Redirecting...' : 'Start managing your cab rental business today'}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-12 animate-fade-in">
                    <Loader2 className="h-16 w-16 text-green-600 animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                      Setting up your account...
                    </h3>
                    <p className="text-gray-600">
                      We're preparing your dashboard and getting everything ready for you.
                    </p>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
                      {/* Personal Information Section */}
                      <div>
                        <div className="flex items-center mb-6">
                          <User className="mr-3 text-blue-600 h-6 w-6" />
                          <h3 className="text-lg font-bold text-gray-900">
                            Personal Information
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                              First Name
                            </Label>
                            <div className="relative">
                              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                errors.firstName ? 'text-red-500' : watchedFields.firstName ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <Input
                                id="firstName"
                                placeholder="Enter your first name"
                                className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                  errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('firstName')}
                                autoFocus
                              />
                            </div>
                            {errors.firstName && (
                              <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                              Last Name
                            </Label>
                            <div className="relative">
                              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                errors.lastName ? 'text-red-500' : watchedFields.lastName ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <Input
                                id="lastName"
                                placeholder="Enter your last name"
                                className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                  errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('lastName')}
                              />
                            </div>
                            {errors.lastName && (
                              <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                errors.email ? 'text-red-500' : watchedFields.email ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('email')}
                                autoComplete="email"
                              />
                            </div>
                            {errors.email && (
                              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                              Password
                            </Label>
                            <div className="relative">
                              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                errors.password ? 'text-red-500' : watchedFields.password ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className={`pl-10 pr-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('password')}
                                autoComplete="new-password"
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
                        </div>
                      </div>
                      {/* Company Information Section */}
                      <div>
                        <div className="border-t border-gray-200 my-8"></div>

                        <div className="flex items-center mb-6">
                          <Building className="mr-3 text-blue-600 h-6 w-6" />
                          <h3 className="text-lg font-bold text-gray-900">
                            Company Information
                          </h3>
                          <span className="ml-2 text-sm text-gray-500 italic">
                            (Optional fields marked)
                          </span>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                              Company Name
                            </Label>
                            <div className="relative">
                              <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                errors.companyName ? 'text-red-500' : watchedFields.companyName ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <Input
                                id="companyName"
                                placeholder="Enter your company name"
                                className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                  errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('companyName')}
                              />
                            </div>
                            {errors.companyName && (
                              <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="companyEmail" className="text-sm font-medium text-gray-700">
                                Company Email
                              </Label>
                              <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                  errors.companyEmail ? 'text-red-500' : watchedFields.companyEmail ? 'text-green-500' : 'text-gray-400'
                                }`} />
                                <Input
                                  id="companyEmail"
                                  type="email"
                                  placeholder="Enter company email"
                                  className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                    errors.companyEmail ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                  }`}
                                  {...register('companyEmail')}
                                />
                              </div>
                              {errors.companyEmail && (
                                <p className="text-sm text-red-600 mt-1">{errors.companyEmail.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="companyPhone" className="text-sm font-medium text-gray-700">
                                Company Phone <span className="text-gray-400">(Optional)</span>
                              </Label>
                              <div className="relative">
                                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                  errors.companyPhone ? 'text-red-500' : watchedFields.companyPhone ? 'text-green-500' : 'text-gray-400'
                                }`} />
                                <Input
                                  id="companyPhone"
                                  placeholder="Enter company phone"
                                  className={`pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg ${
                                    errors.companyPhone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                  }`}
                                  {...register('companyPhone')}
                                />
                              </div>
                              {errors.companyPhone && (
                                <p className="text-sm text-red-600 mt-1">{errors.companyPhone.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyAddress" className="text-sm font-medium text-gray-700">
                              Company Address <span className="text-gray-400">(Optional)</span>
                            </Label>
                            <div className="relative">
                              <MapPin className={`absolute left-3 top-3 h-5 w-5 transition-colors ${
                                watchedFields.companyAddress ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <textarea
                                id="companyAddress"
                                rows={3}
                                placeholder="Enter company address"
                                className={`w-full pl-10 pr-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg resize-none ${
                                  errors.companyAddress ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                                {...register('companyAddress')}
                              />
                            </div>
                            {errors.companyAddress && (
                              <p className="text-sm text-red-600 mt-1">{errors.companyAddress.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <Button
                          type="submit"
                          className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                          disabled={isLoading || !isValid}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </div>

                      <div className="animate-fade-in-up text-center mt-6" style={{ animationDelay: '0.9s' }}>
                        <p className="text-gray-600">
                          Already have an account?{' '}
                          <RouterLink
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                          >
                            Sign in here
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
