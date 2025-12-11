import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    X,
    Mail,
    Lock,
    User,
    Phone,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    Shield,
    Clock,
    Star,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

// ============ SCHEMAS ============
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

const registerSchema = z
    .object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
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

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// ============ TYPES ============
export type AuthModalType = 'login' | 'register' | null;

interface AuthModalProps {
    isOpen: boolean;
    modalType: AuthModalType;
    onClose: () => void;
    onSwitchModal: (type: AuthModalType) => void;
}

// ============ OPTIONS ============
const roleOptions = [
    { value: 'customer', label: 'Customer - Book rides & rentals' },
    { value: 'driver', label: 'Driver - Join our driver network' },
    { value: 'cab_owner', label: 'Cab Owner - List your vehicles' },
    { value: 'trip_planner', label: 'Trip Planner - Plan group trips' },
];

const benefits = [
    { icon: Sparkles, text: 'Book rides instantly with transparent pricing' },
    { icon: Clock, text: 'Rent cabs for hours, days, or weeks' },
    { icon: Shield, text: '24/7 customer support' },
    { icon: Star, text: 'Verified drivers and vehicles' },
];

// ============ OVERLAY BACKGROUND ============
const Backdrop = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        {/* Blurred backdrop */}
        <div
            className="absolute inset-0"
            style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
        />
        {children}
    </motion.div>
);

// ============ LOGIN MODAL ============
function LoginModal({ onClose, onSwitchModal }: { onClose: () => void; onSwitchModal: (type: AuthModalType) => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            await login(data);
            onClose();
        } catch (err: unknown) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Invalid email or password. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <motion.div
            className="relative w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Main Card */}
            <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Decorative top gradient bar */}
                <div
                    className="h-1.5"
                    style={{
                        background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 50%, #2563eb 100%)',
                    }}
                />

                <div className="p-8">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-100"
                        style={{ color: '#64748b' }}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                }}
                            >
                                <Logo size="md" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>
                            Welcome Back
                        </h2>
                        <p style={{ color: '#64748b' }}>
                            Sign in to continue to Jez Cabs
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
                            >
                                <p className="text-sm text-red-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            prefix={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                prefix={<Lock className="w-4 h-4" />}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                                error={errors.password?.message}
                                {...register('password')}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span style={{ color: '#64748b' }}>Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="font-medium hover:underline"
                                style={{ color: '#2563eb' }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={isLoading}
                            className="shadow-lg hover:shadow-xl transition-shadow"
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: '#e2e8f0' }} />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white" style={{ color: '#94a3b8' }}>Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all hover:bg-gray-50 hover:border-gray-300"
                            style={{ borderColor: '#e2e8f0' }}
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
                            <span className="font-medium" style={{ color: '#374151' }}>Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all hover:bg-gray-50 hover:border-gray-300"
                            style={{ borderColor: '#e2e8f0' }}
                        >
                            <svg className="w-5 h-5" fill="#24292e" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                            </svg>
                            <span className="font-medium" style={{ color: '#374151' }}>GitHub</span>
                        </button>
                    </div>

                    {/* Switch to Register */}
                    <p className="mt-8 text-center text-sm" style={{ color: '#64748b' }}>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => onSwitchModal('register')}
                            className="font-semibold hover:underline"
                            style={{ color: '#2563eb' }}
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ============ REGISTER MODAL ============
function RegisterModal({ onClose, onSwitchModal }: { onClose: () => void; onSwitchModal: (type: AuthModalType) => void }) {
    const [error, setError] = useState<string | null>(null);
    const { register: registerUser, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'customer',
        },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                role: data.role as UserRole,
            });
            onClose();
        } catch (err: unknown) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <motion.div
            className="relative w-full max-w-5xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Main Card */}
            <div
                className="relative rounded-3xl overflow-hidden flex"
                style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Left Side - Benefits (Hidden on mobile) */}
                <div
                    className="hidden lg:flex flex-col justify-center p-10 w-[400px]"
                    style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0d9488 100%)',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">
                            Why Choose Jez Cabs?
                        </h3>

                        <div className="space-y-5">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                                    >
                                        <benefit.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white/90">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mt-10 p-5 rounded-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <p className="text-white/90 italic text-sm mb-4">
                                "Jez Cabs has made my daily commute so much easier. The drivers are
                                professional and the app is super easy to use!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                                >
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Rahul Sharma</p>
                                    <p className="text-white/60 text-xs">Verified Customer</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 max-h-[90vh] overflow-y-auto">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-100 z-10"
                        style={{ color: '#64748b' }}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                                }}
                            >
                                <Logo size="sm" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>
                                    Create your account
                                </h2>
                                <p className="text-sm" style={{ color: '#64748b' }}>
                                    Join thousands of users on Jez Cabs
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
                            >
                                <p className="text-sm text-red-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                placeholder="John"
                                prefix={<User className="w-4 h-4" />}
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            prefix={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="9876543210"
                            prefix={<Phone className="w-4 h-4" />}
                            error={errors.phone?.message}
                            {...register('phone')}
                        />

                        <Select
                            label="I want to"
                            options={roleOptions}
                            value={selectedRole}
                            onValueChange={(value) => setValue('role', value as RegisterFormData['role'])}
                            error={errors.role?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                prefix={<Lock className="w-4 h-4" />}
                                hint="Min 8 chars, upper, lower, number"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                prefix={<Lock className="w-4 h-4" />}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />
                        </div>

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="text-sm" style={{ color: '#64748b' }}>
                                I agree to the{' '}
                                <button type="button" className="hover:underline" style={{ color: '#2563eb' }}>
                                    Terms of Service
                                </button>{' '}
                                and{' '}
                                <button type="button" className="hover:underline" style={{ color: '#2563eb' }}>
                                    Privacy Policy
                                </button>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={isLoading}
                            className="shadow-lg hover:shadow-xl transition-shadow mt-2"
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Switch to Login */}
                    <p className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => onSwitchModal('login')}
                            className="font-semibold hover:underline"
                            style={{ color: '#2563eb' }}
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ============ MAIN AUTH MODAL ============
export function AuthModal({ isOpen, modalType, onClose, onSwitchModal }: AuthModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && modalType && (
                <Backdrop onClose={onClose}>
                    {modalType === 'login' ? (
                        <LoginModal onClose={onClose} onSwitchModal={onSwitchModal} />
                    ) : (
                        <RegisterModal onClose={onClose} onSwitchModal={onSwitchModal} />
                    )}
                </Backdrop>
            )}
        </AnimatePresence>
    );
}

export default AuthModal;
