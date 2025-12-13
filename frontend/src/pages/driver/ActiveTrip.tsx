import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { tripsService, type Trip } from '../../services/trips.service';
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

// Trip display type for UI
interface CurrentTrip {
    id: string;
    status: 'heading_to_pickup' | 'at_pickup' | 'in_progress' | 'arriving';
    customer: {
        name: string;
        phone: string;
        rating: number;
        totalTrips: number;
    };
    pickup: {
        address: string;
        lat: number;
        lng: number;
    };
    destination: {
        address: string;
        lat: number;
        lng: number;
    };
    fare: number;
    distance: number;
    estimatedTime: number;
    paymentMethod: string;
    driverLocation: {
        lat: number;
        lng: number;
    };
}

const tripStatuses = {
    heading_to_pickup: { label: 'Heading to Pickup', color: 'primary', action: 'Arrived at Pickup' },
    at_pickup: { label: 'At Pickup Location', color: 'warning', action: 'Start Trip' },
    in_progress: { label: 'Trip in Progress', color: 'success', action: 'Complete Trip' },
    arriving: { label: 'Arriving at Destination', color: 'accent', action: 'End Trip' },
};

// Map API trip status to UI status
function mapTripStatus(apiStatus: Trip['status']): CurrentTrip['status'] {
    switch (apiStatus) {
        case 'accepted':
            return 'heading_to_pickup';
        case 'started':
            return 'in_progress';
        case 'pending':
        case 'completed':
        case 'cancelled':
        default:
            return 'in_progress';
    }
}

// Transform API trip to UI trip
function transformTrip(apiTrip: Trip): CurrentTrip {
    return {
        id: apiTrip.id,
        status: mapTripStatus(apiTrip.status),
        customer: {
            name: apiTrip.customer
                ? `${apiTrip.customer.first_name} ${apiTrip.customer.last_name}`
                : 'Customer',
            phone: apiTrip.customer?.phone || '',
            rating: 4.5, // Default rating
            totalTrips: 0,
        },
        pickup: {
            address: apiTrip.pickup_address,
            lat: apiTrip.pickup_lat,
            lng: apiTrip.pickup_lng,
        },
        destination: {
            address: apiTrip.destination_address,
            lat: apiTrip.destination_lat,
            lng: apiTrip.destination_lng,
        },
        fare: apiTrip.estimated_fare,
        distance: apiTrip.distance_km,
        estimatedTime: apiTrip.estimated_duration_minutes,
        paymentMethod: 'Cash',
        driverLocation: {
            lat: apiTrip.pickup_lat, // Use pickup as initial driver location
            lng: apiTrip.pickup_lng,
        },
    };
}

export function ActiveTrip() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState<CurrentTrip | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Helper to validate if trip has valid coordinates
    const isValidTrip = (tripData: CurrentTrip): boolean => {
        return (
            typeof tripData.pickup?.lat === 'number' && !isNaN(tripData.pickup.lat) &&
            typeof tripData.pickup?.lng === 'number' && !isNaN(tripData.pickup.lng) &&
            typeof tripData.destination?.lat === 'number' && !isNaN(tripData.destination.lat) &&
            typeof tripData.destination?.lng === 'number' && !isNaN(tripData.destination.lng)
        );
    };

    // Fetch active trip on mount
    useEffect(() => {
        const fetchActiveTrip = async () => {
            try {
                setIsLoading(true);
                // Fetch trips with pending/accepted/started status
                const trips = await tripsService.findAll({ status: 'started' });
                if (trips.length > 0) {
                    const transformed = transformTrip(trips[0]);
                    if (isValidTrip(transformed)) {
                        setTrip(transformed);
                    } else {
                        setTrip(null); // Invalid coordinates, treat as no trip
                    }
                } else {
                    // Check for accepted trips
                    const acceptedTrips = await tripsService.findAll({ status: 'accepted' });
                    if (acceptedTrips.length > 0) {
                        const transformed = transformTrip(acceptedTrips[0]);
                        if (isValidTrip(transformed)) {
                            setTrip(transformed);
                        } else {
                            setTrip(null); // Invalid coordinates, treat as no trip
                        }
                    } else {
                        setTrip(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching active trip:', error);
                setTrip(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActiveTrip();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)]">
                <PageLoader message="Loading trip..." />
            </div>
        );
    }

    // Show empty state when no active trip
    if (!trip) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Trip</h2>
                    <p className="text-gray-500 mb-6">
                        You don't have an active trip right now. Wait for a new booking or go online to receive trip requests.
                    </p>
                    <Button onClick={() => navigate('/driver')}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // Use driver location or default to pickup location
    const driverLat = trip.driverLocation?.lat ?? trip.pickup.lat;
    const driverLng = trip.driverLocation?.lng ?? trip.pickup.lng;

    const routeCoords: [number, number][] = [
        [driverLat, driverLng],
        [trip.pickup.lat, trip.pickup.lng],
        [trip.destination.lat, trip.destination.lng],
    ];

    const statusConfig = tripStatuses[trip.status];

    const advanceStatus = async () => {
        const statusOrder: CurrentTrip['status'][] = ['heading_to_pickup', 'at_pickup', 'in_progress', 'arriving'];
        const currentIndex = statusOrder.indexOf(trip.status);

        try {
            setIsProcessing(true);

            if (trip.status === 'at_pickup') {
                // Start the trip - would need OTP verification in real implementation
                await tripsService.start(trip.id, '0000');
                setTrip({ ...trip, status: 'in_progress' });
            } else if (trip.status === 'arriving' || trip.status === 'in_progress') {
                // Complete the trip
                await tripsService.complete(trip.id, trip.fare);
                navigate('/driver/trip-complete');
            } else if (currentIndex < statusOrder.length - 1) {
                // For local status transitions (heading_to_pickup -> at_pickup)
                setTrip({ ...trip, status: statusOrder[currentIndex + 1] });
            }
        } catch (error) {
            console.error('Error advancing trip status:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelTrip = async (reason: string) => {
        try {
            setIsProcessing(true);
            setCancelReason(reason);
            await tripsService.cancel(trip.id, reason);
            setShowCancelModal(false);
            navigate('/driver');
        } catch (error) {
            console.error('Error cancelling trip:', error);
        } finally {
            setIsProcessing(false);
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
                    <Marker position={[driverLat, driverLng]} icon={driverIcon} />
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
                                className={`w-full p-3 text-left rounded-lg border transition-colors ${cancelReason === reason
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => setCancelReason(reason)}
                                disabled={isProcessing}
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" fullWidth onClick={() => setShowCancelModal(false)} disabled={isProcessing}>
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
