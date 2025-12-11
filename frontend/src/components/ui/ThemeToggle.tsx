import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className={cn(
                'relative flex items-center justify-center rounded-xl',
                'bg-gray-100 dark:bg-gray-800',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'border border-gray-200 dark:border-gray-700',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                sizeClasses[size],
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className={cn(iconSizes[size], 'text-amber-500')} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className={cn(iconSizes[size], 'text-indigo-400')} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glow effect */}
            <motion.div
                className={cn(
                    'absolute inset-0 rounded-xl opacity-0',
                    theme === 'light'
                        ? 'bg-amber-400/20'
                        : 'bg-indigo-400/20'
                )}
                animate={{
                    opacity: [0, 0.5, 0],
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                }}
            />
        </motion.button>
    );
}
