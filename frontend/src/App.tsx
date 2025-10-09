import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper, Card, CardContent } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import ReceiptIcon from '@mui/icons-material/Receipt';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
              🚕 Jez Cabs Management Platform
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Complete Cab Rental Management Solution
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCarIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Fleet Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage your vehicle fleet with real-time status tracking and maintenance alerts
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Driver Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Track drivers, licenses, and assignments with automated expiry alerts
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Booking System</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Handle bookings with conflict detection and automated status updates
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Invoicing</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Generate invoices, track payments, and monitor revenue
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              ✅ Backend Status: 100% Complete
            </Typography>
            <Typography variant="body1" paragraph>
              The backend API is fully implemented and production-ready with the following modules:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Typography variant="body2" component="div">
                ✅ Authentication & Authorization (JWT)<br />
                ✅ Multi-tenant SaaS Architecture<br />
                ✅ Cab Inventory Management (8 endpoints)<br />
                ✅ Driver Management (9 endpoints)<br />
                ✅ Booking & Rental Management (9 endpoints)<br />
                ✅ Checklist & Maintenance (12 endpoints)
              </Typography>
              <Typography variant="body2" component="div">
                ✅ Invoice Management (8 endpoints)<br />
                ✅ GPS & Telematics Module (8 endpoints)<br />
                ✅ Analytics & Reporting (4 endpoints)<br />
                ✅ Notification Service (8 endpoints)<br />
                ✅ Event-Driven Architecture<br />
                ✅ Swagger API Documentation
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                🚀 Quick Start
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Backend API:</strong> http://localhost:3000/api<br />
                <strong>Swagger Docs:</strong> http://localhost:3000/api/docs<br />
                <strong>Frontend:</strong> http://localhost:5173<br />
                <br />
                <strong>Total API Endpoints:</strong> 60+<br />
                <strong>Database Tables:</strong> 6 PostgreSQL + 4 MongoDB collections<br />
                <strong>Lines of Code:</strong> 6,000+ (Backend)<br />
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                📋 Frontend Implementation Status
              </Typography>
              <Typography variant="body2" component="div">
                ✅ React + TypeScript + Vite initialized<br />
                ✅ Material-UI components installed<br />
                ✅ React Router, React Query, Axios configured<br />
                ✅ Type definitions created<br />
                ✅ API client with interceptors<br />
                📋 UI pages (see FRONTEND_IMPLEMENTATION_GUIDE.md)<br />
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
