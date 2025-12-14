import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth - from features
import { AuthProvider, AuthModalProvider } from '@/features/auth';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Layouts - from layouts folder
import {
  PublicLayout,
  CustomerLayout,
  DriverLayout,
  CabOwnerLayout,
  AdminLayout,
  ProtectedRoute,
  PublicOnlyRoute,
} from '@/layouts';

// Public pages - from public feature
import { Home } from '@/features/public';

// Customer feature pages
import { CustomerProfile } from '@/features/customer/pages/Profile';
import {
  LocationEntry,
  CabSelection,
  DriverSearch,
  LiveTracking,
  TripComplete,
} from '@/features/booking/components';
import { BrowseCabs, ActiveRentals } from '@/features/rentals/pages';
import { PlanTrip, TripHistory } from '@/features/trips/pages';
import { Payments } from '@/features/payments/pages';
import { Disputes } from '@/features/disputes/pages';
import { EmergencyContacts, SafetyCenter } from '@/features/safety/pages';
import {
  TripExchange,
  ShareRide,
  ExchangeHistory,
} from '@/features/rideshare/pages';
import { PostTrip } from '@/features/customer/pages/PostTrip';

// Driver feature pages
import {
  DriverDashboard,
  ActiveTrip,
  TripHistory as DriverTripHistory,
  Earnings,
  DriverProfile,
  DriverSettings,
  DriverOnboarding,
} from '@/features/driver/pages';

// Owner feature pages
import {
  OwnerDashboard,
  ManageCabs,
  ManageDrivers,
  OwnerEarnings,
  OwnerSettings,
  Contracts,
} from '@/features/owner/pages';

// Admin feature pages
import {
  AdminDashboard,
  AdminDisputes,
  AdminUsers,
  AdminVerification,
} from '@/features/admin/pages';

// Shared utilities
import { ROUTES } from '@/shared/constants';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-500">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthModalProvider>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicOnlyRoute />}>
                  <Route element={<PublicLayout />}>
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.DRIVER_REGISTER} element={<PlaceholderPage title="Driver Registration" />} />
                    <Route path={ROUTES.OWNER_REGISTER} element={<PlaceholderPage title="Cab Owner Registration" />} />
                  </Route>
                </Route>

                {/* Customer routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                  <Route element={<CustomerLayout />}>
                    <Route path={ROUTES.CUSTOMER.BOOK} element={<Navigate to={ROUTES.CUSTOMER.BOOK_LOCATION} replace />} />
                    <Route path={ROUTES.CUSTOMER.BOOK_LOCATION} element={<LocationEntry />} />
                    <Route path={ROUTES.CUSTOMER.BOOK_SELECT_CAB} element={<CabSelection />} />
                    <Route path={ROUTES.CUSTOMER.BOOK_SEARCHING} element={<DriverSearch />} />
                    <Route path={ROUTES.CUSTOMER.BOOK_TRACKING} element={<LiveTracking />} />
                    <Route path={ROUTES.CUSTOMER.BOOK_COMPLETE} element={<TripComplete />} />
                    <Route path={ROUTES.CUSTOMER.RENTALS} element={<Navigate to={ROUTES.CUSTOMER.RENTALS_BROWSE} replace />} />
                    <Route path={ROUTES.CUSTOMER.RENTALS_BROWSE} element={<BrowseCabs />} />
                    <Route path={ROUTES.CUSTOMER.RENTALS_ACTIVE} element={<ActiveRentals />} />
                    <Route path={ROUTES.CUSTOMER.TRIPS} element={<TripHistory />} />
                    <Route path="/customer/trips/plan" element={<PlanTrip />} />
                    <Route path={ROUTES.CUSTOMER.PAYMENTS} element={<Payments />} />
                    <Route path={ROUTES.CUSTOMER.DISPUTES} element={<Disputes />} />
                    <Route path="/customer/safety" element={<SafetyCenter />} />
                    <Route path="/customer/safety/contacts" element={<EmergencyContacts />} />
                    <Route path="/customer/safety/share" element={<ShareRide />} />
                    <Route path="/customer/community" element={<TripExchange />} />
                    <Route path="/customer/community/post" element={<PostTrip />} />
                    <Route path="/customer/community/history" element={<ExchangeHistory />} />
                    <Route path={ROUTES.CUSTOMER.PROFILE} element={<CustomerProfile />} />
                  </Route>
                </Route>

                {/* Driver routes */}
                <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
                  <Route path="/driver/onboarding" element={<DriverOnboarding />} />
                  <Route element={<DriverLayout />}>
                    <Route path="/driver" element={<DriverDashboard />} />
                    <Route path="/driver/trip" element={<ActiveTrip />} />
                    <Route path="/driver/trips" element={<DriverTripHistory />} />
                    <Route path="/driver/earnings" element={<Earnings />} />
                    <Route path="/driver/profile" element={<DriverProfile />} />
                    <Route path="/driver/settings" element={<DriverSettings />} />
                  </Route>
                </Route>

                {/* Cab Owner routes */}
                <Route element={<ProtectedRoute allowedRoles={['cab_owner']} />}>
                  <Route element={<CabOwnerLayout />}>
                    <Route path="/owner" element={<OwnerDashboard />} />
                    <Route path="/owner/cabs" element={<ManageCabs />} />
                    <Route path="/owner/drivers" element={<ManageDrivers />} />
                    <Route path="/owner/earnings" element={<OwnerEarnings />} />
                    <Route path="/owner/contracts" element={<Contracts />} />
                    <Route path="/owner/settings" element={<OwnerSettings />} />
                  </Route>
                </Route>

                {/* Trip Planner routes - placeholder */}
                <Route element={<ProtectedRoute allowedRoles={['trip_planner']} />}>
                  <Route path="/planner/*" element={<PlaceholderPage title="Trip Planner" />} />
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/disputes" element={<AdminDisputes />} />
                    <Route path="/admin/verification" element={<AdminVerification />} />
                    <Route path="/admin/drivers" element={<PlaceholderPage title="Driver Management" />} />
                    <Route path="/admin/cabs" element={<PlaceholderPage title="Vehicle Management" />} />
                    <Route path="/admin/reports" element={<PlaceholderPage title="Reports" />} />
                    <Route path="/admin/settings" element={<PlaceholderPage title="Admin Settings" />} />
                  </Route>
                </Route>

                {/* Support routes - placeholder */}
                <Route element={<ProtectedRoute allowedRoles={['support']} />}>
                  <Route path="/support/*" element={<PlaceholderPage title="Support Dashboard" />} />
                </Route>

                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </Routes>
            </AuthProvider>
          </AuthModalProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
