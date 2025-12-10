import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { PublicLayout, CustomerLayout, DriverLayout, CabOwnerLayout } from './components/layout';
import { Home, Login, Register } from './pages/public';
import { CustomerDashboard, LocationEntry, CabSelection, DriverSearch, LiveTracking, TripComplete, BrowseCabs, ActiveRentals, PlanTrip, TripHistory, Payments, Disputes } from './pages/customer';
import { DriverDashboard, ActiveTrip, TripHistory as DriverTripHistory, Earnings, DriverProfile, DriverSettings } from './pages/driver';
import { OwnerDashboard, ManageCabs, ManageDrivers, OwnerEarnings, OwnerSettings, Contracts } from './pages/owner';
import { ROUTES } from './lib/constants';

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
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route element={<PublicOnlyRoute />}>
                            <Route element={<PublicLayout />}>
                                <Route path={ROUTES.HOME} element={<Home />} />
                                <Route path={ROUTES.LOGIN} element={<Login />} />
                                <Route path={ROUTES.REGISTER} element={<Register />} />
                                <Route path={ROUTES.DRIVER_REGISTER} element={<PlaceholderPage title="Driver Registration" />} />
                                <Route path={ROUTES.OWNER_REGISTER} element={<PlaceholderPage title="Cab Owner Registration" />} />
                            </Route>
                        </Route>

                        {/* Customer routes */}
                        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                            <Route element={<CustomerLayout />}>
                                <Route path={ROUTES.CUSTOMER.DASHBOARD} element={<CustomerDashboard />} />
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
                                <Route path={ROUTES.CUSTOMER.PROFILE} element={<PlaceholderPage title="Profile" />} />
                            </Route>
                        </Route>

                        {/* Driver routes */}
                        <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
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

                        {/* Admin routes - placeholder */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/*" element={<PlaceholderPage title="Admin Dashboard" />} />
                        </Route>

                        {/* Support routes - placeholder */}
                        <Route element={<ProtectedRoute allowedRoles={['support']} />}>
                            <Route path="/support/*" element={<PlaceholderPage title="Support Dashboard" />} />
                        </Route>

                        {/* 404 - Redirect to home */}
                        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
