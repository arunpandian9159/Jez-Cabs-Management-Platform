import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Car,
    Users,
    Fuel,
    Star,
    Filter,
    Search,
    ChevronDown,
    Heart,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { cn, formatCurrency } from '../../../lib/utils';
import { ROUTES } from '../../../lib/constants';
import { rentalsService } from '../../../services';

// Types for available cabs display
interface AvailableCabDisplay {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    seats: number;
    fuel: string;
    transmission: string;
    pricePerDay: number;
    pricePerKm: number;
    rating: number;
    reviews: number;
    ownerName: string;
    image: string | null;
    features: string[];
    available: boolean;
}

const rentalTypes = [
    { value: 'self_drive', label: 'Self Drive' },
    { value: 'with_driver', label: 'With Driver' },
];

const durationOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export function BrowseCabs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [rentalType, setRentalType] = useState('self_drive');
    const [duration, setDuration] = useState('daily');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [availableCabs, setAvailableCabs] = useState<AvailableCabDisplay[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    // Fetch available cabs on mount
    useEffect(() => {
        const fetchCabs = async () => {
            try {
                setIsLoading(true);
                const cabs = await rentalsService.getAvailableCabs();
                const formatted: AvailableCabDisplay[] = cabs.map(cab => ({
                    id: cab.id,
                    make: cab.make,
                    model: cab.model,
                    year: 2023, // Default year if not provided
                    color: 'Black', // Default color
                    seats: 5, // Default seats
                    fuel: 'Petrol', // Default fuel type
                    transmission: 'Automatic', // Default transmission
                    pricePerDay: cab.daily_rate || 2000,
                    pricePerKm: 15, // Default per km rate
                    rating: cab.rating || 4.5,
                    reviews: cab.total_rentals || 0,
                    ownerName: cab.owner ? `${cab.owner.first_name} ${cab.owner.last_name}` : 'Owner',
                    image: cab.images?.[0] || null,
                    features: cab.features || [],
                    available: true,
                }));
                setAvailableCabs(formatted);
            } catch (error) {
                console.error('Error fetching available cabs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCabs();
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const filteredCabs = availableCabs.filter((cab) =>
        `${cab.make} ${cab.model}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Rent a Cab
                </h1>
                <p className="text-gray-500">
                    Choose from our wide selection of vehicles
                </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="md">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Search cars..."
                                prefix={<Search className="w-4 h-4" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            options={rentalTypes}
                            value={rentalType}
                            onValueChange={setRentalType}
                        />
                        <Select
                            options={durationOptions}
                            value={duration}
                            onValueChange={setDuration}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                            >
                                <Filter className="w-4 h-4" />
                                More Filters
                                <ChevronDown className={cn(
                                    'w-4 h-4 transition-transform',
                                    showFilters && 'rotate-180'
                                )} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            {filteredCabs.length} vehicles available
                        </p>
                    </div>

                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            <Select
                                label="Fuel Type"
                                options={[
                                    { value: 'any', label: 'Any' },
                                    { value: 'petrol', label: 'Petrol' },
                                    { value: 'diesel', label: 'Diesel' },
                                    { value: 'electric', label: 'Electric' },
                                ]}
                                value="any"
                                onValueChange={() => { }}
                            />
                            <Select
                                label="Transmission"
                                options={[
                                    { value: 'any', label: 'Any' },
                                    { value: 'manual', label: 'Manual' },
                                    { value: 'automatic', label: 'Automatic' },
                                ]}
                                value="any"
                                onValueChange={() => { }}
                            />
                            <Select
                                label="Seats"
                                options={[
                                    { value: 'any', label: 'Any' },
                                    { value: '4', label: '4 Seats' },
                                    { value: '5', label: '5 Seats' },
                                    { value: '7', label: '7+ Seats' },
                                ]}
                                value="any"
                                onValueChange={() => { }}
                            />
                            <Select
                                label="Price Range"
                                options={[
                                    { value: 'any', label: 'Any' },
                                    { value: 'budget', label: 'Under ₹2000/day' },
                                    { value: 'mid', label: '₹2000-3000/day' },
                                    { value: 'premium', label: 'Above ₹3000/day' },
                                ]}
                                value="any"
                                onValueChange={() => { }}
                            />
                        </motion.div>
                    )}
                </Card>
            </motion.div>

            {/* Cab Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCabs.map((cab, index) => (
                    <motion.div
                        key={cab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                    >
                        <Card
                            padding="none"
                            className={cn(
                                'overflow-hidden h-full flex flex-col',
                                !cab.available && 'opacity-75'
                            )}
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <Car className="w-20 h-20 text-gray-400" />

                                {/* Favorite button */}
                                <button
                                    onClick={() => toggleFavorite(cab.id)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                                >
                                    <Heart
                                        className={cn(
                                            'w-4 h-4',
                                            favorites.includes(cab.id)
                                                ? 'text-error-500 fill-error-500'
                                                : 'text-gray-400'
                                        )}
                                    />
                                </button>

                                {/* Availability badge */}
                                {!cab.available && (
                                    <Badge
                                        variant="default"
                                        className="absolute top-3 left-3"
                                    >
                                        Not Available
                                    </Badge>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {cab.make} {cab.model}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {cab.year} • {cab.color}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                        <span className="font-medium">{cab.rating}</span>
                                        <span className="text-gray-400">({cab.reviews})</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                                        <Users className="w-3 h-3" /> {cab.seats}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                                        <Fuel className="w-3 h-3" /> {cab.fuel}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                                        {cab.transmission}
                                    </span>
                                </div>

                                {/* Owner */}
                                <p className="text-sm text-gray-500 mb-4">
                                    by <span className="text-gray-700">{cab.ownerName}</span>
                                </p>

                                {/* Price and action */}
                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatCurrency(cab.pricePerDay)}
                                            <span className="text-sm font-normal text-gray-500">/day</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            + {formatCurrency(cab.pricePerKm)}/km
                                        </p>
                                    </div>
                                    <Link to={`${ROUTES.CUSTOMER.RENTALS}/details/${cab.id}`}>
                                        <Button size="sm" disabled={!cab.available}>
                                            {cab.available ? 'View Details' : 'Unavailable'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
