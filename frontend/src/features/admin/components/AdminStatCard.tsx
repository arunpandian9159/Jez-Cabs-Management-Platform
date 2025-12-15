import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ReactNode } from 'react';

interface AdminStatCardProps {
    label: ReactNode;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: string;
        direction: 'up' | 'down';
    };
    color?: 'primary' | 'success' | 'warning' | 'error' | 'accent' | 'gray';
    delay?: number;
}

const colorStyles = {
    primary: {
        bg: 'bg-gradient-to-br from-primary-50 to-primary-100',
        icon: 'bg-primary-500',
        text: 'text-primary-600',
        border: 'border-primary-200',
    },
    success: {
        bg: 'bg-gradient-to-br from-success-50 to-success-100',
        icon: 'bg-success-500',
        text: 'text-success-600',
        border: 'border-success-200',
    },
    warning: {
        bg: 'bg-gradient-to-br from-warning-50 to-warning-100',
        icon: 'bg-warning-500',
        text: 'text-warning-600',
        border: 'border-warning-200',
    },
    error: {
        bg: 'bg-gradient-to-br from-error-50 to-error-100',
        icon: 'bg-error-500',
        text: 'text-error-600',
        border: 'border-error-200',
    },
    accent: {
        bg: 'bg-gradient-to-br from-accent-50 to-accent-100',
        icon: 'bg-accent-500',
        text: 'text-accent-600',
        border: 'border-accent-200',
    },
    gray: {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
        icon: 'bg-gray-500',
        text: 'text-gray-600',
        border: 'border-gray-200',
    },
};

export function AdminStatCard({
    label,
    value,
    icon: Icon,
    trend,
    color = 'primary',
    delay = 0,
}: AdminStatCardProps) {
    const styles = colorStyles[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
            <Card
                padding="md"
                className={`${styles.bg} border ${styles.border} overflow-hidden relative`}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">{label}</p>
                        <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${styles.text}`}>{value}</p>
                    </div>
                    {Icon && (
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ delay: delay + 0.1 }}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${styles.icon} flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.div>
                    )}
                </div>
                {trend && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                        className={`flex items-center gap-1 mt-2 text-sm ${trend.direction === 'up' ? 'text-success-600' : 'text-error-600'}`}
                    >
                        {trend.direction === 'up' ? (
                            <ArrowUpRight className="w-4 h-4" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{trend.value}</span>
                    </motion.div>
                )}
                {/* Decorative gradient orb */}
                <div
                    className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${styles.icon} opacity-10 blur-2xl`}
                />
            </Card>
        </motion.div>
    );
}
