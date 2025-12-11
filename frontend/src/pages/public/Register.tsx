import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../lib/constants';
import type { UserRole } from '../../types';

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

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
    { value: 'customer', label: 'Customer - Book rides & rentals' },
    { value: 'driver', label: 'Driver - Join our driver network' },
    { value: 'cab_owner', label: 'Cab Owner - List your vehicles' },
    { value: 'trip_planner', label: 'Trip Planner - Plan group trips' },
];

const benefits = [
    'Book rides instantly with transparent pricing',
    'Rent cabs for hours, days, or weeks',
    '24/7 customer support',
    'Verified drivers and vehicles',
    'Safe & secure payments',
];

export function Register() {
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
        } catch (err: unknown) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md py-8"
                >
                    {/* Logo */}
                    <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-8">
                        <Logo size="md" />
                        <span className="text-xl font-bold text-gray-900">
                            Jez Cabs
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Join thousands of users on Jez Cabs
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            prefix={<Lock className="w-4 h-4" />}
                            hint="Min 8 characters with uppercase, lowercase, and number"
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

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary-600 hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={isLoading}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 to-accent-600 p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white max-w-md"
                >
                    <h2 className="text-3xl font-bold mb-6">Why Choose Jez Cabs?</h2>

                    <ul className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <motion.li
                                key={benefit}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span>{benefit}</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold">Rahul Sharma</p>
                                <p className="text-sm text-white/70">Verified Customer</p>
                            </div>
                        </div>
                        <p className="text-white/90 italic">
                            "Jez Cabs has made my daily commute so much easier. The drivers are
                            professional and the app is super easy to use!"
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
