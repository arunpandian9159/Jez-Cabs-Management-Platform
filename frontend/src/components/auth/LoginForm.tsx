import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { loginSchema, LoginFormData, AuthModalType, SocialLoginButtons } from './AuthModal';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading: boolean;
    onSwitchModal: (type: AuthModalType) => void;
}

export const LoginForm = ({ onSubmit, isLoading, onSwitchModal }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Common input styles for white background with dark text
    const inputStyles = "!bg-white !text-gray-900 border-2 border-gray-200 focus:border-teal-500 transition-all placeholder:!text-gray-400";

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Welcome Back!
                </h2>
                <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
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

                <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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
                </motion.div>

                <motion.div
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-2 transition-all cursor-pointer"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-all"
                    >
                        Forgot password?
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        loading={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        Sign In
                    </Button>
                </motion.div>
            </form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <SocialLoginButtons />
            </motion.div>

            <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
            >
                <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                        onClick={() => onSwitchModal('register')}
                        className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
                    >
                        Sign Up
                    </button>
                </p>
            </motion.div>
        </div>
    );
};
