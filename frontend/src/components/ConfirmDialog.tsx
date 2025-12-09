import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { AlertTriangle, Trash2, Info, CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const severityConfig = {
  error: {
    icon: Trash2,
    iconBg: 'bg-gradient-to-br from-red-100 to-red-200',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    buttonBg: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/30',
    glowColor: 'shadow-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-gradient-to-br from-amber-100 to-orange-200',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    buttonBg: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-amber-500/30',
    glowColor: 'shadow-amber-500/20',
  },
  info: {
    icon: Info,
    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    buttonBg: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/30',
    glowColor: 'shadow-blue-500/20',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    buttonBg: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-500/30',
    glowColor: 'shadow-green-500/20',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  isLoading = false,
}) => {
  const config = severityConfig[severity];
  const IconComponent = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md rounded-2xl border-0 shadow-2xl glass-effect-premium overflow-hidden">
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${severity === 'error' ? 'from-red-500 to-rose-500' :
            severity === 'warning' ? 'from-amber-500 to-orange-500' :
              severity === 'info' ? 'from-blue-500 to-cyan-500' :
                'from-green-500 to-emerald-500'
          }`} />

        <AlertDialogHeader className="text-center pt-8 pb-4">
          {/* Icon container with glow effect */}
          <div className="relative flex justify-center mb-6">
            <div className={`absolute w-20 h-20 ${config.iconBg} rounded-full blur-xl opacity-60`} />
            <div className={`relative w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center border ${config.borderColor} shadow-lg ${config.glowColor}`}>
              <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
            </div>
          </div>

          <AlertDialogTitle className="text-xl font-bold text-slate-900 text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-slate-600 mt-2 leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-3 pb-6 pt-4 px-6">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 px-6 font-semibold border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto h-12 px-6 font-semibold text-white rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:transform-none ${config.buttonBg}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
