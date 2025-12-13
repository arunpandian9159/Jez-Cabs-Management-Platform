import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    Car,
    DollarSign,
    Info,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { useNavigate } from 'react-router-dom';

export function PostTrip() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [tripData, setTripData] = useState({
        type: 'share',
        from: '',
        to: '',
        date: '',
        time: '',
        seats: '1',
        pricePerSeat: '',
        vehicleType: 'sedan',
        description: '',
    });

    const handleSubmit = () => {
        // In real app, would submit to API
        navigate('/customer/community');
    };

    const vehicleTypes = [
        { value: 'hatchback', label: 'Hatchback' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'innova', label: 'Innova/MUV' },
        { value: 'any', label: 'Any Vehicle' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a Trip</h1>
                <p className="text-gray-500">Share your ride or find travel companions</p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2"
            >
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s <= step
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                            {s}
                        </div>
                        {s < 3 && (
                            <div className={`w-16 h-1 mx-2 rounded-full transition-colors ${s < step ? 'bg-primary-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </motion.div>

            {/* Step 1: Trip Type & Route */}
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card padding="lg">
                        <h2 className="font-semibold text-gray-900 mb-4">Trip Type & Route</h2>

                        {/* Trip Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">What are you posting?</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setTripData({ ...tripData, type: 'share' })}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${tripData.type === 'share'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Car className={`w-6 h-6 mb-2 ${tripData.type === 'share' ? 'text-primary-600' : 'text-gray-400'}`} />
                                    <p className="font-medium text-gray-900">Offering a Ride</p>
                                    <p className="text-sm text-gray-500">I have empty seats to share</p>
                                </button>
                                <button
                                    onClick={() => setTripData({ ...tripData, type: 'request' })}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${tripData.type === 'request'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Users className={`w-6 h-6 mb-2 ${tripData.type === 'request' ? 'text-primary-600' : 'text-gray-400'}`} />
                                    <p className="font-medium text-gray-900">Looking for a Ride</p>
                                    <p className="text-sm text-gray-500">I need a ride from someone</p>
                                </button>
                            </div>
                        </div>

                        {/* Route */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-gray-300" />
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center mt-1 z-10">
                                            <MapPin className="w-4 h-4 text-success-600" />
                                        </div>
                                        <Input
                                            label="Pickup Location"
                                            placeholder="Enter pickup location"
                                            value={tripData.from}
                                            onChange={(e) => setTripData({ ...tripData, from: e.target.value })}
                                            containerClassName="flex-1"
                                        />
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center mt-1 z-10">
                                            <MapPin className="w-4 h-4 text-error-600" />
                                        </div>
                                        <Input
                                            label="Drop-off Location"
                                            placeholder="Enter drop-off location"
                                            value={tripData.to}
                                            onChange={(e) => setTripData({ ...tripData, to: e.target.value })}
                                            containerClassName="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!tripData.from || !tripData.to}
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                            >
                                Continue
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Step 2: Date, Time & Seats */}
            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card padding="lg">
                        <h2 className="font-semibold text-gray-900 mb-4">Schedule & Capacity</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input
                                label="Date"
                                type="date"
                                value={tripData.date}
                                onChange={(e) => setTripData({ ...tripData, date: e.target.value })}
                                prefix={<Calendar className="w-4 h-4" />}
                            />
                            <Input
                                label="Time"
                                type="time"
                                value={tripData.time}
                                onChange={(e) => setTripData({ ...tripData, time: e.target.value })}
                                prefix={<Clock className="w-4 h-4" />}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Available Seats"
                                options={[
                                    { value: '1', label: '1 Seat' },
                                    { value: '2', label: '2 Seats' },
                                    { value: '3', label: '3 Seats' },
                                    { value: '4', label: '4 Seats' },
                                    { value: '5', label: '5 Seats' },
                                    { value: '6', label: '6 Seats' },
                                ]}
                                value={tripData.seats}
                                onValueChange={(value) => setTripData({ ...tripData, seats: value })}
                            />
                            <Select
                                label="Vehicle Type"
                                options={vehicleTypes}
                                value={tripData.vehicleType}
                                onValueChange={(value) => setTripData({ ...tripData, vehicleType: value })}
                            />
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                disabled={!tripData.date || !tripData.time}
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                            >
                                Continue
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Step 3: Price & Details */}
            {step === 3 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card padding="lg">
                        <h2 className="font-semibold text-gray-900 mb-4">Price & Details</h2>

                        <div className="mb-4">
                            <Input
                                label="Price per Seat"
                                type="number"
                                placeholder="Enter price"
                                value={tripData.pricePerSeat}
                                onChange={(e) => setTripData({ ...tripData, pricePerSeat: e.target.value })}
                                prefix={<DollarSign className="w-4 h-4" />}
                                suffix={<span className="text-gray-500">₹</span>}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Suggested price: ₹100 - ₹200 for short trips
                            </p>
                        </div>

                        <div className="mb-4">
                            <TextArea
                                label="Description (Optional)"
                                placeholder="Add details like pickup points, stops, or any notes for passengers..."
                                value={tripData.description}
                                onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Summary */}
                        <Card padding="md" className="bg-gray-50 mb-4">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary-600" />
                                Trip Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">From:</span>
                                    <span className="ml-2 font-medium">{tripData.from}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">To:</span>
                                    <span className="ml-2 font-medium">{tripData.to}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Date:</span>
                                    <span className="ml-2 font-medium">{tripData.date}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Time:</span>
                                    <span className="ml-2 font-medium">{tripData.time}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Seats:</span>
                                    <span className="ml-2 font-medium">{tripData.seats}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Price:</span>
                                    <span className="ml-2 font-medium">₹{tripData.pricePerSeat || '0'}/seat</span>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!tripData.pricePerSeat}
                            >
                                Post Trip
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
