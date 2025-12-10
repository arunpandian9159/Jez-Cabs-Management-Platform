import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <Loader2
            className={cn(
                'animate-spin text-primary-600',
                sizeClasses[size],
                className
            )}
        />
    );
}

// Full page loading overlay
export interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="xl" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {message}
                </p>
            </div>
        </div>
    );
}

// Skeleton loading placeholders
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    style,
    ...props
}: SkeletonProps) {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-lg',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'skeleton', // Uses the skeleton shimmer animation from globals.css
        none: '',
    };

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                ...style,
            }}
            {...props}
        />
    );
}

// Pre-built skeleton patterns
export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                    <Skeleton width="60%" height={16} className="mb-2" />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>
            <Skeleton width="100%" height={12} className="mb-2" />
            <Skeleton width="80%" height={12} className="mb-2" />
            <Skeleton width="90%" height={12} />
        </div>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-3 py-3">
            <Skeleton variant="circular" width={36} height={36} />
            <div className="flex-1">
                <Skeleton width="40%" height={14} className="mb-1" />
                <Skeleton width="60%" height={12} />
            </div>
            <Skeleton width={60} height={24} variant="rounded" />
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton width={i === 0 ? '80%' : '60%'} height={14} />
                </td>
            ))}
        </tr>
    );
}
