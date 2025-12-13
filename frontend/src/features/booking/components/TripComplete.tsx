import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    Receipt,
    Home,
    CheckCircle,
    Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { TextArea } from '@/components/ui/Input/TextArea';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';

const quickFeedback = [
    { id: 'clean', label: 'Clean car', icon: '✨' },
    { id: 'punctual', label: 'Punctual', icon: '⏰' },
    { id: 'safe', label: 'Safe driving', icon: '🛡️' },
    { id: 'polite', label: 'Polite', icon: '😊' },
    { id: 'navigation', label: 'Good navigation', icon: '🗺️' },
    { id: 'ac', label: 'AC was good', icon: '❄️' },
];

export function TripComplete() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
    const [comment, setComment] = useState('');
    const [tip, setTip] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const { pickup, destination, cabType, fare, driver } = location.state || {};

    const tipOptions = [20, 50, 100];

    const handleFeedbackToggle = (id: string) => {
        setSelectedFeedback((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        // In real app, submit rating to backend
        setSubmitted(true);
    };

    const handleGoHome = () => {
        navigate(ROUTES.CUSTOMER.DASHBOARD);
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                        className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="w-12 h-12 text-success-600" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Thank you for your feedback!
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Your rating helps us improve our service.
                    </p>

                    {/* Promo card */}
                    <Card padding="md" className="bg-gradient-to-br from-primary-500 to-accent-500 text-white mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold">Get 20% off your next ride!</p>
                                <p className="text-sm text-white/80">Use code: THANKS20</p>
                            </div>
                        </div>
                    </Card>

                    <Button
                        fullWidth
                        size="lg"
                        onClick={handleGoHome}
                        leftIcon={<Home className="w-5 h-5" />}
                    >
                        Back to Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            {/* Success header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 mb-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4"
                >
                    <CheckCircle className="w-10 h-10 text-success-600" />
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Trip Completed!
                </h1>
                <p className="text-gray-500">
                    You have arrived at your destination
                </p>
            </motion.div>

            {/* Trip summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="md" className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar
                                size="md"
                                src={driver?.photo}
                                name={driver?.name || 'Driver'}
                            />
                            <div>
                                <p className="font-medium text-gray-900">
                                    {driver?.name || 'Your Driver'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {driver?.cab?.registrationNumber || 'KA 01 AB 1234'}
                                </p>
                            </div>
                        </div>
                        <Badge variant="primary" className="capitalize">
                            {cabType || 'Economy'}
                        </Badge>
                    </div>

                    {/* Route */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className="flex flex-col items-center gap-1 pt-1">
                            <div className="w-2 h-2 rounded-full bg-success-500" />
                            <div className="w-0.5 h-6 bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-error-500" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <p className="text-sm text-gray-700 truncate">
                                {pickup?.address || 'Pickup location'}
                            </p>
                            <p className="text-sm text-gray-700 truncate">
                                {destination?.address || 'Destination'}
                            </p>
                        </div>
                    </div>

                    {/* Fare breakdown */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Base Fare</span>
                            <span>{formatCurrency(fare?.baseFare || 50)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Distance</span>
                            <span>{formatCurrency(fare?.distanceCharge || 120)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Taxes</span>
                            <span>{formatCurrency(fare?.taxes || 20)}</span>
                        </div>
                        {tip && (
                            <div className="flex justify-between text-sm text-success-600">
                                <span>Tip</span>
                                <span>+{formatCurrency(tip)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>{formatCurrency((fare?.total || 190) + (tip || 0))}</span>
                        </div>
                    </div>

                    {/* Receipt button */}
                    <Button
                        variant="outline"
                        fullWidth
                        className="mt-4"
                        leftIcon={<Receipt className="w-4 h-4" />}
                    >
                        Download Receipt
                    </Button>
                </Card>
            </motion.div>

            {/* Rating section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="md" className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">
                        How was your trip?
                    </h2>

                    {/* Star rating */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                                key={star}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="p-1"
                            >
                                <Star
                                    className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                        ? 'text-warning-500 fill-warning-500'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </motion.button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {/* Quick feedback tags */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">What went well?</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickFeedback.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleFeedbackToggle(item.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedFeedback.includes(item.id)
                                                ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                                                }`}
                                        >
                                            {item.icon} {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment box */}
                            <TextArea
                                placeholder="Any additional comments? (optional)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                            />
                        </motion.div>
                    )}
                </Card>
            </motion.div>

            {/* Tip section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="md" className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Add a tip for {driver?.name?.split(' ')[0] || 'your driver'}?
                    </h2>

                    <div className="flex gap-3">
                        {tipOptions.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setTip(tip === amount ? null : amount)}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${tip === amount
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                ₹{amount}
                            </button>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Submit button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleSubmit}
                    disabled={rating === 0}
                >
                    Submit Rating & Complete
                </Button>

                <Button
                    variant="ghost"
                    fullWidth
                    className="mt-2"
                    onClick={handleGoHome}
                >
                    Skip for now
                </Button>
            </motion.div>
        </div>
    );
}
