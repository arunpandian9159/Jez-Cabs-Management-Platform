import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
    'relative inline-flex items-center justify-center rounded-full font-medium overflow-hidden bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    {
        variants: {
            size: {
                xs: 'h-6 w-6 text-[10px]',
                sm: 'h-8 w-8 text-xs',
                md: 'h-10 w-10 text-sm',
                lg: 'h-12 w-12 text-base',
                xl: 'h-16 w-16 text-lg',
                '2xl': 'h-24 w-24 text-2xl',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

export interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
    src?: string | null;
    alt?: string;
    name?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
}

const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
};

export function Avatar({
    className,
    size,
    src,
    alt,
    name,
    status,
    ...props
}: AvatarProps) {
    const initials = name ? getInitials(name) : '?';

    return (
        <div
            className={cn(avatarVariants({ size }), className)}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || name || 'Avatar'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        // Hide broken image and show initials
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900',
                        statusColors[status],
                        size === 'xs' && 'h-1.5 w-1.5',
                        size === 'sm' && 'h-2 w-2',
                        size === 'md' && 'h-2.5 w-2.5',
                        size === 'lg' && 'h-3 w-3',
                        size === 'xl' && 'h-3.5 w-3.5',
                        size === '2xl' && 'h-4 w-4'
                    )}
                />
            )}
        </div>
    );
}

// Avatar group for stacked avatars
export interface AvatarGroupProps {
    avatars: Array<{ src?: string; name?: string }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

export function AvatarGroup({
    avatars,
    max = 5,
    size = 'md',
    className,
}: AvatarGroupProps) {
    const displayedAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
        <div className={cn('flex -space-x-2', className)}>
            {displayedAvatars.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    name={avatar.name}
                    size={size}
                    className="ring-2 ring-white dark:ring-gray-900"
                />
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        avatarVariants({ size }),
                        'ring-2 ring-white dark:ring-gray-900 bg-gray-300 dark:bg-gray-600'
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

export { avatarVariants };
