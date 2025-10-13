import React from 'react';
import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
      case 'COMPLETED':
      case 'PAID':
        return 'success';
      case 'RENTED':
      case 'ACTIVE':
      case 'SENT':
        return 'info';
      case 'IN_MAINTENANCE':
      case 'MAINTENANCE':
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
      case 'OVERDUE':
        return 'destructive';
      case 'DRAFT':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <Badge variant={getStatusVariant(status) as any}>
      {getStatusLabel(status)}
    </Badge>
  );
};

