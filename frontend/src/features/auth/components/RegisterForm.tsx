import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  registerSchema,
  RegisterFormData,
  AuthModalType,
  roleOptions,
  getPasswordStrength,
} from './AuthModal';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  onSwitchModal: (type: AuthModalType) => void;
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

  // Common input styles for white background with dark text
  const inputStyles =
    '!bg-white !text-gray-900 border-2 border-gray-200 focus:border-teal-500 transition-all placeholder:!text-gray-400';

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
    <div className="w-full max-w-lg mx-auto h-full flex flex-col">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Create Account
          </h2>
          <Sparkles className="w-6 h-6 text-teal-500" />
        </motion.div>
        <p className="text-gray-500 text-base">
          Join the Jez Cabs community today
        </p>
      </motion.div>

      {/* Enhanced Progress Indicator */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= 1
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
            animate={{
              scale: step === 1 ? [1, 1.15, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: step === 1 ? Infinity : 0,
              repeatDelay: 2,
            }}
          >
            {step > 1 ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : (
              '1'
            )}
            {step === 1 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 opacity-30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
          <span
            className={`text-sm font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}
          >
            Personal Info
          </span>
        </div>

        <motion.div
          className={`w-16 h-1.5 rounded-full transition-all overflow-hidden ${
            step >= 2
              ? 'bg-gradient-to-r from-blue-600 to-teal-500'
              : 'bg-gray-200'
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {step >= 2 && (
            <motion.div
              className="h-full bg-white/30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>

        <div className="flex items-center gap-2.5">
          <motion.div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= 2
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
            animate={{
              scale: step === 2 ? [1, 1.15, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: step === 2 ? Infinity : 0,
              repeatDelay: 2,
            }}
          >
            2
            {step === 2 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 opacity-30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
          <span
            className={`text-sm font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}
          >
            Account Setup
          </span>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
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
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={itemVariants}
                >
                  <Input
                    label="First Name"
                    placeholder="John"
                    prefix={<User className="w-4 h-4 text-gray-400" />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                    className={inputStyles}
                    autoFocus
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                    className={inputStyles}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    prefix={<Mail className="w-4 h-4 text-gray-400" />}
                    error={errors.email?.message}
                    {...register('email')}
                    className={inputStyles}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="9876543210"
                    prefix={<Phone className="w-4 h-4 text-gray-400" />}
                    error={errors.phone?.message}
                    {...register('phone')}
                    className={inputStyles}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button
                      type="button"
                      fullWidth
                      size="lg"
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                    >
                      <span className="font-semibold">Continue</span>
                    </Button>
                  </motion.div>
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
                <motion.div variants={itemVariants}>
                  <Select
                    label="I want to"
                    options={roleOptions}
                    value={selectedRole}
                    onValueChange={(value) => setValue('role', value as any)}
                    error={errors.role?.message}
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={itemVariants}>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    prefix={<Lock className="w-4 h-4 text-gray-400" />}
                    suffix={
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </motion.button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                    className={inputStyles}
                  />

                  {/* Enhanced Password Strength Indicator */}
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-100"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">
                            Password strength
                          </span>
                          <motion.span
                            className={`font-bold ${
                              passwordStrength.label === 'Weak'
                                ? 'text-red-500'
                                : passwordStrength.label === 'Medium'
                                  ? 'text-yellow-500'
                                  : 'text-green-500'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 15,
                            }}
                          >
                            {passwordStrength.label}
                          </motion.span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                          <motion.div
                            className={`h-full ${passwordStrength.color} relative overflow-hidden`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/30"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    prefix={<Lock className="w-4 h-4 text-gray-400" />}
                    suffix={
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </motion.button>
                    }
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                    className={inputStyles}
                  />
                </motion.div>

                <motion.div className="flex gap-3 pt-2" variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBackStep}
                      className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                      leftIcon={<ArrowLeft className="w-5 h-5" />}
                    >
                      <span className="font-semibold">Back</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[2]"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      loading={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 relative overflow-hidden group"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                    >
                      <span className="relative z-10 font-semibold">
                        Create Account
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={false}
                      />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <motion.div
        className="text-center mt-auto pt-8 border-t border-gray-200 shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <motion.button
            onClick={() => onSwitchModal('login')}
            className="text-teal-600 font-bold hover:text-teal-700 relative inline-block group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
            <motion.span
              className="absolute -bottom-0.5 left-0 h-0.5 bg-teal-600 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%' }}
            />
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
};
