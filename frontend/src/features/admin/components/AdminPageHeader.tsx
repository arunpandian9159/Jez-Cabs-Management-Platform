import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: string;
    subtitle: string;
    icon?: LucideIcon;
    iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
    action?: ReactNode;
}

const iconColors = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600',
    accent: 'from-accent-500 to-accent-600',
};

export function AdminPageHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = 'primary',
    action,
}: AdminPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                {Icon && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColors[iconColor]} flex items-center justify-center shadow-lg`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500">{subtitle}</p>
                </div>
            </div>
            {action && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}
