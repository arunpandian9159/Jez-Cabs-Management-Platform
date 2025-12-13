import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MapPin,
    Clock,
    Calendar,
    Filter,
    Search,
    ArrowRight,
    Star,
    MessageCircle,
    DollarSign,
    ChevronDown,
    AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { PageLoader } from '../../components/ui/Loading';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';
import { rideshareService, CommunityTrip as APICommunityTrip } from '../../services';

// Display types for community trips
interface TripPoster {
    name: string;
    rating: number;
    trips: number;
}

interface CommunityTripDisplay {
    id: string;
    type: string;
    poster: TripPoster;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: number;
    pricePerSeat: number;
    status: string;
    vehicleType: string;
    description: string;
}

export function TripExchange() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<CommunityTripDisplay | null>(null);
    const [communityTrips, setCommunityTrips] = useState<CommunityTripDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch community trips on mount
    useEffect(() => {
        const fetchCommunityTrips = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const trips = await rideshareService.getCommunityTrips();

                // Map API response to display format
                const formatted: CommunityTripDisplay[] = trips.map((trip: APICommunityTrip) => ({
                    id: trip.id,
                    type: trip.type,
                    poster: {
                        name: trip.poster.name,
                        rating: trip.poster.rating,
                        trips: trip.poster.trips,
                    },
                    from: trip.from,
                    to: trip.to,
                    date: trip.date,
                    time: trip.time,
                    seats: trip.seats,
                    pricePerSeat: trip.price_per_seat,
                    status: trip.status,
                    vehicleType: trip.vehicle_type,
                    description: trip.description,
                }));

                setCommunityTrips(formatted);
            } catch (err) {
                console.error('Error fetching community trips:', err);
                setError('Unable to load community trips. Please try again later.');
                // Keep empty array on error
                setCommunityTrips([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunityTrips();
    }, []);

    const filteredTrips = communityTrips.filter((trip) => {
        const matchesSearch =
            trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.poster.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || trip.type === activeTab;
        return matchesSearch && matchesTab;
    });

    // Loading state
    if (isLoading) {
        return <PageLoader message="Loading community trips..." />;
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Community Trips</h1>
                    <p className="text-gray-500">Share rides and split costs with fellow travelers</p>
                </motion.div>
                <Card padding="lg" className="text-center">
                    <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Unable to Load Trips</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Community Trips</h1>
                    <p className="text-gray-500">Share rides and split costs with fellow travelers</p>
                </div>
                <Button leftIcon={<Users className="w-5 h-5" />} onClick={() => { }}>
                    Post a Trip
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{communityTrips.length}</p>
                    <p className="text-sm text-gray-500">Available Trips</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-success-600">
                        {communityTrips.reduce((sum, t) => sum + t.seats, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Seats Available</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-accent-600">
                        {formatCurrency(Math.round(communityTrips.reduce((sum, t) => sum + t.pricePerSeat, 0) / communityTrips.length))}
                    </p>
                    <p className="text-sm text-gray-500">Avg. Price/Seat</p>
                </Card>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="all">All Trips</TabsTrigger>
                            <TabsTrigger value="share">Offering Ride</TabsTrigger>
                            <TabsTrigger value="request">Looking for Ride</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Search by location or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                prefix={<Search className="w-4 h-4" />}
                                className="w-72"
                            />
                            <Button
                                variant="outline"
                                leftIcon={<Filter className="w-4 h-4" />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    <TabsContent value={activeTab}>
                        <div className="space-y-3">
                            {filteredTrips.map((trip, index) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="md" interactive onClick={() => setSelectedTrip(trip)}>
                                        <div className="flex items-start gap-4">
                                            {/* Poster Info */}
                                            <div className="flex items-center gap-3">
                                                <Avatar size="lg" name={trip.poster.name} />
                                                <div>
                                                    <p className="font-medium text-gray-900">{trip.poster.name}</p>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                                                        <span>{trip.poster.rating}</span>
                                                        <span>•</span>
                                                        <span>{trip.poster.trips} trips</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Route */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant={trip.type === 'share' ? 'success' : 'primary'}>
                                                        {trip.type === 'share' ? 'Offering Ride' : 'Looking for Ride'}
                                                    </Badge>
                                                    <Badge variant="secondary">{trip.vehicleType}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-900">
                                                    <MapPin className="w-4 h-4 text-success-500" />
                                                    <span className="font-medium">{trip.from}</span>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    <MapPin className="w-4 h-4 text-error-500" />
                                                    <span className="font-medium">{trip.to}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 truncate">{trip.description}</p>
                                            </div>

                                            {/* Details */}
                                            <div className="text-right">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(trip.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatTime(trip.time)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-end gap-4">
                                                    <span className="text-sm text-gray-500">
                                                        {trip.seats} {trip.seats === 1 ? 'seat' : 'seats'} left
                                                    </span>
                                                    <span className="text-lg font-bold text-primary-600">
                                                        {formatCurrency(trip.pricePerSeat)}
                                                        <span className="text-xs text-gray-500 font-normal">/seat</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* Trip Details Modal */}
            <Modal
                open={!!selectedTrip}
                onOpenChange={() => setSelectedTrip(null)}
                title="Trip Details"
                size="md"
            >
                {selectedTrip && (
                    <div className="space-y-6">
                        {/* Poster */}
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedTrip.poster.name} />
                            <div>
                                <p className="font-semibold text-gray-900 text-lg">{selectedTrip.poster.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                    <span>{selectedTrip.poster.rating} rating</span>
                                    <span>•</span>
                                    <span>{selectedTrip.poster.trips} trips shared</span>
                                </div>
                            </div>
                        </div>

                        {/* Route Details */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 rounded-full bg-success-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Pickup</p>
                                    <p className="font-medium text-gray-900">{selectedTrip.from}</p>
                                </div>
                            </div>
                            <div className="ml-1.5 h-6 w-0.5 bg-gray-300" />
                            <div className="flex items-center gap-3 mt-3">
                                <div className="w-3 h-3 rounded-full bg-error-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Drop-off</p>
                                    <p className="font-medium text-gray-900">{selectedTrip.to}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trip Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(selectedTrip.date)} at {formatTime(selectedTrip.time)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Vehicle</p>
                                <p className="font-medium text-gray-900">{selectedTrip.vehicleType}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Available Seats</p>
                                <p className="font-medium text-gray-900">{selectedTrip.seats} seats</p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <p className="text-sm text-primary-600">Price per Seat</p>
                                <p className="font-bold text-primary-700 text-lg">{formatCurrency(selectedTrip.pricePerSeat)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Description</p>
                            <p className="text-gray-700">{selectedTrip.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                                variant="outline"
                                fullWidth
                                leftIcon={<MessageCircle className="w-5 h-5" />}
                            >
                                Message
                            </Button>
                            <Button
                                fullWidth
                                leftIcon={<DollarSign className="w-5 h-5" />}
                            >
                                Book Seat
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
