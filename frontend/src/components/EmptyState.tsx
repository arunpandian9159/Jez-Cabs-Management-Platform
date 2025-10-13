import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <Card>
      <CardContent className="text-center py-16 px-8">
        <div className="inline-flex items-center justify-center w-30 h-30 rounded-full bg-gray-100 mb-6">
          <Icon className="h-16 w-16 text-gray-400" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>

        {(actionLabel || secondaryActionLabel) && (
          <div className="flex gap-4 justify-center">
            {actionLabel && onAction && (
              <Button onClick={onAction} size="lg">
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button variant="outline" size="lg" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

