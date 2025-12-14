import { motion } from 'framer-motion';
import { LucideIcon, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReactNode } from 'react';

interface AdminEmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: ReactNode;
    };
}

export function AdminEmptyState({
    icon: Icon = SearchX,
    title,
    description,
    action,
}: AdminEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6"
            >
                <Icon className="w-10 h-10 text-gray-400" />
            </motion.div>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-900 mb-2 text-center"
            >
                {title}
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-center max-w-md mb-6"
            >
                {description}
            </motion.p>
            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button onClick={action.onClick} leftIcon={action.icon}>
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
