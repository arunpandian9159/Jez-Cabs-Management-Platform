import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
    MapPin,
    Search,
    Clock,
    Home,
    Plus,
    X,
    ArrowRight,
    Crosshair,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { cn } from '@/shared/utils';
import { ROUTES, MAP_CONFIG } from '@/shared/constants';
import { usersService } from '../../../services';

// Fix for default marker icon in Leaflet with React
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Types for location data
interface SavedAddressDisplay {
    id: string;
    label: string;
    icon: typeof Home;
    address: string;
    lat: number;
    lng: number;
}

interface RecentDestinationDisplay {
    id: string;
    address: string;
    lat: number;
    lng: number;
}

interface LocationState {
    address: string;
    lat: number | null;
    lng: number | null;
}

// Map click handler component
function MapClickHandler({
    onLocationSelect,
    activeField,
}: {
    onLocationSelect: (lat: number, lng: number) => void;
    activeField: 'pickup' | 'destination' | null;
}) {
    useMapEvents({
        click(e) {
            if (activeField) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

export function LocationEntry() {
    const navigate = useNavigate();
    const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>('pickup');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddressDisplay[]>([]);
    const [recentDestinations, setRecentDestinations] = useState<RecentDestinationDisplay[]>([]);

    const [pickup, setPickup] = useState<LocationState>({
        address: '',
        lat: null,
        lng: null,
    });

    const [destination, setDestination] = useState<LocationState>({
        address: '',
        lat: null,
        lng: null,
    });

    // Fetch saved addresses and recent destinations
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                // Fetch saved addresses
                const addresses = await usersService.getSavedAddresses();
                const formattedAddresses: SavedAddressDisplay[] = addresses.map(addr => ({
                    id: addr.id,
                    label: addr.label,
                    icon: Home,
                    address: addr.address,
                    lat: addr.lat,
                    lng: addr.lng,
                }));
                setSavedAddresses(formattedAddresses);

                // Fetch recent destinations
                const recent = await usersService.getRecentDestinations(5);
                const formattedRecent: RecentDestinationDisplay[] = recent.map(dest => ({
                    id: dest.id,
                    address: dest.address,
                    lat: dest.lat,
                    lng: dest.lng,
                }));
                setRecentDestinations(formattedRecent);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        fetchLocationData();
    }, []);

    // Get user's current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickup({
                        address: 'Current Location',
                        lat: latitude,
                        lng: longitude,
                    });
                    setActiveField('destination');
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

    // Handle map click
    const handleMapLocationSelect = async (lat: number, lng: number) => {
        // In a real app, you would reverse geocode to get the address
        const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        if (activeField === 'pickup') {
            setPickup({ address, lat, lng });
            setActiveField('destination');
        } else if (activeField === 'destination') {
            setDestination({ address, lat, lng });
            setActiveField(null);
        }
    };

    // Handle saved/recent address selection
    const handleAddressSelect = (address: string, lat: number, lng: number) => {
        if (activeField === 'pickup') {
            setPickup({ address, lat, lng });
            setActiveField('destination');
        } else {
            setDestination({ address, lat, lng });
            setActiveField(null);
        }
        setShowSuggestions(false);
        setSearchQuery('');
    };

    // Check if we can proceed
    const canProceed = pickup.lat !== null && destination.lat !== null;

    // Handle continue
    const handleContinue = () => {
        if (canProceed) {
            // In a real app, we would pass the location data via state or context
            navigate(ROUTES.CUSTOMER.BOOK_SELECT_CAB, {
                state: { pickup, destination },
            });
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
            {/* Left Panel - Location Input */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-96 flex-shrink-0"
            >
                <Card padding="lg" className="h-full flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Where would you like to go?
                    </h2>

                    {/* Location inputs */}
                    <div className="space-y-3 mb-6">
                        {/* Pickup */}
                        <div
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                activeField === 'pickup'
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                            onClick={() => {
                                setActiveField('pickup');
                                setShowSuggestions(true);
                            }}
                        >
                            <div className="w-3 h-3 rounded-full bg-success-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 uppercase font-medium">Pickup</p>
                                <p className={cn(
                                    'text-sm truncate',
                                    pickup.address ? 'text-gray-900' : 'text-gray-400'
                                )}>
                                    {pickup.address || 'Enter pickup location'}
                                </p>
                            </div>
                            {pickup.address && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPickup({ address: '', lat: null, lng: null });
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Visual connector */}
                        <div className="flex items-center gap-3 px-3">
                            <div className="w-3 flex justify-center">
                                <div className="w-0.5 h-6 bg-gray-300" />
                            </div>
                        </div>

                        {/* Destination */}
                        <div
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                activeField === 'destination'
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                            onClick={() => {
                                setActiveField('destination');
                                setShowSuggestions(true);
                            }}
                        >
                            <div className="w-3 h-3 rounded-full bg-error-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 uppercase font-medium">Destination</p>
                                <p className={cn(
                                    'text-sm truncate',
                                    destination.address ? 'text-gray-900' : 'text-gray-400'
                                )}>
                                    {destination.address || 'Enter destination'}
                                </p>
                            </div>
                            {destination.address && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDestination({ address: '', lat: null, lng: null });
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Current location button */}
                    <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<Crosshair className="w-4 h-4" />}
                        onClick={getCurrentLocation}
                        className="mb-4"
                    >
                        Use Current Location
                    </Button>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Input
                            placeholder="Search for a place..."
                            prefix={<Search className="w-4 h-4" />}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                        />
                    </div>

                    {/* Suggestions */}
                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex-1 overflow-y-auto"
                            >
                                {/* Saved Addresses */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase">
                                            Saved Places
                                        </h3>
                                        <button className="text-xs text-primary-600 hover:text-primary-700">
                                            <Plus className="w-3 h-3 inline mr-1" />
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {savedAddresses.map((place) => (
                                            <button
                                                key={place.id}
                                                onClick={() => handleAddressSelect(place.address, place.lat, place.lng)}
                                                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <place.icon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{place.label}</p>
                                                    <p className="text-xs text-gray-500 truncate">{place.address}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Destinations */}
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Recent
                                    </h3>
                                    <div className="space-y-1">
                                        {recentDestinations.map((place) => (
                                            <button
                                                key={place.id}
                                                onClick={() => handleAddressSelect(place.address, place.lat, place.lng)}
                                                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <p className="text-sm text-gray-700 truncate">{place.address}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Continue Button */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <Button
                            fullWidth
                            size="lg"
                            disabled={!canProceed}
                            onClick={handleContinue}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Continue
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Right Panel - Map */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 rounded-xl overflow-hidden border border-gray-200"
            >
                <MapContainer
                    center={[MAP_CONFIG.defaultCenter.lat, MAP_CONFIG.defaultCenter.lng]}
                    zoom={MAP_CONFIG.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution={MAP_CONFIG.attribution}
                        url={MAP_CONFIG.tileLayer}
                    />

                    <MapClickHandler
                        onLocationSelect={handleMapLocationSelect}
                        activeField={activeField}
                    />

                    {/* Pickup marker */}
                    {pickup.lat && pickup.lng && (
                        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
                    )}

                    {/* Destination marker */}
                    {destination.lat && destination.lng && (
                        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />
                    )}
                </MapContainer>

                {/* Map instructions overlay */}
                {activeField && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg"
                    >
                        <p className="text-sm text-gray-700">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Tap on the map to set your{' '}
                            <span className={activeField === 'pickup' ? 'text-success-600' : 'text-error-600'}>
                                {activeField === 'pickup' ? 'pickup' : 'destination'}
                            </span>
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
