import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
    Phone,
    MessageSquare,
    Shield,
    Star,
    AlertTriangle,
    Share2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { cn, formatCurrency, formatDuration } from '../../../lib/utils';
import { ROUTES, MAP_CONFIG } from '../../../lib/constants';

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const carIcon = new L.DivIcon({
    className: 'custom-car-icon',
    html: `<div style="font-size: 24px; transform: rotate(45deg);">🚗</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

type TripStatus = 'pickup' | 'in_progress' | 'arriving';

export function LiveTracking() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tripStatus, setTripStatus] = useState<TripStatus>('pickup');
    const [showSOS, setShowSOS] = useState(false);
    const [eta, setEta] = useState(25);
    const [distance, setDistance] = useState(10.2);

    const { pickup, destination, cabType, fare, driver } = location.state || {};

    // TODO: API Integration - Driver position should come from WebSocket
    // WebSocket endpoint: ws://{host}/api/v1/trips/{tripId}/location
    const [driverPosition, setDriverPosition] = useState({
        lat: pickup?.lat || 12.9352,
        lng: pickup?.lng || 77.6245,
    });

    // Simulate driver movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPosition((prev) => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.001,
                lng: prev.lng + (Math.random() - 0.5) * 0.001,
            }));

            // Decrease ETA
            setEta((prev) => Math.max(0, prev - 0.1));
            setDistance((prev) => Math.max(0, prev - 0.05));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Simulate trip progression
    useEffect(() => {
        if (tripStatus === 'pickup') {
            const timer = setTimeout(() => setTripStatus('in_progress'), 10000);
            return () => clearTimeout(timer);
        }
        if (tripStatus === 'in_progress' && eta <= 5) {
            setTripStatus('arriving');
        }
    }, [tripStatus, eta]);

    const handleEndTrip = () => {
        navigate(ROUTES.CUSTOMER.BOOK_COMPLETE, {
            state: { pickup, destination, cabType, fare, driver },
        });
    };

    const handleSOS = () => {
        setShowSOS(true);
    };

    const triggerSOS = () => {
        // In real app, this would trigger emergency services
        alert('SOS triggered! Emergency services have been notified.');
        setShowSOS(false);
    };

    // Generate a simple route line
    const routeCoords: [number, number][] = pickup && destination ? [
        [pickup.lat, pickup.lng],
        [driverPosition.lat, driverPosition.lng],
        [destination.lat, destination.lng],
    ] : [];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Map */}
            <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200">
                <MapContainer
                    center={[driverPosition.lat, driverPosition.lng]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution={MAP_CONFIG.attribution}
                        url={MAP_CONFIG.tileLayer}
                    />

                    {/* Route line */}
                    {routeCoords.length > 0 && (
                        <Polyline
                            positions={routeCoords}
                            pathOptions={{ color: '#6366f1', weight: 4, dashArray: '10, 10' }}
                        />
                    )}

                    {/* Pickup marker */}
                    {pickup?.lat && pickup?.lng && (
                        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
                    )}

                    {/* Destination marker */}
                    {destination?.lat && destination?.lng && (
                        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />
                    )}

                    {/* Driver car marker */}
                    <Marker position={[driverPosition.lat, driverPosition.lng]} icon={carIcon} />
                </MapContainer>

                {/* Status overlay */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-4 right-4 z-[1000]"
                >
                    <Card padding="sm" className="bg-white/95 backdrop-blur shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'w-3 h-3 rounded-full animate-pulse',
                                    tripStatus === 'pickup' && 'bg-info-500',
                                    tripStatus === 'in_progress' && 'bg-success-500',
                                    tripStatus === 'arriving' && 'bg-warning-500'
                                )} />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {tripStatus === 'pickup' && 'Heading to pickup'}
                                        {tripStatus === 'in_progress' && 'Trip in progress'}
                                        {tripStatus === 'arriving' && 'Arriving soon'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDuration(eta)} • {distance.toFixed(1)} km remaining
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    tripStatus === 'pickup' ? 'info' :
                                        tripStatus === 'in_progress' ? 'success' : 'warning'
                                }
                            >
                                {tripStatus === 'pickup' && 'Pickup'}
                                {tripStatus === 'in_progress' && 'En Route'}
                                {tripStatus === 'arriving' && 'Almost There'}
                            </Badge>
                        </div>
                    </Card>
                </motion.div>

                {/* SOS button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleSOS}
                    className="absolute bottom-4 right-4 z-[1000] w-14 h-14 rounded-full bg-error-600 text-white shadow-lg flex items-center justify-center hover:bg-error-700 transition-colors"
                >
                    <Shield className="w-6 h-6" />
                </motion.button>

                {/* Share trip button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute bottom-4 right-20 z-[1000] w-12 h-12 rounded-full bg-white text-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                    <Share2 className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Bottom panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
            >
                <Card padding="md">
                    {/* Driver info */}
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar
                            size="lg"
                            src={driver?.photo}
                            name={driver?.name || 'Driver'}
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                                {driver?.name || 'Your Driver'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                <span>{driver?.rating || 4.8}</span>
                                <span>•</span>
                                <span>{driver?.cab?.registrationNumber || 'KA 01 AB 1234'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(`tel:${driver?.phone || '+919876543210'}`)}
                            >
                                <Phone className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Trip route */}
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                        <div className="flex flex-col items-center gap-1 pt-1">
                            <div className="w-2 h-2 rounded-full bg-success-500" />
                            <div className="w-0.5 h-6 bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-error-500" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Pickup</p>
                                <p className="text-sm text-gray-900 truncate">
                                    {pickup?.address || 'Current Location'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Destination</p>
                                <p className="text-sm text-gray-900 truncate">
                                    {destination?.address || 'Destination'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">
                                {formatCurrency(fare?.total || 250)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDuration(eta)}
                            </p>
                        </div>
                    </div>

                    {/* End trip button (for demo) */}
                    <Button fullWidth size="lg" onClick={handleEndTrip}>
                        End Trip (Demo)
                    </Button>
                </Card>
            </motion.div>

            {/* SOS Modal */}
            <Modal
                open={showSOS}
                onOpenChange={setShowSOS}
                title="Emergency SOS"
                description="Are you in an emergency situation?"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-error-50 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-error-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-error-900">Emergency Services</p>
                                <p className="text-sm text-error-700">
                                    This will alert emergency services and share your live location.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => setShowSOS(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={triggerSOS}>
                            <Shield className="w-4 h-4 mr-2" />
                            Trigger SOS
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Quick actions:</p>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                fullWidth
                                leftIcon={<Phone className="w-4 h-4" />}
                                onClick={() => window.open('tel:100')}
                            >
                                Call Police (100)
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                leftIcon={<Share2 className="w-4 h-4" />}
                            >
                                Share Trip with Emergency Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
