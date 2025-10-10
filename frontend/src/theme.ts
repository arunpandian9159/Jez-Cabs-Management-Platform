import { createTheme, alpha } from '@mui/material/styles';

// Professional & Trustworthy Color Scheme for B2B Cab Management Platform
const colors = {
  // Primary - Deep Blue (Trust, Security, Professionalism)
  primary: {
    main: '#1e40af', // Deep Blue
    light: '#3b82f6', // Lighter Blue
    dark: '#1e3a8a', // Darker Blue
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
    50: '#f9fafb', // Off-white background
    100: '#f3f4f6', // Light gray
    200: '#e5e7eb', // Medium-light gray
    300: '#d1d5db', // Medium gray (borders)
    400: '#9ca3af', // Medium-dark gray
    500: '#6b7280', // Dark gray (secondary text)
    600: '#4b5563', // Darker gray
    700: '#374151', // Charcoal (primary text)
    800: '#1f2937', // Very dark gray
    900: '#111827', // Almost black
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
      primary: colors.grey[700], // Charcoal for primary text
      secondary: colors.grey[500], // Medium gray for secondary text
      disabled: colors.grey[400],
    },
    divider: colors.grey[200],
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.grey[800],
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: colors.grey[800],
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.grey[800],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.grey[700],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.grey[700],
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.grey[700],
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.grey[700],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.grey[600],
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    `0px 2px 4px ${alpha(colors.grey[900], 0.05)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.1)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.12)}`,
    `0px 16px 32px ${alpha(colors.grey[900], 0.14)}`,
    `0px 20px 40px ${alpha(colors.grey[900], 0.16)}`,
    `0px 24px 48px ${alpha(colors.grey[900], 0.18)}`,
    `0px 2px 4px ${alpha(colors.grey[900], 0.05)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.1)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.12)}`,
    `0px 16px 32px ${alpha(colors.grey[900], 0.14)}`,
    `0px 20px 40px ${alpha(colors.grey[900], 0.16)}`,
    `0px 24px 48px ${alpha(colors.grey[900], 0.18)}`,
    `0px 2px 4px ${alpha(colors.grey[900], 0.05)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.1)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.12)}`,
    `0px 20px 40px ${alpha(colors.grey[900], 0.16)}`,
    `0px 24px 48px ${alpha(colors.grey[900], 0.18)}`,
    `0px 2px 4px ${alpha(colors.grey[900], 0.05)}`,
    `0px 4px 8px ${alpha(colors.grey[900], 0.08)}`,
    `0px 8px 16px ${alpha(colors.grey[900], 0.1)}`,
    `0px 12px 24px ${alpha(colors.grey[900], 0.12)}`,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: `0px 4px 12px ${alpha(colors.primary.main, 0.2)}`,
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: `0px 6px 16px ${alpha(colors.primary.main, 0.3)}`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: `0px 2px 8px ${alpha(colors.grey[900], 0.08)}`,
          border: `1px solid ${colors.grey[200]}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: `0px 8px 24px ${alpha(colors.grey[900], 0.12)}`,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0px 2px 8px ${alpha(colors.grey[900], 0.08)}`,
        },
        elevation2: {
          boxShadow: `0px 4px 12px ${alpha(colors.grey[900], 0.1)}`,
        },
        elevation3: {
          boxShadow: `0px 8px 24px ${alpha(colors.grey[900], 0.12)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.light,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
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
          borderRadius: 6,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success.main, 0.1),
          color: colors.success.dark,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning.main, 0.1),
          color: colors.warning.dark,
        },
        standardError: {
          backgroundColor: alpha(colors.error.main, 0.1),
          color: colors.error.dark,
        },
        standardInfo: {
          backgroundColor: alpha(colors.info.main, 0.1),
          color: colors.info.dark,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `0px 1px 3px ${alpha(colors.grey[900], 0.1)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.grey[200]}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: colors.grey[50],
          color: colors.grey[700],
        },
      },
    },
  },
});

