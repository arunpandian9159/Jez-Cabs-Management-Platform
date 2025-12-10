import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Phone,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Star,
    DollarSign,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../lib/utils';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Mock trip data
const currentTrip = {
    id: 'trip1',
    status: 'heading_to_pickup', // heading_to_pickup, at_pickup, in_progress, arriving
    customer: {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        rating: 4.7,
        totalTrips: 45,
    },
    pickup: {
        address: 'Koramangala 4th Block, Bangalore',
        lat: 12.9352,
        lng: 77.6245,
    },
    destination: {
        address: 'Whitefield Tech Park, Bangalore',
        lat: 12.9698,
        lng: 77.7500,
    },
    fare: 380,
    distance: 18.5,
    estimatedTime: 45,
    paymentMethod: 'Cash',
    driverLocation: {
        lat: 12.9300,
        lng: 77.6200,
    },
};

const tripStatuses = {
    heading_to_pickup: { label: 'Heading to Pickup', color: 'primary', action: 'Arrived at Pickup' },
    at_pickup: { label: 'At Pickup Location', color: 'warning', action: 'Start Trip' },
    in_progress: { label: 'Trip in Progress', color: 'success', action: 'Complete Trip' },
    arriving: { label: 'Arriving at Destination', color: 'accent', action: 'End Trip' },
};

export function ActiveTrip() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState(currentTrip);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const routeCoords: [number, number][] = [
        [trip.driverLocation.lat, trip.driverLocation.lng],
        [trip.pickup.lat, trip.pickup.lng],
        [trip.destination.lat, trip.destination.lng],
    ];

    const statusConfig = tripStatuses[trip.status as keyof typeof tripStatuses];

    const advanceStatus = () => {
        const statusOrder = ['heading_to_pickup', 'at_pickup', 'in_progress', 'arriving'];
        const currentIndex = statusOrder.indexOf(trip.status);
        if (currentIndex < statusOrder.length - 1) {
            setTrip({ ...trip, status: statusOrder[currentIndex + 1] });
        } else {
            navigate('/driver/trip-complete');
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
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
                    <Marker position={[trip.driverLocation.lat, trip.driverLocation.lng]} icon={driverIcon} />
                    <Marker position={[trip.pickup.lat, trip.pickup.lng]} icon={pickupIcon} />
                    <Marker position={[trip.destination.lat, trip.destination.lng]} icon={destinationIcon} />
                    <Polyline positions={routeCoords} color="#6366f1" weight={4} />
                </MapContainer>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 right-4 z-[1000]">
                    <Card padding="sm" className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${statusConfig.color}-500 animate-pulse`} />
                            <span className="font-medium text-gray-900">{statusConfig.label}</span>
                        </div>
                        <Badge variant={statusConfig.color as 'primary' | 'success' | 'warning'}>
                            {trip.distance} km • {trip.estimatedTime} min
                        </Badge>
                    </Card>
                </div>
            </div>

            {/* Bottom Panel */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="bg-white border-t border-gray-200 p-4 space-y-4"
            >
                {/* Customer Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar size="lg" name={trip.customer.name} />
                        <div>
                            <p className="font-semibold text-gray-900">{trip.customer.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                <span>{trip.customer.rating}</span>
                                <span>•</span>
                                <span>{trip.customer.totalTrips} trips</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <MessageSquare className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Trip Details */}
                <Card padding="sm" className="bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-start gap-2">
                                <div className="w-3 h-3 rounded-full bg-success-500 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">Pickup</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {trip.pickup.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-start gap-2">
                                <div className="w-3 h-3 rounded-full bg-error-500 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">Destination</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {trip.destination.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Fare Info */}
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-primary-900">Estimated Fare</span>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary-900">{formatCurrency(trip.fare)}</p>
                        <p className="text-xs text-primary-600">{trip.paymentMethod}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowCancelModal(true)}
                        leftIcon={<AlertTriangle className="w-4 h-4" />}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        onClick={advanceStatus}
                        leftIcon={<CheckCircle className="w-5 h-5" />}
                        className="bg-success-500 hover:bg-success-600"
                    >
                        {statusConfig.action}
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
                        Are you sure you want to cancel this trip? This may affect your acceptance rate.
                    </p>
                    <div className="space-y-2">
                        {['Customer not at pickup', 'Customer requested cancellation', 'Vehicle issue', 'Emergency', 'Other'].map((reason) => (
                            <button
                                key={reason}
                                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" fullWidth onClick={() => setShowCancelModal(false)}>
                            Go Back
                        </Button>
                        <Button variant="danger" fullWidth onClick={() => navigate('/driver')}>
                            Confirm Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
