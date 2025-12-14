import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  registerSchema,
  RegisterFormData,
  AuthModalType,
  roleOptions,
  getPasswordStrength,
  SocialLoginButtons,
} from './AuthModal';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  onSwitchModal: (type: AuthModalType) => void;
  error?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
} as const;

export const RegisterForm = ({
  onSubmit,
  isLoading,
  onSwitchModal,
  error,
}: RegisterFormProps) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' },
  });

  const selectedRole = watch('role');
  const password = watch('password');
  const passwordStrength = getPasswordStrength(password);

  // Handle next step with validation
  const handleNextStep = async () => {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
    if (isValid) {
      setStep(2);
    }
  };

  // Handle back step
  const handleBackStep = () => {
    setStep(1);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <motion.div
        className="mb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
          Create an Account
        </h2>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
              }`}
          >
            {step > 1 ? <Check className="w-3 h-3" /> : '1'}
          </div>
          <span
            className={`text-xs font-medium hidden sm:block ${step >= 1 ? 'text-blue-600' : 'text-gray-400'
              }`}
          >
            Personal Info
          </span>
        </div>

        <div
          className={`w-8 h-0.5 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`}
        />

        <div className="flex items-center gap-1.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 2
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
              }`}
          >
            2
          </div>
          <span
            className={`text-xs font-medium hidden sm:block ${step >= 2 ? 'text-blue-600' : 'text-gray-400'
              }`}
          >
            Account Setup
          </span>
        </div>
      </motion.div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className="space-y-5"
                variants={containerVariants}
              >
                {/* First Name & Last Name */}
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={itemVariants}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      {...register('firstName')}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.firstName ? 'border-red-300' : 'border-gray-200'
                        } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all`}
                      autoFocus
                    />
                    {errors.firstName && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      {...register('lastName')}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.lastName ? 'border-red-300' : 'border-gray-200'
                        } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
                    />
                    {errors.lastName && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Email Address */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register('email')}
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'
                      } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                {/* Phone Number */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    {...register('phone')}
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.phone ? 'border-red-300' : 'border-gray-200'
                      } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </motion.div>

                {/* Continue Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="button"
                    fullWidth
                    size="lg"
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Continue
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className="space-y-5"
                variants={containerVariants}
              >
                {/* Role Selection */}
                <motion.div variants={itemVariants}>
                  <Select
                    label="I want to"
                    options={roleOptions}
                    value={selectedRole}
                    onValueChange={(value) => setValue('role', value as any)}
                    error={errors.role?.message}
                  />
                </motion.div>

                {/* Password */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...register('password')}
                      className={`w-full px-4 py-2.5 pr-12 bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'
                        } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  {/* Password Strength Indicator */}
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">
                            Password strength
                          </span>
                          <span
                            className={`font-bold ${passwordStrength.label === 'Weak'
                              ? 'text-red-500'
                              : passwordStrength.label === 'Medium'
                                ? 'text-yellow-500'
                                : 'text-green-500'
                              }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${passwordStrength.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      {...register('confirmPassword')}
                      className={`w-full px-4 py-2.5 pr-12 bg-gray-50 border ${errors.confirmPassword
                        ? 'border-red-300'
                        : 'border-gray-200'
                        } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>

                {/* Terms Checkbox - Moved to Account Setup step */}
                <motion.div
                  className="flex items-center gap-2"
                  variants={itemVariants}
                >
                  <input
                    type="checkbox"
                    id="register-terms"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <label
                    htmlFor="register-terms"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 font-semibold underline">
                      Terms & Condition
                    </a>
                  </label>
                </motion.div>

                {/* Action Buttons */}
                <motion.div className="flex gap-3 pt-2" variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBackStep}
                    className="flex-1 border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:bg-blue-50 py-4 rounded-full font-semibold"
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={isLoading}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Account
                  </Button>
                </motion.div>

                {/* Error Message Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>



      {/* Switch to Login */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <p className="text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => onSwitchModal('login')}
            className="text-blue-600 font-semibold hover:underline underline-offset-2"
          >
            Log in
          </button>
        </p>
      </motion.div>

      {/* Social Login */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <SocialLoginButtons />
      </motion.div>
    </div>
  );
};
