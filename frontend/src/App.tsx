import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { LoadingSkeleton } from './components/LoadingSkeleton';

// Auth Pages - Loaded immediately
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Public Pages - Loaded immediately
import { Home } from './pages/Home';

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CabList = lazy(() => import('./pages/Cabs/CabList').then(m => ({ default: m.CabList })));
const CabForm = lazy(() => import('./pages/Cabs/CabForm').then(m => ({ default: m.CabForm })));
const BookingList = lazy(() => import('./pages/Bookings/BookingList').then(m => ({ default: m.BookingList })));
const BookingForm = lazy(() => import('./pages/Bookings/BookingForm').then(m => ({ default: m.BookingForm })));
const DriverList = lazy(() => import('./pages/Drivers/DriverList').then(m => ({ default: m.DriverList })));
const DriverForm = lazy(() => import('./pages/Drivers/DriverForm').then(m => ({ default: m.DriverForm })));
const ChecklistList = lazy(() => import('./pages/Checklists/ChecklistList').then(m => ({ default: m.ChecklistList })));
const InvoiceList = lazy(() => import('./pages/Invoices/InvoiceList').then(m => ({ default: m.InvoiceList })));
const InvoiceForm = lazy(() => import('./pages/Invoices/InvoiceForm').then(m => ({ default: m.InvoiceForm })));
const Reports = lazy(() => import('./pages/Reports/Reports').then(m => ({ default: m.Reports })));

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
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
        >
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
                      <Dashboard />
                    </Suspense>
                  }
                />

                {/* Fleet Management */}
                <Route
                  path="cabs"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="list" />}>
                      <CabList />
                    </Suspense>
                  }
                />
                <Route
                  path="cabs/new"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <CabForm />
                    </Suspense>
                  }
                />
                <Route
                  path="cabs/:id/edit"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <CabForm />
                    </Suspense>
                  }
                />

                {/* Bookings */}
                <Route
                  path="bookings"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="list" />}>
                      <BookingList />
                    </Suspense>
                  }
                />
                <Route
                  path="bookings/new"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <BookingForm />
                    </Suspense>
                  }
                />
                <Route
                  path="bookings/:id/edit"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <BookingForm />
                    </Suspense>
                  }
                />

                {/* Drivers */}
                <Route
                  path="drivers"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="list" />}>
                      <DriverList />
                    </Suspense>
                  }
                />
                <Route
                  path="drivers/new"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <DriverForm />
                    </Suspense>
                  }
                />
                <Route
                  path="drivers/:id/edit"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <DriverForm />
                    </Suspense>
                  }
                />

                {/* Checklists */}
                <Route
                  path="checklists"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="list" />}>
                      <ChecklistList />
                    </Suspense>
                  }
                />

                {/* Invoices */}
                <Route
                  path="invoices"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="list" />}>
                      <InvoiceList />
                    </Suspense>
                  }
                />
                <Route
                  path="invoices/new"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <InvoiceForm />
                    </Suspense>
                  }
                />
                <Route
                  path="invoices/:id/edit"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="form" />}>
                      <InvoiceForm />
                    </Suspense>
                  }
                />

                {/* Reports */}
                <Route
                  path="reports"
                  element={
                    <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
                      <Reports />
                    </Suspense>
                  }
                />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
