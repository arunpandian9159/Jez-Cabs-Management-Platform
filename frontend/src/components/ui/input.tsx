import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const inputVariants = cva(
    'flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900',
    {
        variants: {
            variant: {
                default:
                    'border-gray-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 dark:border-gray-700',
                error:
                    'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20',
                success:
                    'border-success-500 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/20',
            },
            inputSize: {
                sm: 'h-8 px-2.5 text-xs',
                md: 'h-10 px-3 text-sm',
                lg: 'h-12 px-4 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
);

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    hint?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    containerClassName?: string;
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
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className={cn('space-y-1.5', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {prefix && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {prefix}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={cn(
                            inputVariants({
                                variant: error ? 'error' : variant,
                                inputSize,
                                className
                            }),
                            prefix && 'pl-10',
                            (suffix || isPassword) && 'pr-10'
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                    {suffix && !isPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {suffix}
                        </div>
                    )}
                </div>
                {(error || hint) && (
                    <p
                        className={cn(
                            'flex items-center gap-1 text-xs',
                            error ? 'text-error-600' : 'text-gray-500'
                        )}
                    >
                        {error && <AlertCircle className="h-3 w-3" />}
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { inputVariants };
