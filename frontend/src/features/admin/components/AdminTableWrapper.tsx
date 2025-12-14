import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { AdminEmptyState } from './AdminEmptyState';
import { LucideIcon, Loader2 } from 'lucide-react';

interface AdminTableWrapperProps {
    children: ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyState?: {
        icon?: LucideIcon;
        title: string;
        description: string;
        action?: {
            label: string;
            onClick: () => void;
            icon?: ReactNode;
        };
    };
}

export function AdminTableWrapper({
    children,
    isLoading = false,
    isEmpty = false,
    emptyState,
}: AdminTableWrapperProps) {
    if (isLoading) {
        return (
            <Card padding="lg">
                <div className="flex items-center justify-center py-16">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Loader2 className="w-8 h-8 text-primary-600" />
                    </motion.div>
                    <span className="ml-3 text-gray-500">Loading data...</span>
                </div>
            </Card>
        );
    }

    if (isEmpty && emptyState) {
        return (
            <Card padding="none">
                <AdminEmptyState
                    icon={emptyState.icon}
                    title={emptyState.title}
                    description={emptyState.description}
                    action={emptyState.action}
                />
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">{children}</div>
            </Card>
        </motion.div>
    );
}

// Enhanced table styles for consistent styling
export const tableStyles = {
    table: 'w-full',
    thead: 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200',
    th: 'text-left py-3.5 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider',
    tbody: 'divide-y divide-gray-100',
    tr: 'hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200',
    td: 'py-4 px-4',
    tdText: 'text-sm text-gray-600',
    tdBold: 'text-sm font-medium text-gray-900',
};
