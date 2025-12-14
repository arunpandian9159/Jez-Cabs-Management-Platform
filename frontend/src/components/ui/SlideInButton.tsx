import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface SlideInButtonProps {
    text?: string;
    onClick?: () => void;
    defaultBgColor?: string;
    hoverBgColor?: string;
    defaultTextColor?: string;
    hoverTextColor?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function SlideInButton({
    text = 'Get Started',
    onClick,
    defaultBgColor = '#ffffff',
    hoverBgColor = '#2563eb',
    defaultTextColor = '#000000',
    hoverTextColor = '#ffffff',
    icon,
    className = '',
}: SlideInButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative inline-flex items-center justify-center cursor-pointer overflow-hidden ${className}`}
            style={{
                backgroundColor: defaultBgColor,
                borderRadius: '39px',
                padding: '14px 26px',
                border: 'none',
                outline: 'none',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Fill Animation */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    backgroundColor: hoverBgColor,
                    left: '50%',
                    transformOrigin: 'center',
                }}
                initial={{ scale: 0, x: '-50%' }}
                animate={{
                    scale: isHovered ? 2.5 : 0,
                    x: '-50%',
                }}
                transition={{
                    type: 'spring',
                    bounce: 0.1,
                    duration: 0.5,
                }}
            />

            {/* Button Content */}
            <div className="relative flex items-center gap-2">
                {/* Text */}
                <motion.span
                    className="font-semibold text-base whitespace-nowrap"
                    style={{
                        color: isHovered ? hoverTextColor : defaultTextColor,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {text}
                </motion.span>

                {/* Icon with slide-in animation */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : -10,
                    }}
                    transition={{
                        type: 'spring',
                        bounce: 0.1,
                        duration: 0.4,
                    }}
                >
                    {icon || (
                        <ArrowRight
                            className="w-5 h-5"
                            style={{ color: hoverTextColor }}
                        />
                    )}
                </motion.div>
            </div>
        </motion.button>
    );
}
