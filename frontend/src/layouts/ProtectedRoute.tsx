import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { LoadingOverlay } from '@/components/ui/Loading';
import { ROUTES } from '@/shared/constants';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard
    const roleDashboards: Record<UserRole, string> = {
      customer: ROUTES.CUSTOMER.DASHBOARD,
      driver: ROUTES.DRIVER.DASHBOARD,
      cab_owner: ROUTES.OWNER.DASHBOARD,
      trip_planner: ROUTES.PLANNER.DASHBOARD,
      admin: ROUTES.ADMIN.DASHBOARD,
      support: ROUTES.SUPPORT.DASHBOARD,
    };

    return <Navigate to={roleDashboards[user.role as UserRole]} replace />;
  }

  return <Outlet />;
}

// Route that redirects authenticated users away (for login/register pages)
export function PublicOnlyRoute({ redirectTo }: { redirectTo?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay message="Loading..." />;
  }

  if (isAuthenticated && user) {
    // Redirect to where they came from or their dashboard
    const from = location.state?.from?.pathname;
    const roleDashboards: Record<UserRole, string> = {
      customer: ROUTES.CUSTOMER.DASHBOARD,
      driver: ROUTES.DRIVER.DASHBOARD,
      cab_owner: ROUTES.OWNER.DASHBOARD,
      trip_planner: ROUTES.PLANNER.DASHBOARD,
      admin: ROUTES.ADMIN.DASHBOARD,
      support: ROUTES.SUPPORT.DASHBOARD,
    };

    return (
      <Navigate
        to={from || redirectTo || roleDashboards[user.role as UserRole]}
        replace
      />
    );
  }

  return <Outlet />;
}
