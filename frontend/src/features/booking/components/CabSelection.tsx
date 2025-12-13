import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Zap,
    Clock,
    MapPin,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Gift,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/shared/utils';
import { ROUTES, CAB_TYPES } from '@/shared/constants';
import type { CabType, PriceEstimate } from '../../../types';
import { cabsService } from '@/services';

export function CabSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCab, setSelectedCab] = useState<CabType | null>('economy');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [showFareBreakdown, setShowFareBreakdown] = useState(false);
    const [estimates, setEstimates] = useState<PriceEstimate[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    const pickup = location.state?.pickup;
    const destination = location.state?.destination;

    // Fetch price estimates on mount
    useEffect(() => {
        const fetchEstimates = async () => {
            if (!pickup || !destination) return;

            try {
                setIsLoading(true);
                const priceEstimates = await cabsService.getPriceEstimates(
                    pickup.lat || 0,
                    pickup.lng || 0,
                    destination.lat || 0,
                    destination.lng || 0
                );

                // Map API response to PriceEstimate format
                const formattedEstimates: PriceEstimate[] = priceEstimates.map(e => ({
                    cabType: e.cab_type as CabType,
                    cabTypeName: e.display_name,
                    cabTypeIcon: CAB_TYPES[e.cab_type as keyof typeof CAB_TYPES]?.icon || '🚗',
                    estimatedPickupTime: e.eta_minutes,
                    fareBreakdown: {
                        baseFare: e.base_fare,
                        distanceCharge: e.estimated_fare * 0.6,
                        timeCharge: e.estimated_fare * 0.2,
                        taxes: e.estimated_fare * 0.1,
                        total: e.estimated_fare,
                        currency: 'INR',
                    },
                    available: true,
                }));
                setEstimates(formattedEstimates);
            } catch (error) {
                console.error('Error fetching price estimates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstimates();
    }, [pickup, destination]);

    const selectedEstimate = estimates.find((e) => e.cabType === selectedCab);

    const handleConfirmBooking = () => {
        if (selectedCab && selectedEstimate) {
            navigate(ROUTES.CUSTOMER.BOOK_SEARCHING, {
                state: {
                    pickup,
                    destination,
                    cabType: selectedCab,
                    fare: selectedEstimate.fareBreakdown,
                },
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header with route summary */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <Card padding="md">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-success-500" />
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {pickup?.address || 'Pickup location'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pl-1.5 my-1">
                                <div className="w-0.5 h-4 bg-gray-300" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-error-500" />
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {destination?.address || 'Destination'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.CUSTOMER.BOOK_LOCATION)}
                        >
                            Edit
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>10.2 km</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>~25 min</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Cab options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Choose your ride</h2>
                <div className="space-y-2">
                    {estimates.map((estimate: PriceEstimate, index: number) => (
                        <motion.div
                            key={estimate.cabType}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                padding="md"
                                interactive
                                className={cn(
                                    'cursor-pointer',
                                    selectedCab === estimate.cabType && 'border-primary-500 bg-primary-50',
                                    !estimate.available && 'opacity-50 cursor-not-allowed'
                                )}
                                onClick={() => estimate.available && setSelectedCab(estimate.cabType)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Cab icon */}
                                    <div className="text-3xl">{estimate.cabTypeIcon}</div>

                                    {/* Cab details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{estimate.cabTypeName}</h3>
                                            {estimate.fareBreakdown.surgeFactor && (
                                                <Badge variant="warning" size="sm">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    {estimate.fareBreakdown.surgeFactor}x
                                                </Badge>
                                            )}
                                            {!estimate.available && (
                                                <Badge variant="default" size="sm">
                                                    Unavailable
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {CAB_TYPES[estimate.cabType as keyof typeof CAB_TYPES]?.seats || 4}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {estimate.estimatedPickupTime} min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatCurrency(estimate.fareBreakdown.total)}
                                        </p>
                                        {estimate.fareBreakdown.surgeAmount && (
                                            <p className="text-xs text-gray-500 line-through">
                                                {formatCurrency(estimate.fareBreakdown.total - estimate.fareBreakdown.surgeAmount)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Selection indicator */}
                                    <div
                                        className={cn(
                                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                            selectedCab === estimate.cabType
                                                ? 'border-primary-600 bg-primary-600'
                                                : 'border-gray-300'
                                        )}
                                    >
                                        {selectedCab === estimate.cabType && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Fare breakdown & Payment */}
            {selectedEstimate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <Card padding="md">
                        {/* Fare breakdown toggle */}
                        <button
                            onClick={() => setShowFareBreakdown(!showFareBreakdown)}
                            className="flex items-center justify-between w-full"
                        >
                            <span className="font-medium text-gray-900">Fare Breakdown</span>
                            {showFareBreakdown ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {showFareBreakdown && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm"
                            >
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Base Fare</span>
                                    <span>{formatCurrency(selectedEstimate.fareBreakdown.baseFare)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Distance Charge (10.2 km)</span>
                                    <span>{formatCurrency(selectedEstimate.fareBreakdown.distanceCharge)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Time Charge (~25 min)</span>
                                    <span>{formatCurrency(selectedEstimate.fareBreakdown.timeCharge)}</span>
                                </div>
                                {selectedEstimate.fareBreakdown.surgeAmount && (
                                    <div className="flex justify-between text-warning-600">
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Surge ({selectedEstimate.fareBreakdown.surgeFactor}x)
                                        </span>
                                        <span>+{formatCurrency(selectedEstimate.fareBreakdown.surgeAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Taxes & Fees</span>
                                    <span>{formatCurrency(selectedEstimate.fareBreakdown.taxes)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100 font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedEstimate.fareBreakdown.total)}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Promo code */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {!showPromoInput ? (
                                <button
                                    onClick={() => setShowPromoInput(true)}
                                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    <Gift className="w-4 h-4" />
                                    Apply promo code
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        inputSize="sm"
                                    />
                                    <Button size="sm">Apply</Button>
                                </div>
                            )}
                        </div>

                        {/* Payment method */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        💳
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">•••• 4242</p>
                                        <p className="text-xs text-gray-500">Change payment method</p>
                                    </div>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Confirm button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky bottom-4"
            >
                <Card padding="md" className="shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Fare</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {selectedEstimate ? formatCurrency(selectedEstimate.fareBreakdown.total) : '---'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Shield className="w-4 h-4 text-success-600" />
                            <span>Safe & Secure</span>
                        </div>
                    </div>
                    <Button
                        fullWidth
                        size="lg"
                        disabled={!selectedCab}
                        onClick={handleConfirmBooking}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        Confirm Booking
                    </Button>
                </Card>
            </motion.div>
        </div>
    );
}
