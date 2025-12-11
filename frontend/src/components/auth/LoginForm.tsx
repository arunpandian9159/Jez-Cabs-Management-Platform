import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { loginSchema, LoginFormData, AuthModalType, SocialLoginButtons } from './AuthModal';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading: boolean;
    onSwitchModal: (type: AuthModalType) => void;
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

export const LoginForm = ({ onSubmit, isLoading, onSwitchModal }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Common input styles for white background with dark text
    const inputStyles = "!bg-white !text-gray-900 border-2 border-gray-200 focus:border-teal-500 transition-all placeholder:!text-gray-400";

    return (
        <motion.div
            className="w-full max-w-md mx-auto h-full flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="text-center mb-10"
                variants={itemVariants}
            >
                <motion.div
                    className="inline-flex items-center gap-2 mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <Sparkles className="w-6 h-6 text-teal-500" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        Welcome Back!
                    </h2>
                    <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
                <motion.p
                    className="text-gray-500 text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Sign in to continue your journey
                </motion.p>
            </motion.div>

            <div className="flex-1">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <motion.div variants={itemVariants}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            prefix={<Mail className="w-4 h-4 text-gray-400" />}
                            error={errors.email?.message}
                            {...register('email')}
                            className={inputStyles}
                            autoFocus
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                        className="flex items-center justify-between text-sm pt-1"
                        variants={itemVariants}
                    >
                        <motion.label
                            className="flex items-center gap-2.5 cursor-pointer group"
                            whileHover={{ x: 2 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <motion.input
                                type="checkbox"
                                className="w-4 h-4 rounded-md border-2 border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer"
                                whileTap={{ scale: 0.9 }}
                            />
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                                Remember me
                            </span>
                        </motion.label>
                        <motion.button
                            type="button"
                            className="text-teal-600 hover:text-teal-700 font-semibold relative group"
                            whileHover={{ x: 2 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            Forgot password?
                            <motion.span
                                className="absolute -bottom-0.5 left-0 h-0.5 bg-teal-600 origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.2 }}
                                style={{ width: '100%' }}
                            />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="pt-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                loading={isLoading}
                                className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform relative overflow-hidden group"
                                rightIcon={
                                    <motion.div
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                }
                            >
                                <span className="relative z-10 font-semibold">Sign In</span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    initial={false}
                                />
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    className="mt-8"
                >
                    <SocialLoginButtons />
                </motion.div>
            </div>

            <motion.div
                className="text-center mt-auto pt-8 border-t border-gray-200 shrink-0"
                variants={itemVariants}
            >
                <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <motion.button
                        onClick={() => onSwitchModal('register')}
                        className="text-teal-600 font-bold hover:text-teal-700 relative inline-block group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up
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
        </motion.div>
    );
};
