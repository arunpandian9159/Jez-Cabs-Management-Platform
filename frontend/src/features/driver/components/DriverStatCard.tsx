import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DriverStatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: string;
        direction: 'up' | 'down';
    };
    color?: 'primary' | 'success' | 'warning' | 'error' | 'accent' | 'gray';
    delay?: number;
}

const colorClasses = {
    primary: {
        bg: 'bg-primary-100',
        icon: 'bg-gradient-to-br from-primary-500 to-primary-600',
        text: 'text-primary-600',
        value: 'text-primary-700',
    },
    success: {
        bg: 'bg-success-100',
        icon: 'bg-gradient-to-br from-success-500 to-success-600',
        text: 'text-success-600',
        value: 'text-success-700',
    },
    warning: {
        bg: 'bg-warning-100',
        icon: 'bg-gradient-to-br from-warning-500 to-warning-600',
        text: 'text-warning-600',
        value: 'text-warning-700',
    },
    error: {
        bg: 'bg-error-100',
        icon: 'bg-gradient-to-br from-error-500 to-error-600',
        text: 'text-error-600',
        value: 'text-error-700',
    },
    accent: {
        bg: 'bg-accent-100',
        icon: 'bg-gradient-to-br from-accent-500 to-accent-600',
        text: 'text-accent-600',
        value: 'text-accent-700',
    },
    gray: {
        bg: 'bg-gray-100',
        icon: 'bg-gradient-to-br from-gray-500 to-gray-600',
        text: 'text-gray-600',
        value: 'text-gray-700',
    },
};

export function DriverStatCard({
    label,
    value,
    icon: Icon,
    trend,
    color = 'primary',
    delay = 0,
}: DriverStatCardProps) {
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02, y: -2 }}
        >
            <Card padding="md" className={`${colors.bg} border-transparent overflow-hidden relative`}>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: delay + 0.1 }}
                            className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center shadow-lg`}
                        >
                            <Icon className="w-5 h-5 text-white" />
                        </motion.div>
                    )}
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-0.5">{label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
                            {trend && (
                                <span
                                    className={`flex items-center text-xs font-medium ${trend.direction === 'up' ? 'text-success-600' : 'text-error-600'
                                        }`}
                                >
                                    {trend.direction === 'up' ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    {trend.value}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${colors.icon} opacity-20 blur-xl`} />
            </Card>
        </motion.div>
    );
}
