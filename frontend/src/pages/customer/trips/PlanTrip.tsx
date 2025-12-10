import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    Plus,
    Trash2,
    Clock,
    ArrowRight,
    Route,
    Info,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { ROUTES } from '../../../lib/constants';

interface Stop {
    id: string;
    address: string;
    duration: number; // minutes to spend
}

export function PlanTrip() {
    const navigate = useNavigate();
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [passengers, setPassengers] = useState('1');
    const [stops, setStops] = useState<Stop[]>([
        { id: '1', address: '', duration: 0 },
    ]);

    const addStop = () => {
        setStops([
            ...stops,
            { id: Date.now().toString(), address: '', duration: 30 },
        ]);
    };

    const removeStop = (id: string) => {
        if (stops.length > 1) {
            setStops(stops.filter((s) => s.id !== id));
        }
    };

    const updateStop = (id: string, field: keyof Stop, value: string | number) => {
        setStops(
            stops.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    const canProceed = tripName && startDate && stops.every((s) => s.address);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Plan Your Trip
                </h1>
                <p className="text-gray-500">
                    Create a multi-stop trip itinerary
                </p>
            </motion.div>

            {/* Trip Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="lg">
                    <h2 className="font-semibold text-gray-900 mb-4">Trip Details</h2>

                    <div className="space-y-4">
                        <Input
                            label="Trip Name"
                            placeholder="e.g., Weekend Getaway to Coorg"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <Select
                                label="Passengers"
                                options={[
                                    { value: '1', label: '1 person' },
                                    { value: '2', label: '2 people' },
                                    { value: '3', label: '3 people' },
                                    { value: '4', label: '4 people' },
                                    { value: '5', label: '5 people' },
                                    { value: '6', label: '6 people' },
                                    { value: '7', label: '7+ people' },
                                ]}
                                value={passengers}
                                onValueChange={setPassengers}
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stops */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">Stops & Destinations</h2>
                        <Badge variant="info">{stops.length} stops</Badge>
                    </div>

                    <div className="space-y-4">
                        {stops.map((stop, index) => (
                            <motion.div
                                key={stop.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3"
                            >
                                {/* Connector */}
                                <div className="flex flex-col items-center pt-3">
                                    <div className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                                        index === 0
                                            ? 'bg-success-100 text-success-700'
                                            : index === stops.length - 1
                                                ? 'bg-error-100 text-error-700'
                                                : 'bg-gray-100 text-gray-700'
                                    )}>
                                        {index + 1}
                                    </div>
                                    {index < stops.length - 1 && (
                                        <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                    )}
                                </div>

                                {/* Stop fields */}
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder={
                                            index === 0
                                                ? 'Start location'
                                                : index === stops.length - 1
                                                    ? 'Final destination'
                                                    : `Stop ${index + 1}`
                                        }
                                        prefix={<MapPin className="w-4 h-4" />}
                                        value={stop.address}
                                        onChange={(e) => updateStop(stop.id, 'address', e.target.value)}
                                    />
                                    {index > 0 && index < stops.length - 1 && (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Duration"
                                                type="number"
                                                inputSize="sm"
                                                prefix={<Clock className="w-3 h-3" />}
                                                suffix={<span className="text-xs text-gray-400">min</span>}
                                                value={stop.duration.toString()}
                                                onChange={(e) => updateStop(stop.id, 'duration', parseInt(e.target.value) || 0)}
                                                containerClassName="w-32"
                                            />
                                            <span className="text-xs text-gray-500">stay at this stop</span>
                                        </div>
                                    )}
                                </div>

                                {/* Remove button */}
                                {stops.length > 1 && index > 0 && (
                                    <button
                                        onClick={() => removeStop(stop.id)}
                                        className="p-2 text-gray-400 hover:text-error-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        fullWidth
                        className="mt-4"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={addStop}
                    >
                        Add Stop
                    </Button>
                </Card>
            </motion.div>

            {/* Trip Summary */}
            {stops.filter((s) => s.address).length >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card padding="md" className="bg-primary-50 border-primary-200">
                        <div className="flex items-start gap-3">
                            <Route className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-medium text-primary-900 mb-1">
                                    Trip Summary
                                </h3>
                                <div className="text-sm text-primary-700 space-y-1">
                                    <p>
                                        {stops.length} destinations • Approx. {Math.round(stops.length * 2.5)} hours drive
                                    </p>
                                    <p>
                                        Total stops duration: {stops.reduce((acc, s) => acc + s.duration, 0)} minutes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="md" className="bg-info-50 border-info-200">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-info-900 mb-1">
                                Share your trip
                            </h3>
                            <p className="text-sm text-info-700">
                                After planning, you can share this trip on the Community Exchange
                                and split costs with other travelers going the same way.
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
            >
                <Button variant="outline" fullWidth>
                    Save as Draft
                </Button>
                <Button
                    fullWidth
                    disabled={!canProceed}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => navigate(ROUTES.CUSTOMER.TRIPS)}
                >
                    Continue to Book
                </Button>
            </motion.div>
        </div>
    );
}
