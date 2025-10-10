import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Close, Warning, Delete, Info, CheckCircle } from '@mui/icons-material';

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
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <Delete sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'info':
        return <Info sx={{ fontSize: 48, color: 'info.main' }} />;
      case 'success':
        return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />;
      default:
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
        <IconButton onClick={onClose} size="small" disabled={isLoading}>
          <Close />
        </IconButton>
      </Box>

      <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {getIcon()}
        </Box>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

