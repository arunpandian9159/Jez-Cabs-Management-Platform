import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Dashboard
import { Dashboard } from './pages/Dashboard';

// Fleet Management
import { CabList } from './pages/Cabs/CabList';
import { CabForm } from './pages/Cabs/CabForm';

// Bookings
import { BookingList } from './pages/Bookings/BookingList';
import { BookingForm } from './pages/Bookings/BookingForm';

// Drivers
import { DriverList } from './pages/Drivers/DriverList';
import { DriverForm } from './pages/Drivers/DriverForm';

// Checklists
import { ChecklistList } from './pages/Checklists/ChecklistList';

// Invoices
import { InvoiceList } from './pages/Invoices/InvoiceList';
import { InvoiceForm } from './pages/Invoices/InvoiceForm';

// Reports
import { Reports } from './pages/Reports/Reports';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Fleet Management */}
                <Route path="cabs" element={<CabList />} />
                <Route path="cabs/new" element={<CabForm />} />
                <Route path="cabs/:id/edit" element={<CabForm />} />

                {/* Bookings */}
                <Route path="bookings" element={<BookingList />} />
                <Route path="bookings/new" element={<BookingForm />} />
                <Route path="bookings/:id/edit" element={<BookingForm />} />

                {/* Drivers */}
                <Route path="drivers" element={<DriverList />} />
                <Route path="drivers/new" element={<DriverForm />} />
                <Route path="drivers/:id/edit" element={<DriverForm />} />

                {/* Checklists */}
                <Route path="checklists" element={<ChecklistList />} />

                {/* Invoices */}
                <Route path="invoices" element={<InvoiceList />} />
                <Route path="invoices/new" element={<InvoiceForm />} />
                <Route path="invoices/:id/edit" element={<InvoiceForm />} />

                {/* Reports */}
                <Route path="reports" element={<Reports />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
