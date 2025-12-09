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
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
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
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
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

  const handleNextStep = async () => {
    const isStepValid = await trigger(['firstName', 'lastName', 'email', 'password']);
    if (isStepValid) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[80px] animate-float-delayed" />
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

      <div className="min-h-screen flex items-center justify-center py-8 md:py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left side - Benefits */}
            <div className="hidden lg:block lg:col-span-2 animate-fade-in-up">
              <div className="sticky top-8">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30 animate-float">
                      🚕
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Jez Cabs</h1>
                      <p className="text-white/60 text-sm">Management Platform</p>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                    Start Managing Your Fleet <span className="text-gradient-primary">Smarter</span>
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Join 500+ cab operators who have transformed their business with our platform.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: <Shield className="h-5 w-5" />, title: 'Enterprise Security', desc: 'Bank-level encryption for your data' },
                    { icon: <Zap className="h-5 w-5" />, title: 'Real-time Updates', desc: 'Live tracking and instant notifications' },
                    { icon: <Sparkles className="h-5 w-5" />, title: '14-Day Free Trial', desc: 'No credit card required to start' },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center text-blue-400">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{benefit.title}</h3>
                        <p className="text-white/60 text-sm">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <p className="text-white/80 italic mb-4">
                    "Jez Cabs has completely transformed how we manage our fleet. The analytics alone saved us 30% on operational costs."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      JD
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">John Doe</p>
                      <p className="text-white/50 text-xs">Fleet Manager, City Cabs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-3 animate-fade-in-up stagger-2">
              <Card className="glass-effect-premium shadow-2xl border-0 relative overflow-hidden">
                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" />

                {/* Progress indicator */}
                <div className="absolute top-1.5 left-0 right-0 flex px-8 pt-6">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-green-600'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                        }`}>
                        {step > 1 ? '✓' : '1'}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Personal</span>
                    </div>
                    <div className={`flex-1 h-1 rounded-full ${step > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        2
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Company</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="text-center pb-4 pt-20">
                  <div className="animate-scale-in">
                    <div className={`
                      w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
                      transition-all duration-500 transform hover:scale-105 hover:rotate-3
                      ${success
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/30'
                        : 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-xl shadow-blue-500/30'
                      }
                    `}>
                      {success ? (
                        <CheckCircle className="h-10 w-10 text-white animate-scale-in" />
                      ) : (
                        <UserPlus className="h-10 w-10 text-white" />
                      )}
                    </div>
                  </div>

                  <div className="animate-fade-in-up stagger-1">
                    <CardTitle className={`text-2xl sm:text-3xl font-black mb-2 ${success ? 'text-gradient-secondary' : 'text-gradient-primary'
                      }`}>
                      {success ? 'Welcome Aboard!' : step === 1 ? 'Create Your Account' : 'Company Details'}
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      {success
                        ? 'Your account is ready. Redirecting...'
                        : step === 1
                          ? 'Enter your personal information to get started'
                          : 'Tell us about your company'
                      }
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pb-8">
                  {success ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                        <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto relative" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mt-6 mb-2">
                        Setting up your workspace...
                      </h3>
                      <p className="text-gray-500">
                        We're preparing your dashboard and getting everything ready.
                      </p>
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

                      <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Step 1: Personal Information */}
                        {step === 1 && (
                          <div className="space-y-5 animate-fade-in-up">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                                  First Name
                                </Label>
                                <div className="relative group">
                                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.firstName ? 'text-red-400' : watchedFields.firstName ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                  <Input
                                    id="firstName"
                                    placeholder="John"
                                    className={`pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.firstName
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                      }`}
                                    {...register('firstName')}
                                    autoFocus
                                  />
                                </div>
                                {errors.firstName && (
                                  <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.firstName.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                                  Last Name
                                </Label>
                                <div className="relative group">
                                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.lastName ? 'text-red-400' : watchedFields.lastName ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                  <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    className={`pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.lastName
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                      }`}
                                    {...register('lastName')}
                                  />
                                </div>
                                {errors.lastName && (
                                  <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.lastName.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Email Address
                              </Label>
                              <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.email ? 'text-red-400' : watchedFields.email ? 'text-green-500' : 'text-gray-400'
                                  }`} />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="john@company.com"
                                  className={`pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.email
                                      ? 'border-red-300 focus:border-red-500'
                                      : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                  {...register('email')}
                                  autoComplete="email"
                                />
                              </div>
                              {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-red-500" />
                                  {errors.email.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Password
                              </Label>
                              <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.password ? 'text-red-400' : watchedFields.password ? 'text-green-500' : 'text-gray-400'
                                  }`} />
                                <Input
                                  id="password"
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Create a strong password"
                                  className={`pl-12 pr-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.password
                                      ? 'border-red-300 focus:border-red-500'
                                      : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                  {...register('password')}
                                  autoComplete="new-password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                              </div>
                              {errors.password && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-red-500" />
                                  {errors.password.message}
                                </p>
                              )}
                            </div>

                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="group w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 rounded-xl mt-6"
                            >
                              Continue
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        )}

                        {/* Step 2: Company Information */}
                        {step === 2 && (
                          <div className="space-y-5 animate-fade-in-up">
                            <div className="space-y-2">
                              <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                                Company Name
                              </Label>
                              <div className="relative group">
                                <Building className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.companyName ? 'text-red-400' : watchedFields.companyName ? 'text-green-500' : 'text-gray-400'
                                  }`} />
                                <Input
                                  id="companyName"
                                  placeholder="Your Company Name"
                                  className={`pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.companyName
                                      ? 'border-red-300 focus:border-red-500'
                                      : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                  {...register('companyName')}
                                />
                              </div>
                              {errors.companyName && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-red-500" />
                                  {errors.companyName.message}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="companyEmail" className="text-sm font-semibold text-gray-700">
                                  Company Email
                                </Label>
                                <div className="relative group">
                                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${errors.companyEmail ? 'text-red-400' : watchedFields.companyEmail ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                  <Input
                                    id="companyEmail"
                                    type="email"
                                    placeholder="info@company.com"
                                    className={`pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:bg-white ${errors.companyEmail
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                      }`}
                                    {...register('companyEmail')}
                                  />
                                </div>
                                {errors.companyEmail && (
                                  <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.companyEmail.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="companyPhone" className="text-sm font-semibold text-gray-700">
                                  Phone <span className="text-gray-400 font-normal">(Optional)</span>
                                </Label>
                                <div className="relative group">
                                  <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${watchedFields.companyPhone ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                  <Input
                                    id="companyPhone"
                                    placeholder="+1 (234) 567-890"
                                    className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:border-blue-500 focus:bg-white"
                                    {...register('companyPhone')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="companyAddress" className="text-sm font-semibold text-gray-700">
                                Address <span className="text-gray-400 font-normal">(Optional)</span>
                              </Label>
                              <div className="relative group">
                                <MapPin className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-300 ${watchedFields.companyAddress ? 'text-green-500' : 'text-gray-400'
                                  }`} />
                                <textarea
                                  id="companyAddress"
                                  rows={3}
                                  placeholder="123 Business Street, City, Country"
                                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-300 group-hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                  {...register('companyAddress')}
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="flex-1 h-14 text-lg font-semibold border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                className="flex-[2] group h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:transform-none rounded-xl"
                                disabled={isLoading || !isValid}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                  </>
                                ) : (
                                  <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Sign in link */}
                        <div className="text-center mt-8 pt-6 border-t border-gray-100">
                          <p className="text-gray-600">
                            Already have an account?{' '}
                            <RouterLink
                              to="/login"
                              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
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

              {/* Back to home */}
              <div className="text-center mt-6">
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
        </div>
      </div>
    </div>
  );
};
