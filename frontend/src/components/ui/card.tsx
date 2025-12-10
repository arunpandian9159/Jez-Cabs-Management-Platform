import { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
    'rounded-xl border transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800',
                elevated: 'bg-white border-gray-200 shadow-md hover:shadow-lg dark:bg-gray-900 dark:border-gray-800',
                outline: 'bg-transparent border-gray-300 dark:border-gray-700',
                ghost: 'bg-gray-50 border-transparent dark:bg-gray-800/50',
                gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-200 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700',
            },
            padding: {
                none: 'p-0',
                sm: 'p-3',
                md: 'p-4',
                lg: 'p-6',
                xl: 'p-8',
            },
            interactive: {
                true: 'cursor-pointer hover:border-primary-300 hover:shadow-md active:scale-[0.99] dark:hover:border-primary-700',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'md',
            interactive: false,
        },
    }
);

export interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, interactive, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, padding, interactive }), className)}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
    HTMLHeadingElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
            className
        )}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export { cardVariants };
