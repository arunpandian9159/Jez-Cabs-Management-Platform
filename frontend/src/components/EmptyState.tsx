import React from 'react';
import { Car, Users, BookOpen, ClipboardList, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  AlertCircle,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = AlertCircle,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="border-0 shadow-xl card-modern overflow-hidden">
      <CardContent className="py-20 px-8">
        <div className="text-center max-w-md mx-auto animate-fade-in-up">
          {/* Icon container */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Background glow */}
            <div className="absolute w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full blur-xl opacity-60" />

            {/* Icon circle */}
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center animate-scale-in shadow-lg">
              <Icon className="h-12 w-12 text-slate-400" />
            </div>

            {/* Decorative sparkle */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-800 mb-3 animate-fade-in-up stagger-1">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-slate-500 mb-8 leading-relaxed animate-fade-in-up stagger-2">
              {description}
            </p>
          )}

          {/* Action button */}
          {actionLabel && onAction && (
            <div className="animate-fade-in-up stagger-3">
              <Button
                onClick={onAction}
                className="group px-8 py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {actionLabel}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
