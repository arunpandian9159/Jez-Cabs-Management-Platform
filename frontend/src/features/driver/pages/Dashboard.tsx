import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Clock,
  DollarSign,
  Star,
  Navigation,
  Power,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import { cn, formatCurrency } from '@/shared/utils';
import { useDriverDashboard } from '../hooks/useDriverDashboard';
import { ROUTES } from '@/shared/constants';
import { DriverPageHeader } from '../components/DriverPageHeader';
import { DriverStatCard } from '../components/DriverStatCard';

export function DriverDashboard() {
  const {
    isOnline,
    driverStats,
    recentTrips,
    showTripRequest,
    isLoading,
    error,
    currentRequest,
    verificationStatus,
    isVerified,
    onboardingRequired,
    setShowTripRequest,
    handleToggleOnline,
  } = useDriverDashboard();

  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  // Redirect to onboarding if profile is not submitted
  if (onboardingRequired) {
    return <Navigate to={ROUTES.DRIVER.ONBOARDING} replace />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center mx-auto mb-4"
          >
            <XCircle className="w-10 h-10 text-error-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Show pending verification message if not verified
  if (!isVerified && verificationStatus) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" className="text-center overflow-hidden relative">
            {/* Status Icon */}
            <div className="mb-6">
              {verificationStatus.status === 'pending' && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl"
                >
                  <Clock className="w-12 h-12 text-white" />
                </motion.div>
              )}
              {verificationStatus.status === 'rejected' && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-xl"
                >
                  <XCircle className="w-12 h-12 text-white" />
                </motion.div>
              )}
            </div>

            {/* Title and Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {verificationStatus.status === 'pending'
                ? 'Verification in Progress'
                : 'Verification Rejected'}
            </h1>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {verificationStatus.status === 'pending'
                ? 'Your profile and documents are being reviewed by our team. This usually takes 24-48 hours. You will be able to accept rides once your verification is complete.'
                : 'Unfortunately, your verification was not approved. Please review the feedback below and resubmit your documents.'}
            </p>

            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <Badge
                variant={verificationStatus.status === 'pending' ? 'warning' : 'error'}
                size="md"
                className="px-4 py-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                {verificationStatus.status === 'pending'
                  ? 'Pending Verification'
                  : 'Verification Rejected'}
              </Badge>
            </div>

            {/* Pending Documents */}
            {verificationStatus.pendingDocuments.length > 0 && verificationStatus.status === 'pending' && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Documents Under Review</h3>
                </div>
                <ul className="space-y-2">
                  {verificationStatus.pendingDocuments.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-sm text-amber-800">
                      <Clock className="w-4 h-4" />
                      <span className="capitalize">{doc.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rejected Documents */}
            {verificationStatus.rejectedDocuments.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Documents Rejected</h3>
                </div>
                <ul className="space-y-3">
                  {verificationStatus.rejectedDocuments.map((doc) => (
                    <li key={doc.type} className="text-sm">
                      <div className="font-medium text-red-800 capitalize">{doc.type.replace(/_/g, ' ')}</div>
                      <div className="text-red-600">{doc.reason}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {verificationStatus.status === 'rejected' && (
                <Link to={ROUTES.DRIVER.ONBOARDING}>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Resubmit Documents
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => window.location.reload()}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Need Help?</p>
                <p className="text-sm text-blue-700 mt-1">
                  If you have any questions about the verification process, please contact our support team at{' '}
                  <a href="mailto:support@jezcabs.com" className="underline font-medium">support@jezcabs.com</a>
                </p>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 opacity-50 blur-3xl" />
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Online Toggle */}
      <DriverPageHeader
        title="Welcome back, Driver!"
        subtitle={isOnline ? "You're online and ready for trips" : "You're currently offline"}
        icon={LayoutDashboard}
        iconColor={isOnline ? 'success' : 'primary'}
        action={
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={isOnline ? 'primary' : 'outline'}
              size="lg"
              leftIcon={<Power className="w-5 h-5 md:mr-0" />}
              onClick={handleToggleOnline}
              className={cn(
                'px-3 md:px-4',
                isOnline && 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-lg'
              )}
            >
              <span className="hidden md:inline">{isOnline ? 'Online' : 'Go Online'}</span>
            </Button>
          </motion.div>
        }
      />

      {/* Trip Request Popup */}
      {showTripRequest && currentRequest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          <Card
            padding="lg"
            className="border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-accent-50 overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg"
                >
                  <Navigation className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    New Trip Request
                  </h3>
                  <p className="text-sm text-primary-600 font-medium">
                    Expires in {currentRequest.expiresIn}s
                  </p>
                </div>
              </div>
              <Badge variant="primary" className="px-3 py-1">{currentRequest.tripType}</Badge>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-success-500 mt-1.5 ring-4 ring-success-100" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pickup</p>
                  <p className="font-medium text-gray-900">
                    {currentRequest.pickup}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-error-500 mt-1.5 ring-4 ring-error-100" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Destination</p>
                  <p className="font-medium text-gray-900">
                    {currentRequest.destination}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="text-center">
                <p className="text-xl font-bold text-success-600">
                  {formatCurrency(currentRequest.estimatedFare)}
                </p>
                <p className="text-xs text-gray-500 font-medium">Est. Fare</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xl font-bold text-gray-900">
                  {currentRequest.distance} km
                </p>
                <p className="text-xs text-gray-500 font-medium">Distance</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {currentRequest.estimatedTime} min
                </p>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm">
              <Avatar size="md" name={currentRequest.customerName} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {currentRequest.customerName}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                  <span className="font-medium">{currentRequest.customerRating}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<XCircle className="w-5 h-5" />}
                onClick={() => setShowTripRequest(false)}
              >
                Decline
              </Button>
              <Button
                fullWidth
                leftIcon={<CheckCircle className="w-5 h-5" />}
                className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700"
              >
                Accept
              </Button>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary-200 to-accent-200 opacity-50 blur-2xl" />
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <DriverStatCard
          label="Today's Earnings"
          value={formatCurrency(driverStats.todayEarnings)}
          icon={DollarSign}
          color="success"
          delay={0.1}
        />
        <DriverStatCard
          label="Total Trips"
          value={driverStats.totalTrips}
          icon={Car}
          color="primary"
          delay={0.15}
        />
        <DriverStatCard
          label="Rating"
          value={driverStats.rating}
          icon={Star}
          color="warning"
          delay={0.2}
        />
        <DriverStatCard
          label="Online Today"
          value={`${driverStats.onlineHours}h`}
          icon={Clock}
          color="accent"
          delay={0.25}
        />
      </motion.div>

      {/* Earnings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card
          padding="lg"
          className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white overflow-hidden relative"
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Earnings Overview</h3>
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-white/70 text-xs font-medium mb-1">Today</p>
              <p className="text-2xl font-bold">
                {formatCurrency(driverStats.todayEarnings)}
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-white/70 text-xs font-medium mb-1">This Week</p>
              <p className="text-2xl font-bold">
                {formatCurrency(driverStats.weeklyEarnings)}
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-white/70 text-xs font-medium mb-1">This Month</p>
              <p className="text-2xl font-bold">
                {formatCurrency(driverStats.monthlyEarnings)}
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-accent-400/20 blur-2xl" />
        </Card>
      </motion.div>

      {/* Performance Metrics & Recent Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Card padding="md" className="overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Performance Metrics
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Acceptance Rate</span>
                <span className="font-bold text-gray-900">
                  {driverStats.acceptanceRate}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${driverStats.acceptanceRate}%` }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Completion Rate</span>
                <span className="font-bold text-gray-900">
                  {driverStats.completionRate}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${driverStats.completionRate}%` }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card padding="md" className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Recent Trips</h3>
            </div>
            <Link
              to="/driver/trips"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center shadow-md flex-shrink-0',
                      trip.status === 'completed'
                        ? 'bg-gradient-to-br from-success-500 to-success-600'
                        : 'bg-gradient-to-br from-error-500 to-error-600'
                    )}
                  >
                    {trip.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {trip.pickup} → {trip.destination}
                    </p>
                    <p className="text-xs text-gray-500">{trip.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {trip.status === 'completed' ? (
                    <>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(trip.fare)}
                      </p>
                      {trip.rating && (
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                          <span className="text-xs text-gray-500">
                            {trip.rating}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <Badge variant="error" size="sm">
                      Cancelled
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
