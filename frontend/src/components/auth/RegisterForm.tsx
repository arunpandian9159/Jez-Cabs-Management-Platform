import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { registerSchema, RegisterFormData, AuthModalType, roleOptions, getPasswordStrength } from './AuthModal';

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isLoading: boolean;
    onSwitchModal: (type: AuthModalType) => void;
}

export const RegisterForm = ({ onSubmit, isLoading, onSwitchModal }: RegisterFormProps) => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'customer' },
    });

    const selectedRole = watch('role');
    const password = watch('password');
    const passwordStrength = getPasswordStrength(password);

    // Common input styles for white background with dark text
    const inputStyles = "!bg-white !text-gray-900 border-2 border-gray-200 focus:border-teal-500 transition-all placeholder:!text-gray-400";

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
                className="text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Create Account
                </h2>
                <p className="text-gray-500 mt-2">Join the Jez Cabs community today</p>
            </motion.div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                        animate={{ scale: step === 1 ? 1.1 : 1 }}
                    >
                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </motion.div>
                    <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                        Personal Info
                    </span>
                </div>

                <div className={`w-12 h-1 rounded-full transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-gray-200'}`} />

                <div className="flex items-center gap-2">
                    <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                        animate={{ scale: step === 2 ? 1.1 : 1 }}
                    >
                        2
                    </motion.div>
                    <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                        Account Setup
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        prefix={<User className="w-4 h-4 text-gray-400" />}
                                        error={errors.firstName?.message}
                                        {...register('firstName')}
                                        className={inputStyles}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        error={errors.lastName?.message}
                                        {...register('lastName')}
                                        className={inputStyles}
                                    />
                                </div>

                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@example.com"
                                    prefix={<Mail className="w-4 h-4 text-gray-400" />}
                                    error={errors.email?.message}
                                    {...register('email')}
                                    className={inputStyles}
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="9876543210"
                                    prefix={<Phone className="w-4 h-4 text-gray-400" />}
                                    error={errors.phone?.message}
                                    {...register('phone')}
                                    className={inputStyles}
                                />

                                <Button
                                    type="button"
                                    fullWidth
                                    size="lg"
                                    onClick={handleNextStep}
                                    className="mt-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                >
                                    Continue
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <Select
                                    label="I want to"
                                    options={roleOptions}
                                    value={selectedRole}
                                    onValueChange={(value) => setValue('role', value as any)}
                                    error={errors.role?.message}
                                />

                                <div className="space-y-2">
                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        prefix={<Lock className="w-4 h-4 text-gray-400" />}
                                        suffix={
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </motion.button>
                                        }
                                        error={errors.password?.message}
                                        {...register('password')}
                                        className={inputStyles}
                                    />

                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <motion.div
                                            className="space-y-1"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Password strength</span>
                                                <span className={`font-medium ${passwordStrength.label === 'Weak' ? 'text-red-500' :
                                                        passwordStrength.label === 'Medium' ? 'text-yellow-500' :
                                                            'text-green-500'
                                                    }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${passwordStrength.color} transition-all`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${passwordStrength.strength}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    prefix={<Lock className="w-4 h-4 text-gray-400" />}
                                    suffix={
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </motion.button>
                                    }
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword')}
                                    className={inputStyles}
                                />

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={handleBackStep}
                                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700"
                                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        loading={isLoading}
                                        className="flex-[2] bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Create Account
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            <motion.div
                className="text-center mt-4 pt-4 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                        onClick={() => onSwitchModal('login')}
                        className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
                    >
                        Sign In
                    </button>
                </p>
            </motion.div>
        </div>
    );
};
