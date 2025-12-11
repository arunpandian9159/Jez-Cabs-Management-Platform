import { forwardRef, InputHTMLAttributes, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const inputVariants = cva(
    'peer flex w-full rounded-xl border-2 bg-white px-3 py-3 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'border-gray-200 hover:border-gray-300 focus-visible:border-teal-500 focus-visible:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] focus-visible:scale-[1.01]',
                error:
                    'border-red-300 hover:border-red-400 focus-visible:border-red-500 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
                success:
                    'border-green-300 hover:border-green-400 focus-visible:border-green-500 focus-visible:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]',
            },
            inputSize: {
                sm: 'h-9 px-2.5 text-xs',
                md: 'h-11 px-3 text-sm',
                lg: 'h-13 px-4 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
);

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    variant?: 'default' | 'error' | 'success' | null;
    inputSize?: 'sm' | 'md' | 'lg' | null;
    label?: string;
    error?: string;
    hint?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    containerClassName?: string;
    floatingLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            containerClassName,
            variant,
            inputSize,
            type = 'text',
            label,
            error,
            hint,
            prefix,
            suffix,
            id,
            floatingLabel = false,
            value,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        useEffect(() => {
            if (inputRef.current) {
                setHasValue(!!inputRef.current.value);
            }
        }, [value]);

        const handleFocus = () => setIsFocused(true);
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        };

        const isLabelFloating = floatingLabel && (isFocused || hasValue);

        return (
            <div className={cn('relative space-y-1.5', containerClassName)}>
                {label && !floatingLabel && (
                    <motion.label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-gray-900"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {label}
                    </motion.label>
                )}
                <div className="relative group">
                    {/* Animated background glow */}
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl opacity-0 blur transition-opacity duration-300"
                        animate={{
                            opacity: isFocused ? 0.2 : 0,
                        }}
                    />

                    <div className="relative">
                        {prefix && (
                            <motion.div
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                                animate={{
                                    scale: isFocused ? 1.1 : 1,
                                    color: isFocused ? 'rgb(20, 184, 166)' : 'rgb(156, 163, 175)',
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {prefix}
                            </motion.div>
                        )}

                        {floatingLabel && label && (
                            <motion.label
                                htmlFor={inputId}
                                className={cn(
                                    'absolute left-3 pointer-events-none transition-all duration-200 font-medium',
                                    prefix && 'left-10'
                                )}
                                animate={{
                                    top: isLabelFloating ? '0.25rem' : '50%',
                                    y: isLabelFloating ? 0 : '-50%',
                                    fontSize: isLabelFloating ? '0.75rem' : '0.875rem',
                                    color: isFocused
                                        ? 'rgb(20, 184, 166)'
                                        : error
                                            ? 'rgb(239, 68, 68)'
                                            : 'rgb(107, 114, 128)',
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {label}
                            </motion.label>
                        )}

                        <input
                            ref={(node) => {
                                if (typeof ref === 'function') {
                                    ref(node);
                                } else if (ref) {
                                    ref.current = node;
                                }
                                // @ts-ignore
                                inputRef.current = node;
                            }}
                            id={inputId}
                            type={inputType}
                            value={value}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={cn(
                                inputVariants({
                                    variant: error ? 'error' : variant,
                                    inputSize,
                                }),
                                prefix && 'pl-10',
                                (suffix || isPassword) && 'pr-10',
                                floatingLabel && isLabelFloating && 'pt-5 pb-1',
                                className
                            )}
                            {...props}
                        />

                        {/* Success indicator */}
                        <AnimatePresence>
                            {variant === 'success' && !isPassword && !suffix && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isPassword && (
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 focus:outline-none z-10"
                                tabIndex={-1}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    color: showPassword ? 'rgb(20, 184, 166)' : 'rgb(156, 163, 175)',
                                }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ rotate: showPassword ? 0 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </motion.div>
                            </motion.button>
                        )}

                        {suffix && !isPassword && (
                            <motion.div
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                animate={{
                                    scale: isFocused ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {suffix}
                            </motion.div>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {(error || hint) && (
                        <motion.p
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                'flex items-center gap-1.5 text-xs mt-1.5',
                                error ? '!text-red-600 font-semibold' : 'text-gray-500'
                            )}
                        >
                            {error && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                >
                                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                </motion.div>
                            )}
                            {error || hint}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';

export { inputVariants };
