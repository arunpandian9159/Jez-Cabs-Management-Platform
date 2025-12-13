import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  X,
  Sparkles,
  Shield,
  Clock,
  AlertCircle,
  Zap,
  Heart,
  Github,
} from 'lucide-react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import { useAuth } from '@/features/auth';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// ============ SCHEMAS ============
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name must be at least 1 character'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'driver', 'cab_owner', 'trip_planner']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AuthModalType = 'login' | 'register' | null;

// ============ CONSTANTS ============
export const roleOptions = [
  { value: 'customer', label: '🚗 Customer - Book rides & rentals' },
  { value: 'driver', label: '🚕 Driver - Join our driver network' },
  { value: 'cab_owner', label: '🚙 Cab Owner - List your vehicles' },
  { value: 'trip_planner', label: '🗺️ Trip Planner - Plan group trips' },
];

const benefits = [
  {
    icon: Zap,
    text: 'Book rides instantly with transparent pricing',
    color: 'text-yellow-400',
  },
  {
    icon: Clock,
    text: 'Rent cabs for hours, days, or weeks',
    color: 'text-teal-400',
  },
  { icon: Shield, text: '24/7 customer support', color: 'text-green-400' },
  { icon: Heart, text: 'Verified drivers and vehicles', color: 'text-red-400' },
];

// ============ PASSWORD STRENGTH CHECKER ============
export const getPasswordStrength = (
  password: string
): { strength: number; label: string; color: string } => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

  if (strength < 40) return { strength, label: 'Weak', color: 'bg-red-500' };
  if (strength < 70)
    return { strength, label: 'Medium', color: 'bg-yellow-500' };
  return { strength, label: 'Strong', color: 'bg-green-500' };
};

// ============ TYPES ============
interface AuthModalProps {
  isOpen: boolean;
  modalType: AuthModalType;
  onClose: () => void;
  onSwitchModal: (type: AuthModalType) => void;
}

// ============ BACKDROP COMPONENT ============
const Backdrop = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900/90 via-teal-900/80 to-slate-900/90 backdrop-blur-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    {/* Animated background particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-teal-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
    {children}
  </motion.div>
);

// ============ SOCIAL LOGIN BUTTONS ============
export const SocialLoginButtons = () => (
  <div className="space-y-3">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500 font-medium">
          Or continue with
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all group"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">Google</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all group"
      >
        <Github className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">GitHub</span>
      </motion.button>
    </div>
  </div>
);

// ============ MAIN COMPONENT ============
export function AuthModal({
  isOpen,
  modalType,
  onClose,
  onSwitchModal,
}: AuthModalProps) {
  const { login, register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isRegister = modalType === 'register';

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      // Don't call onClose() - navigation will handle modal state
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setError(null);
    try {
      // Remove confirmPassword as it's not part of the backend DTO
      // and causes 400 Bad Request due to forbidNonWhitelisted: true
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData as any);
      // Don't call onClose() - navigation will handle modal state
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop onClose={onClose}>
          <motion.div
            className="relative w-full max-w-6xl h-[650px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex border border-white/20"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2.5 rounded-xl bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Error Toast (only for registration - login errors show inline) */}
            <AnimatePresence>
              {error && isRegister && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-6 py-3 rounded-xl shadow-lg border-2 border-red-200 text-sm font-medium flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Panel (Gradient Side with Blue/Teal Theme) */}
            <motion.div
              className="absolute top-0 bottom-0 w-[42%] bg-gradient-to-br from-blue-600 via-teal-500 to-teal-600 text-white z-20 flex flex-col justify-center p-12 overflow-hidden"
              initial={false}
              animate={{
                left: isRegister ? '0%' : '58%',
                borderTopRightRadius: isRegister ? '0px' : '24px',
                borderBottomRightRadius: isRegister ? '0px' : '24px',
                borderTopLeftRadius: isRegister ? '24px' : '0px',
                borderBottomLeftRadius: isRegister ? '24px' : '0px',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                {isRegister ? (
                  <motion.div
                    key="register-info"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10"
                  >
                    <motion.div
                      className="mb-8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 shadow-xl">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold mb-4 leading-tight">
                        Start Your Journey
                      </h2>
                      <p className="text-teal-100 leading-relaxed text-lg">
                        Join thousands of satisfied users who trust Jez Cabs for
                        their daily commute and travel needs.
                      </p>
                    </motion.div>
                    <div className="space-y-5">
                      {benefits.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <span className="text-sm font-medium text-teal-50">
                            {item.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-info"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex flex-col items-center justify-center h-full px-8"
                  >
                    {/* Welcome Text */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <motion.h3
                        className="text-3xl font-bold text-white mb-3 leading-tight"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.4,
                          type: 'spring',
                          stiffness: 200,
                        }}
                      >
                        Welcome to Jez Cabs
                      </motion.h3>
                      <motion.p
                        className="text-teal-100 text-base leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Your journey starts here
                      </motion.p>
                    </motion.div>

                    {/* Lottie Animation */}
                    <motion.div
                      className="w-full flex items-center justify-center my-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      <DotLottiePlayer
                        src="/Login.lottie"
                        autoplay
                        loop
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </motion.div>

                    {/* Feature Highlights */}
                    <motion.div
                      className="space-y-3 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      {[
                        {
                          icon: Zap,
                          text: 'Instant booking & real-time tracking',
                        },
                        {
                          icon: Shield,
                          text: 'Safe & secure rides guaranteed',
                        },
                        { icon: Clock, text: '24/7 customer support' },
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-teal-50">
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Form Panel (White Side) */}
            <motion.div
              className="absolute top-0 bottom-0 w-[58%] bg-gradient-to-br from-white to-gray-50/50 z-10 flex flex-col justify-center p-12"
              initial={false}
              animate={{
                left: isRegister ? '42%' : '0%',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                {isRegister ? (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <RegisterForm
                      onSubmit={handleRegister}
                      isLoading={isLoading}
                      onSwitchModal={onSwitchModal}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex items-center"
                  >
                    <LoginForm
                      onSubmit={handleLogin}
                      isLoading={isLoading}
                      onSwitchModal={onSwitchModal}
                      error={error}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
