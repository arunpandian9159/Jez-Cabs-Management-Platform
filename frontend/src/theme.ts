import { createTheme, alpha } from '@mui/material/styles';

// Premium & Modern Color Scheme for B2B Cab Management Platform
// Synchronized with Tailwind CSS configuration for consistency
const colors = {
  // Primary - Deep Blue (Trust, Security, Professionalism)
  primary: {
    main: '#2563eb', // Vibrant Blue
    light: '#3b82f6', // Lighter Blue
    dark: '#1d4ed8', // Darker Blue
    contrastText: '#ffffff',
  },
  // Secondary/Accent - Teal (Modern, Tech-focused CTA)
  secondary: {
    main: '#0d9488', // Teal
    light: '#14b8a6', // Lighter Teal
    dark: '#0f766e', // Darker Teal
    contrastText: '#ffffff',
  },
  // Semantic Colors
  success: {
    main: '#10b981', // Success Green
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b', // Warning Amber
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444', // Error Red
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  info: {
    main: '#06b6d4', // Info Cyan
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#ffffff',
  },
  // Neutral Colors
  grey: {
    50: '#f8fafc', // Off-white background
    100: '#f1f5f9', // Light gray
    200: '#e2e8f0', // Medium-light gray
    300: '#cbd5e1', // Medium gray (borders)
    400: '#94a3b8', // Medium-dark gray
    500: '#64748b', // Dark gray (secondary text)
    600: '#475569', // Darker gray
    700: '#334155', // Charcoal (primary text)
    800: '#1e293b', // Very dark gray
    900: '#0f172a', // Almost black
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.grey,
    background: {
      default: colors.grey[50], // Off-white for main background
      paper: '#ffffff',
    },
    text: {
      primary: colors.grey[800], // Darker for better readability
      secondary: colors.grey[500], // Medium gray for secondary text
      disabled: colors.grey[400],
    },
    divider: colors.grey[200],
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem', // Larger for more impact
      fontWeight: 900, // Extra bold for modern look
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      color: colors.grey[900],
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
      color: colors.grey[900],
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.grey[800],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      color: colors.grey[800],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
      color: colors.grey[700],
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.grey[700],
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: colors.grey[700],
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.65,
      color: colors.grey[600],
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
      fontSize: '0.95rem',
    },
  },
  shape: {
    borderRadius: 16, // Modern rounded corners
  },
  shadows: [
    'none',
    `0px 1px 2px ${alpha(colors.grey[900], 0.04)}`,
    `0px 2px 4px ${alpha(colors.grey[900], 0.06)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 6px 12px ${alpha(colors.grey[900], 0.1)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.12)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.14)}`,
    `0px 16px 32px ${alpha(colors.grey[900], 0.16)}`,
    `0px 20px 40px ${alpha(colors.grey[900], 0.18)}`,
    `0px 24px 48px ${alpha(colors.grey[900], 0.2)}`,
    `0px 28px 56px ${alpha(colors.grey[900], 0.22)}`,
    `0px 32px 64px ${alpha(colors.grey[900], 0.24)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 6px 12px ${alpha(colors.grey[900], 0.1)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.12)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.14)}`,
    `0px 16px 32px ${alpha(colors.grey[900], 0.16)}`,
    `0px 20px 40px ${alpha(colors.grey[900], 0.18)}`,
    `0px 24px 48px ${alpha(colors.grey[900], 0.2)}`,
    `0px 28px 56px ${alpha(colors.grey[900], 0.22)}`,
    `0px 32px 64px ${alpha(colors.grey[900], 0.24)}`,
    `0px 36px 72px ${alpha(colors.grey[900], 0.26)}`,
    `0px 40px 80px ${alpha(colors.grey[900], 0.28)}`,
    `0px 44px 88px ${alpha(colors.grey[900], 0.3)}`,
    `0px 48px 96px ${alpha(colors.grey[900], 0.32)}`,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 14,
          fontWeight: 600,
          padding: '12px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.95rem',
          letterSpacing: '0.01em',
          '&:hover': {
            boxShadow: `0px 8px 24px ${alpha(colors.primary.main, 0.25)}`,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark}, ${colors.primary.main})`,
            boxShadow: `0px 12px 28px ${alpha(colors.primary.main, 0.35)}`,
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: colors.primary.main,
          '&:hover': {
            borderWidth: 2,
            borderColor: colors.primary.dark,
            backgroundColor: alpha(colors.primary.main, 0.06),
          },
        },
        sizeLarge: {
          padding: '16px 36px',
          fontSize: '1.05rem',
          borderRadius: 16,
        },
        sizeSmall: {
          padding: '8px 18px',
          fontSize: '0.875rem',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: `0px 4px 16px ${alpha(colors.grey[900], 0.06)}, 0px 0px 0px 1px ${alpha(colors.grey[900], 0.02)}`,
          border: `1px solid ${alpha(colors.grey[200], 0.9)}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            boxShadow: `0px 16px 40px ${alpha(colors.grey[900], 0.15)}`,
            transform: 'translateY(-4px)',
            borderColor: alpha(colors.primary.main, 0.15),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0px 2px 10px ${alpha(colors.grey[900], 0.08)}`,
        },
        elevation2: {
          boxShadow: `0px 4px 16px ${alpha(colors.grey[900], 0.1)}`,
        },
        elevation3: {
          boxShadow: `0px 8px 28px ${alpha(colors.grey[900], 0.12)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease-in-out',
            backgroundColor: alpha(colors.grey[50], 0.5),
            '&:hover': {
              backgroundColor: alpha(colors.grey[50], 0.8),
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.light,
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                boxShadow: `0 0 0 4px ${alpha(colors.primary.main, 0.1)}`,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success.main, 0.1),
          color: colors.success.dark,
          border: `1px solid ${alpha(colors.success.main, 0.2)}`,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning.main, 0.1),
          color: colors.warning.dark,
          border: `1px solid ${alpha(colors.warning.main, 0.2)}`,
        },
        standardError: {
          backgroundColor: alpha(colors.error.main, 0.1),
          color: colors.error.dark,
          border: `1px solid ${alpha(colors.error.main, 0.2)}`,
        },
        standardInfo: {
          backgroundColor: alpha(colors.info.main, 0.1),
          color: colors.info.dark,
          border: `1px solid ${alpha(colors.info.main, 0.2)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `0px 2px 8px ${alpha(colors.grey[900], 0.08)}`,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: `4px 0px 16px ${alpha(colors.grey[900], 0.08)}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: colors.grey[50],
          color: colors.grey[700],
          borderBottomWidth: 2,
        },
        body: {
          fontSize: '0.925rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: `0px 24px 64px ${alpha(colors.grey[900], 0.2)}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.grey[900],
          fontSize: '0.8rem',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: colors.grey[600],
        },
      },
    },
  },
});
