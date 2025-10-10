import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link,
} from '@mui/material';

export const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🚕
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Jez Cabs
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🚕
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Jez Cabs Management Platform
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
              Streamline your cab business operations with our comprehensive management platform.
              Manage fleets, drivers, bookings, and analytics all in one place.
            </Typography>
          </Box>

          <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3, flexWrap: 'wrap' }}>
              <Link
                component={RouterLink}
                to="/login"
                color="grey.400"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                Login
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                color="grey.400"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                Sign Up
              </Link>
            </Box>

            <Typography variant="body2" color="grey.500" sx={{ textAlign: 'center' }}>
              © {new Date().getFullYear()} Jez Cabs Management Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
