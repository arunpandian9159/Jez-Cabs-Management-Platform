import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface OwnerPageHeaderProps {
    title: string;
    subtitle: string;
    icon?: LucideIcon;
    iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
    action?: ReactNode;
}

const iconColorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600',
    accent: 'from-accent-500 to-accent-600',
};

export function OwnerPageHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = 'primary',
    action,
}: OwnerPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
        >
            <div className="flex items-center gap-3 sm:gap-4">
                {Icon && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${iconColorClasses[iconColor]} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                )}
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-0.5 truncate">{title}</h1>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
                </div>
            </div>
            {action && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-shrink-0"
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}

