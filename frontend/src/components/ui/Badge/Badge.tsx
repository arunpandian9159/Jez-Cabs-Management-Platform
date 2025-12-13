import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-info-100 text-info-800',
        outline: 'border border-gray-300 text-gray-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

export function Badge({
  className,
  variant,
  size,
  dot,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dotColor || 'bg-current')}
        />
      )}
      {children}
    </span>
  );
}

// Status badge with pre-defined colors for common statuses
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<
  string,
  {
    variant: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default';
    label?: string;
  }
> = {
  // Booking statuses
  pending: { variant: 'warning' },
  searching_driver: { variant: 'info', label: 'Searching' },
  driver_assigned: { variant: 'primary', label: 'Driver Assigned' },
  driver_arrived: { variant: 'info', label: 'Driver Arrived' },
  trip_started: { variant: 'primary', label: 'In Progress' },
  trip_completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'error' },
  no_driver_available: { variant: 'error', label: 'No Driver' },

  // Driver statuses
  online: { variant: 'success' },
  offline: { variant: 'default' },
  busy: { variant: 'warning' },
  break: { variant: 'default' },

  // Verification statuses
  documents_uploaded: { variant: 'info', label: 'Documents Uploaded' },
  under_review: { variant: 'warning', label: 'Under Review' },
  background_check: { variant: 'warning', label: 'Background Check' },
  approved: { variant: 'success' },
  rejected: { variant: 'error' },
  suspended: { variant: 'error' },

  // Cab statuses
  available: { variant: 'success' },
  rented: { variant: 'info' },
  in_trip: { variant: 'primary', label: 'In Trip' },
  maintenance: { variant: 'warning' },
  inactive: { variant: 'default' },

  // Payment statuses
  processing: { variant: 'info' },
  completed: { variant: 'success' },
  failed: { variant: 'error' },
  refunded: { variant: 'info' },

  // Emergency statuses
  triggered: { variant: 'error' },
  confirmed: { variant: 'error' },
  active: { variant: 'error' },
  contacting_services: { variant: 'warning', label: 'Contacting Services' },
  help_dispatched: { variant: 'info', label: 'Help Dispatched' },
  resolving: { variant: 'warning' },
  resolved: { variant: 'success' },
  false_alarm: { variant: 'default', label: 'False Alarm' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] || { variant: 'default' as const };
  const label =
    config.label ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant={config.variant} className={className} dot>
      {label}
    </Badge>
  );
}

export { badgeVariants };
