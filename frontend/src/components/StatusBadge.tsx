import React from 'react';

type StatusType = 'AVAILABLE' | 'RENTED' | 'IN_MAINTENANCE' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PAID' | 'UNPAID' | 'OVERDUE' | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<string, {
  label: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  icon: string;
}> = {
  // Vehicle statuses
  AVAILABLE: {
    label: 'Available',
    bgGradient: 'from-emerald-100 to-green-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '✓',
  },
  RENTED: {
    label: 'Rented',
    bgGradient: 'from-blue-100 to-cyan-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: '🚗',
  },
  IN_MAINTENANCE: {
    label: 'Maintenance',
    bgGradient: 'from-amber-100 to-orange-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '🔧',
  },

  // Driver statuses
  ACTIVE: {
    label: 'Active',
    bgGradient: 'from-emerald-100 to-green-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '●',
  },
  INACTIVE: {
    label: 'Inactive',
    bgGradient: 'from-slate-100 to-gray-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    icon: '○',
  },

  // Booking statuses
  PENDING: {
    label: 'Pending',
    bgGradient: 'from-amber-100 to-yellow-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '⏳',
  },
  COMPLETED: {
    label: 'Completed',
    bgGradient: 'from-emerald-100 to-green-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '✓',
  },
  CANCELLED: {
    label: 'Cancelled',
    bgGradient: 'from-red-100 to-rose-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: '✕',
  },

  // Invoice statuses
  PAID: {
    label: 'Paid',
    bgGradient: 'from-emerald-100 to-green-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '💰',
  },
  UNPAID: {
    label: 'Unpaid',
    bgGradient: 'from-amber-100 to-orange-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '⏰',
  },
  OVERDUE: {
    label: 'Overdue',
    bgGradient: 'from-red-100 to-rose-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: '⚠️',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || {
    label: status,
    bgGradient: 'from-slate-100 to-gray-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    icon: '•',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
        bg-gradient-to-r ${config.bgGradient} ${config.textColor} 
        border ${config.borderColor}
        transition-all duration-200 hover:scale-105
        ${className}
      `}
    >
      <span className="text-xs leading-none">{config.icon}</span>
      {config.label}
    </span>
  );
};
