import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Car,
    FileText,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Upload,
    Calendar,
    CreditCard,
    MapPin,
    Phone,
    AlertCircle,
    Shield,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/shared/constants';

// Step types
type OnboardingStep = 'personal' | 'license' | 'vehicle' | 'documents' | 'review';

interface PersonalInfo {
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergencyContact: string;
    emergencyPhone: string;
}

interface LicenseInfo {
    licenseNumber: string;
    licenseType: string;
    licenseExpiry: string;
    yearsOfExperience: string;
}

interface VehicleInfo {
    ownsCab: boolean;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleColor: string;
    registrationNumber: string;
    insuranceExpiry: string;
}

interface DocumentInfo {
    licenseFront: File | null;
    licenseBack: File | null;
    aadhaarFront: File | null;
    aadhaarBack: File | null;
    policeClearance: File | null;
    vehicleRC: File | null;
    vehicleInsurance: File | null;
}

const steps: { id: OnboardingStep; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 'license', label: 'License Info', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'vehicle', label: 'Vehicle Details', icon: <Car className="w-5 h-5" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'review', label: 'Review & Submit', icon: <CheckCircle className="w-5 h-5" /> },
];

export function DriverOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());

    // Form states
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergencyContact: '',
        emergencyPhone: '',
    });

    const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>({
        licenseNumber: '',
        licenseType: 'LMV',
        licenseExpiry: '',
        yearsOfExperience: '',
    });

    const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
        ownsCab: true,
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        registrationNumber: '',
        insuranceExpiry: '',
    });

    const [documents, setDocuments] = useState<DocumentInfo>({
        licenseFront: null,
        licenseBack: null,
        aadhaarFront: null,
        aadhaarBack: null,
        policeClearance: null,
        vehicleRC: null,
        vehicleInsurance: null,
    });

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    const handleNext = () => {
        // Mark current step as completed
        setCompletedSteps((prev) => new Set([...prev, currentStep]));

        // Move to next step
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id);
        }
    };

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].id);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // TODO: Submit all data to the backend API
            // For now, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Navigate to driver dashboard after successful submission
            navigate(ROUTES.DRIVER.DASHBOARD);
        } catch (error) {
            console.error('Failed to submit onboarding:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (
        field: keyof DocumentInfo,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;
        setDocuments((prev) => ({ ...prev, [field]: file }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return (
                    <motion.div
                        key="personal"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                            <p className="text-gray-500 mt-1">Tell us a bit about yourself</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={personalInfo.dateOfBirth}
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                                }
                                prefix={<Calendar className="w-4 h-4" />}
                                required
                            />
                            <Input
                                label="Emergency Contact Name"
                                placeholder="Emergency contact person"
                                value={personalInfo.emergencyContact}
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({
                                        ...prev,
                                        emergencyContact: e.target.value,
                                    }))
                                }
                                prefix={<User className="w-4 h-4" />}
                                required
                            />
                        </div>

                        <Input
                            label="Emergency Contact Phone"
                            placeholder="+91 XXXXX XXXXX"
                            value={personalInfo.emergencyPhone}
                            onChange={(e) =>
                                setPersonalInfo((prev) => ({ ...prev, emergencyPhone: e.target.value }))
                            }
                            prefix={<Phone className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Current Address"
                            placeholder="Street address, apartment, suite, etc."
                            value={personalInfo.address}
                            onChange={(e) =>
                                setPersonalInfo((prev) => ({ ...prev, address: e.target.value }))
                            }
                            prefix={<MapPin className="w-4 h-4" />}
                            required
                        />

                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                label="City"
                                placeholder="City"
                                value={personalInfo.city}
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, city: e.target.value }))
                                }
                                required
                            />
                            <Input
                                label="State"
                                placeholder="State"
                                value={personalInfo.state}
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, state: e.target.value }))
                                }
                                required
                            />
                            <Input
                                label="Pincode"
                                placeholder="Pincode"
                                value={personalInfo.pincode}
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, pincode: e.target.value }))
                                }
                                required
                            />
                        </div>
                    </motion.div>
                );

            case 'license':
                return (
                    <motion.div
                        key="license"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">License Information</h2>
                            <p className="text-gray-500 mt-1">Your driving license details</p>
                        </div>

                        <Input
                            label="Driving License Number"
                            placeholder="e.g., TN-0120210012345"
                            value={licenseInfo.licenseNumber}
                            onChange={(e) =>
                                setLicenseInfo((prev) => ({ ...prev, licenseNumber: e.target.value }))
                            }
                            required
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    License Type
                                </label>
                                <select
                                    value={licenseInfo.licenseType}
                                    onChange={(e) =>
                                        setLicenseInfo((prev) => ({ ...prev, licenseType: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                >
                                    <option value="LMV">LMV - Light Motor Vehicle</option>
                                    <option value="HMV">HMV - Heavy Motor Vehicle</option>
                                    <option value="MCWG">MCWG - Motor Cycle With Gear</option>
                                    <option value="TRANSPORT">Commercial Transport</option>
                                </select>
                            </div>
                            <Input
                                label="License Expiry Date"
                                type="date"
                                value={licenseInfo.licenseExpiry}
                                onChange={(e) =>
                                    setLicenseInfo((prev) => ({ ...prev, licenseExpiry: e.target.value }))
                                }
                                required
                            />
                        </div>

                        <Input
                            label="Years of Driving Experience"
                            type="number"
                            placeholder="e.g., 5"
                            value={licenseInfo.yearsOfExperience}
                            onChange={(e) =>
                                setLicenseInfo((prev) => ({
                                    ...prev,
                                    yearsOfExperience: e.target.value,
                                }))
                            }
                            required
                        />

                        <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">
                                    License Requirements
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Your license must be valid for at least 6 months and you must have a
                                    minimum of 1 year of driving experience.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'vehicle':
                return (
                    <motion.div
                        key="vehicle"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Car className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                            <p className="text-gray-500 mt-1">Information about your vehicle</p>
                        </div>

                        {/* Ownership Toggle */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm font-medium text-gray-700">
                                Do you own a cab?
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setVehicleInfo((prev) => ({ ...prev, ownsCab: true }))
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${vehicleInfo.ownsCab
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200'
                                        }`}
                                >
                                    Yes, I own a cab
                                </button>
                                <button
                                    onClick={() =>
                                        setVehicleInfo((prev) => ({ ...prev, ownsCab: false }))
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!vehicleInfo.ownsCab
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200'
                                        }`}
                                >
                                    No, I'll drive for an owner
                                </button>
                            </div>
                        </div>

                        {vehicleInfo.ownsCab && (
                            <>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Vehicle Make"
                                        placeholder="e.g., Maruti Suzuki"
                                        value={vehicleInfo.vehicleMake}
                                        onChange={(e) =>
                                            setVehicleInfo((prev) => ({
                                                ...prev,
                                                vehicleMake: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <Input
                                        label="Vehicle Model"
                                        placeholder="e.g., Swift Dzire"
                                        value={vehicleInfo.vehicleModel}
                                        onChange={(e) =>
                                            setVehicleInfo((prev) => ({
                                                ...prev,
                                                vehicleModel: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <Input
                                        label="Year"
                                        placeholder="e.g., 2022"
                                        value={vehicleInfo.vehicleYear}
                                        onChange={(e) =>
                                            setVehicleInfo((prev) => ({
                                                ...prev,
                                                vehicleYear: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <Input
                                        label="Color"
                                        placeholder="e.g., White"
                                        value={vehicleInfo.vehicleColor}
                                        onChange={(e) =>
                                            setVehicleInfo((prev) => ({
                                                ...prev,
                                                vehicleColor: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <Input
                                        label="Registration Number"
                                        placeholder="e.g., TN 01 AB 1234"
                                        value={vehicleInfo.registrationNumber}
                                        onChange={(e) =>
                                            setVehicleInfo((prev) => ({
                                                ...prev,
                                                registrationNumber: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <Input
                                    label="Insurance Expiry Date"
                                    type="date"
                                    value={vehicleInfo.insuranceExpiry}
                                    onChange={(e) =>
                                        setVehicleInfo((prev) => ({
                                            ...prev,
                                            insuranceExpiry: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </>
                        )}

                        {!vehicleInfo.ownsCab && (
                            <div className="p-6 bg-gray-50 rounded-xl text-center">
                                <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">
                                    Vehicle details will be provided by the cab owner once you're
                                    assigned to a vehicle.
                                </p>
                            </div>
                        )}
                    </motion.div>
                );

            case 'documents':
                return (
                    <motion.div
                        key="documents"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                            <p className="text-gray-500 mt-1">Required documents for verification</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* License Documents */}
                            <DocumentUpload
                                label="Driving License (Front)"
                                file={documents.licenseFront}
                                onChange={(e) => handleFileChange('licenseFront', e)}
                                required
                            />
                            <DocumentUpload
                                label="Driving License (Back)"
                                file={documents.licenseBack}
                                onChange={(e) => handleFileChange('licenseBack', e)}
                                required
                            />

                            {/* Identity Documents */}
                            <DocumentUpload
                                label="Aadhaar Card (Front)"
                                file={documents.aadhaarFront}
                                onChange={(e) => handleFileChange('aadhaarFront', e)}
                                required
                            />
                            <DocumentUpload
                                label="Aadhaar Card (Back)"
                                file={documents.aadhaarBack}
                                onChange={(e) => handleFileChange('aadhaarBack', e)}
                                required
                            />

                            {/* Police Clearance */}
                            <DocumentUpload
                                label="Police Clearance Certificate"
                                file={documents.policeClearance}
                                onChange={(e) => handleFileChange('policeClearance', e)}
                                required
                            />

                            {/* Vehicle Documents (if owns cab) */}
                            {vehicleInfo.ownsCab && (
                                <>
                                    <DocumentUpload
                                        label="Vehicle RC"
                                        file={documents.vehicleRC}
                                        onChange={(e) => handleFileChange('vehicleRC', e)}
                                        required
                                    />
                                    <DocumentUpload
                                        label="Vehicle Insurance"
                                        file={documents.vehicleInsurance}
                                        onChange={(e) => handleFileChange('vehicleInsurance', e)}
                                        required
                                    />
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-900">Document Guidelines</p>
                                <ul className="text-sm text-amber-700 mt-1 list-disc pl-4 space-y-1">
                                    <li>All documents must be clear and readable</li>
                                    <li>File size should not exceed 5MB per document</li>
                                    <li>Accepted formats: JPG, PNG, PDF</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'review':
                return (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-success-500 to-primary-500 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
                            <p className="text-gray-500 mt-1">
                                Review your information before submitting
                            </p>
                        </div>

                        {/* Summary Cards */}
                        <div className="space-y-4">
                            <ReviewCard
                                title="Personal Details"
                                icon={<User className="w-5 h-5" />}
                                items={[
                                    { label: 'Date of Birth', value: personalInfo.dateOfBirth },
                                    { label: 'Address', value: `${personalInfo.address}, ${personalInfo.city}` },
                                    { label: 'Emergency Contact', value: `${personalInfo.emergencyContact} (${personalInfo.emergencyPhone})` },
                                ]}
                            />

                            <ReviewCard
                                title="License Information"
                                icon={<CreditCard className="w-5 h-5" />}
                                items={[
                                    { label: 'License Number', value: licenseInfo.licenseNumber },
                                    { label: 'License Type', value: licenseInfo.licenseType },
                                    { label: 'Expiry Date', value: licenseInfo.licenseExpiry },
                                    { label: 'Experience', value: `${licenseInfo.yearsOfExperience} years` },
                                ]}
                            />

                            {vehicleInfo.ownsCab && (
                                <ReviewCard
                                    title="Vehicle Details"
                                    icon={<Car className="w-5 h-5" />}
                                    items={[
                                        { label: 'Vehicle', value: `${vehicleInfo.vehicleMake} ${vehicleInfo.vehicleModel}` },
                                        { label: 'Year', value: vehicleInfo.vehicleYear },
                                        { label: 'Registration', value: vehicleInfo.registrationNumber },
                                        { label: 'Color', value: vehicleInfo.vehicleColor },
                                    ]}
                                />
                            )}

                            <ReviewCard
                                title="Documents Uploaded"
                                icon={<FileText className="w-5 h-5" />}
                                items={[
                                    { label: 'Driving License', value: documents.licenseFront ? '✓ Uploaded' : '✗ Missing' },
                                    { label: 'Aadhaar Card', value: documents.aadhaarFront ? '✓ Uploaded' : '✗ Missing' },
                                    { label: 'Police Clearance', value: documents.policeClearance ? '✓ Uploaded' : '✗ Missing' },
                                ]}
                            />
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-900">
                                    Ready to Submit
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    Once submitted, your documents will be reviewed within 24-48 hours.
                                    You'll receive a notification once your account is verified.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Progress Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        Complete the following steps to start accepting rides
                    </p>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = completedSteps.has(step.id);
                            const isPast = index < currentStepIndex;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => (isCompleted || isPast) && setCurrentStep(step.id)}
                                        className={`flex flex-col items-center gap-2 ${isCompleted || isPast ? 'cursor-pointer' : 'cursor-default'
                                            }`}
                                        disabled={!isCompleted && !isPast && !isActive}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                : isCompleted || isPast
                                                    ? 'bg-success-500 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {isCompleted || isPast ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                step.icon
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium hidden md:block ${isActive
                                                ? 'text-primary-600'
                                                : isCompleted || isPast
                                                    ? 'text-success-600'
                                                    : 'text-gray-400'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-full h-1 mx-2 rounded hidden md:block ${isPast || (isCompleted && index < currentStepIndex)
                                                ? 'bg-success-500'
                                                : 'bg-gray-200'
                                                }`}
                                            style={{ minWidth: '60px' }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Step Content */}
                <Card padding="lg" className="mb-6">
                    <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                        onClick={handleBack}
                        disabled={currentStepIndex === 0}
                    >
                        Back
                    </Button>

                    {currentStep === 'review' ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            leftIcon={
                                isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )
                            }
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                        </Button>
                    ) : (
                        <Button
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                            onClick={handleNext}
                        >
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Document Upload Component
interface DocumentUploadProps {
    label: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

function DocumentUpload({ label, file, onChange, required }: DocumentUploadProps) {
    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file
                    ? 'border-success-400 bg-success-50'
                    : 'border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-gray-100'
                    }`}
            >
                <input type="file" className="hidden" onChange={onChange} accept=".jpg,.jpeg,.png,.pdf" />
                {file ? (
                    <div className="flex flex-col items-center text-success-600">
                        <CheckCircle className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-success-500">Click to change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Click to upload</span>
                        <span className="text-xs">JPG, PNG or PDF up to 5MB</span>
                    </div>
                )}
            </label>
        </div>
    );
}

// Review Card Component
interface ReviewCardProps {
    title: string;
    icon: React.ReactNode;
    items: { label: string; value: string }[];
}

function ReviewCard({ title, icon, items }: ReviewCardProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    {icon}
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
                {items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}:</span>
                        <span className="font-medium text-gray-900">{item.value || '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DriverOnboarding;
