import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  loginSchema,
  LoginFormData,
  AuthModalType,
  SocialLoginButtons,
} from './AuthModal';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  onSwitchModal: (type: AuthModalType) => void;
  error?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
} as const;

export const LoginForm = ({
  onSubmit,
  isLoading,
  onSwitchModal,
  error,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Determine which field the error belongs to
  const getFieldError = (field: 'email' | 'password') => {
    if (!error) return null;

    const errorLower = error.toLowerCase();

    if (field === 'email') {
      // Show error below email if it mentions email
      if (errorLower.includes('email')) {
        return error;
      }
    } else if (field === 'password') {
      // Show error below password if it mentions password
      if (errorLower.includes('password')) {
        return error;
      }
    }

    return null;
  };

  // Check if error should be shown as general error (not field-specific)
  const generalError = error && !getFieldError('email') && !getFieldError('password') ? error : null;

  const emailError = getFieldError('email') || errors.email?.message;
  const passwordError = getFieldError('password') || errors.password?.message;

  return (
    <motion.div
      className="w-full max-w-[420px] mx-auto flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
          Welcome Back
        </h2>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              {...register('email')}
              className={`w-full px-4 py-3.5 bg-gray-50 border ${emailError ? 'border-red-300' : 'border-gray-200'
                } rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 transition-all`}
              autoFocus
            />
          </div>
          {emailError && (
            <p className="mt-1.5 text-sm text-red-500">{emailError}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className={`w-full px-4 py-3.5 pr-12 bg-gray-50 border ${passwordError ? 'border-red-300' : 'border-gray-200'
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
          {passwordError && (
            <p className="mt-1.5 text-sm text-red-500">
              {passwordError}
            </p>
          )}
        </motion.div>

        <motion.div
          className="flex items-center justify-end text-sm"
          variants={itemVariants}
        >
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In
          </Button>
        </motion.div>

        {/* General Error Message Display (for non-field-specific errors) */}
        <AnimatePresence>
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm font-medium">{generalError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terms Checkbox */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            I agree to the{' '}
            <a href="#" className="text-blue-600 font-semibold underline">
              Terms & Condition
            </a>
          </label>
        </motion.div>

        {/* Switch to Register */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => onSwitchModal('register')}
              className="text-blue-600 font-semibold hover:underline underline-offset-2"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </form>

      {/* Social Login */}
      <motion.div variants={itemVariants} className="mt-8">
        <SocialLoginButtons />
      </motion.div>
    </motion.div>
  );
};
