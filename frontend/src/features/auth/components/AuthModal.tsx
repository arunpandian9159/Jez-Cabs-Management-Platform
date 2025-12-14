import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { X, ArrowLeft } from 'lucide-react';
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

// ============ SOCIAL LOGIN BUTTONS ============
export const SocialLoginButtons = () => (
  <div className="space-y-4">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-400 font-medium">or</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
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
        <span className="text-sm font-medium text-gray-600">
          Google
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-sm font-medium text-gray-600">
          Facebook
        </span>
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

  // Clear error when modal type changes or modal closes
  useEffect(() => {
    setError(null);
  }, [modalType, isOpen]);

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isRegister = modalType === 'register';

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      onClose(); // Close modal after successful login
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setError(null);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData as any);
      onClose(); // Close modal after successful registration
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-slate-800/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full h-full md:w-full md:max-w-[1000px] md:h-[680px] bg-white md:rounded-[50px] shadow-2xl overflow-hidden flex"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Desktop */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all md:hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Desktop Layout - Side by Side with Sliding */}
            {!isMobile && (
              <>
                {/* Image Panel - Slides between left and right */}
                <motion.div
                  className="absolute top-2 bottom-2 w-[45%] overflow-hidden rounded-3xl z-10"
                  initial={false}
                  animate={{
                    left: isRegister ? '8px' : 'auto',
                    right: isRegister ? 'auto' : '8px',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    left: isRegister ? '8px' : 'auto',
                    right: isRegister ? 'auto' : '8px',
                  }}
                >
                  <div className="relative w-full h-full rounded-[50px] overflow-hidden">
                    {/* Background Image */}
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={isRegister ? 'register-img' : 'login-img'}
                        src={
                          isRegister
                            ? '/Pink Urban Hustle.png'
                            : '/Night City Taxi Scene.png'
                        }
                        alt="Auth background"
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/70" />

                    {/* Back Button for Register - positioned on image */}
                    {isRegister && (
                      <motion.button
                        className="absolute top-6 left-6 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors z-20"
                        onClick={onClose}
                        whileHover={{ x: -2 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </motion.button>
                    )}

                    {/* Cancel Button for Login - positioned on image */}
                    {!isRegister && (
                      <motion.button
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors z-20"
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <X className="w-5 h-5 text-white" />
                      </motion.button>
                    )}

                    {/* Logo */}
                    <motion.div
                      className="absolute top-8 left-8"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                    </motion.div>
                  </div>
                </motion.div>

                {/* Form Panel - Slides between left and right */}
                <motion.div
                  className="absolute top-0 bottom-0 w-[55%] bg-white flex flex-col justify-center p-6 lg:p-10"
                  initial={false}
                  animate={{
                    left: isRegister ? '45%' : '0%',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Close Button - only show for register since login has cancel on image */}
                  {isRegister && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-all"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  )}

                  {/* Form Content */}
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
                          error={error}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login-form"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex items-center justify-center"
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
              </>
            )}

            {/* Mobile Layout - Full Screen Form with Background */}
            {isMobile && (
              <div className="w-full h-full bg-white flex flex-col">
                {/* Mobile Header with Background Image */}
                <div className="relative h-40 shrink-0">
                  <img
                    src={
                      isRegister
                        ? '/Pink Urban Hustle.png'
                        : '/Night City Taxi Scene.png'
                    }
                    alt="Auth background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/80" />
                  <div className="absolute top-4 left-4">
                  </div>
                </div>

                {/* Mobile Form */}
                <div className="flex-1 p-6 pt-8 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {isRegister ? (
                      <motion.div
                        key="register-form-mobile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <RegisterForm
                          onSubmit={handleRegister}
                          isLoading={isLoading}
                          onSwitchModal={onSwitchModal}
                          error={error}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login-form-mobile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
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
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
