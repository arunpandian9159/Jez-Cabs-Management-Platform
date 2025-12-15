import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Star,
  DollarSign,
  Navigation2,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { useActiveTrip } from '../hooks/useActiveTrip';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const pickupIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cancelReasons = [
  'Customer not at pickup',
  'Customer requested cancellation',
  'Vehicle issue',
  'Emergency',
  'Other',
];

export function ActiveTrip() {
  const {
    trip,
    showCancelModal,
    isLoading,
    isProcessing,
    cancelReason,
    driverLat,
    driverLng,
    routeCoords,
    statusConfig,
    setShowCancelModal,
    setCancelReason,
    advanceStatus,
    handleCancelTrip,
    goToDashboard,
  } = useActiveTrip();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem-3rem)]">
        <PageLoader message="Loading trip..." />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-[calc(100vh-4rem-3rem)] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Navigation2 className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Active Trip
          </h2>
          <p className="text-gray-500 mb-6">
            You don't have an active trip right now. Wait for a new booking or
            go online to receive trip requests.
          </p>
          <Button onClick={goToDashboard}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-3rem)] flex flex-col overflow-hidden">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[trip.pickup.lat, trip.pickup.lng]}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[driverLat, driverLng]} icon={driverIcon} />
          <Marker
            position={[trip.pickup.lat, trip.pickup.lng]}
            icon={pickupIcon}
          />
          <Marker
            position={[trip.destination.lat, trip.destination.lng]}
            icon={destinationIcon}
          />
          <Polyline positions={routeCoords} color="#6366f1" weight={4} />
        </MapContainer>

        {/* Status Badge */}
        {statusConfig && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 z-[1000]"
          >
            <Card padding="sm" className="flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-3 h-3 rounded-full bg-${statusConfig.color}-500`}
                />
                <span className="font-semibold text-gray-900">
                  {statusConfig.label}
                </span>
              </div>
              <Badge
                variant={
                  statusConfig.color as 'primary' | 'success' | 'warning'
                }
                className="px-3"
              >
                {trip.distance} km • {trip.estimatedTime} min
              </Badge>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Bottom Panel */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white border-t border-gray-200 p-4 space-y-4 shadow-2xl"
      >
        {/* Customer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Avatar size="lg" name={trip.customer.name} />
            </motion.div>
            <div>
              <p className="font-semibold text-gray-900">
                {trip.customer.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                <span className="font-medium">{trip.customer.rating}</span>
                <span>•</span>
                <span>{trip.customer.totalTrips} trips</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Phone className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon" className="rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Trip Details */}
        <Card padding="sm" className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-success-500 mt-1 ring-4 ring-success-100" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pickup</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {trip.pickup.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-error-500 mt-1 ring-4 ring-error-100" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Destination</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {trip.destination.address}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Fare Info */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-primary-900">Estimated Fare</span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-900">
              {formatCurrency(trip.fare)}
            </p>
            <p className="text-xs text-primary-600 font-medium">{trip.paymentMethod}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCancelModal(true)}
            leftIcon={<AlertTriangle className="w-4 h-4" />}
            className="border-error-200 text-error-600 hover:bg-error-50"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={advanceStatus}
            leftIcon={<CheckCircle className="w-5 h-5" />}
            className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-lg"
            disabled={isProcessing}
            loading={isProcessing}
          >
            {statusConfig?.action}
          </Button>
        </div>
      </motion.div>

      {/* Cancel Modal */}
      <Modal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Cancel Trip"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this trip? This may affect your
            acceptance rate.
          </p>
          <div className="space-y-2">
            {cancelReasons.map((reason, index) => (
              <motion.button
                key={reason}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${cancelReason === reason ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setCancelReason(reason)}
                disabled={isProcessing}
              >
                <span className={cancelReason === reason ? 'font-medium text-primary-700' : 'text-gray-700'}>
                  {reason}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCancelModal(false)}
              disabled={isProcessing}
            >
              Go Back
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => handleCancelTrip(cancelReason || 'Other')}
              disabled={isProcessing || !cancelReason}
              loading={isProcessing}
            >
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
