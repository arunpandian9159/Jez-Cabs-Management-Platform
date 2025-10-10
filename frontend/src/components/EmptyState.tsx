import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateProps {
  icon: SvgIconComponent;
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
      <CardContent sx={{ textAlign: 'center', py: 8, px: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            mb: 3,
          }}
        >
          <Icon sx={{ fontSize: 64, color: 'grey.400' }} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>
          {description}
        </Typography>

        {(actionLabel || secondaryActionLabel) && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            {actionLabel && onAction && (
              <Button variant="contained" size="large" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button variant="outlined" size="large" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

