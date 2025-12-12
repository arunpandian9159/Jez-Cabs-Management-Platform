import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Car,
    Shield,
    Star,
    Edit,
    Camera,
    CheckCircle,
    AlertCircle,
    Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { PageLoader } from '../../components/ui/Loading';
import { driverService } from '../../services';

// Types for driver profile display
interface DocumentDisplay {
    type: string;
    status: string;
    expiry: string | null;
}
interface VehicleDisplay {
    make: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    fuelType: string;
}
interface DriverProfileDisplay {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
    licenseNumber: string;
    licenseExpiry: string;
    bankAccount: string;
    bankName: string;
    ifscCode: string;
    rating: number;
    totalTrips: number;
    joinedDate: string;
    verificationStatus: string;
    documents: DocumentDisplay[];
    vehicle: VehicleDisplay;
}

export function DriverProfile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [driverProfile, setDriverProfile] = useState<DriverProfileDisplay>({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseNumber: '',
        licenseExpiry: '',
        bankAccount: '',
        bankName: '',
        ifscCode: '',
        rating: 0,
        totalTrips: 0,
        joinedDate: '',
        verificationStatus: '',
        documents: [],
        vehicle: {
            make: '',
            model: '',
            year: 0,
            color: '',
            registrationNumber: '',
            fuelType: '',
        },
    });

    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    // Fetch driver profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const profile = await driverService.getProfile();

                const formatted: DriverProfileDisplay = {
                    id: profile.id,
                    name: profile.user ? `${profile.user.first_name} ${profile.user.last_name}` : '',
                    phone: profile.user?.phone || '',
                    email: profile.user?.email || '',
                    address: profile.address || '',
                    dateOfBirth: profile.date_of_birth || '',
                    licenseNumber: profile.license_number || '',
                    licenseExpiry: profile.license_expiry || '',
                    bankAccount: '',
                    bankName: '',
                    ifscCode: '',
                    rating: profile.rating || 0,
                    totalTrips: profile.total_trips || 0,
                    joinedDate: profile.created_at,
                    verificationStatus: profile.status,
                    documents: [],
                    vehicle: {
                        make: '',
                        model: '',
                        year: 0,
                        color: '',
                        registrationNumber: '',
                        fuelType: '',
                    },
                };

                setDriverProfile(formatted);
                setEditForm({
                    name: formatted.name,
                    phone: formatted.phone,
                    email: formatted.email,
                    address: formatted.address,
                });
            } catch (error) {
                console.error('Error fetching driver profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle className="w-4 h-4 text-success-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-warning-600" />;
            case 'expiring':
                return <AlertCircle className="w-4 h-4 text-warning-600" />;
            case 'expired':
                return <AlertCircle className="w-4 h-4 text-error-600" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <Badge variant="success">Verified</Badge>;
            case 'pending':
                return <Badge variant="warning">Pending</Badge>;
            case 'expiring':
                return <Badge variant="warning">Expiring Soon</Badge>;
            case 'expired':
                return <Badge variant="error">Expired</Badge>;
            default:
                return null;
        }
    };



    if (isLoading) {
        return <PageLoader message="Loading profile..." />;
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
                    <p className="text-gray-500">Manage your personal and vehicle information</p>
                </div>
            </motion.div>

            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="lg" className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-500 to-accent-500" />

                    <div className="relative pt-8 flex flex-col md:flex-row items-center md:items-end gap-4">
                        <div className="relative">
                            <Avatar size="2xl" name={driverProfile.name} />
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h2 className="text-xl font-bold text-gray-900">{driverProfile.name}</h2>
                                {driverProfile.verificationStatus === 'verified' && (
                                    <Shield className="w-5 h-5 text-success-600" />
                                )}
                            </div>
                            <p className="text-gray-500">{driverProfile.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                                    <span className="font-medium">{driverProfile.rating}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-600">{driverProfile.totalTrips} trips</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            leftIcon={<Edit className="w-4 h-4" />}
                            onClick={() => setShowEditModal(true)}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="profile">Personal Info</TabsTrigger>
                        <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="bank">Bank Details</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab */}
                    <TabsContent value="profile" className="mt-4">
                        <Card padding="md">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-medium text-gray-900">{driverProfile.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-900">{driverProfile.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900">{driverProfile.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium text-gray-900">{driverProfile.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Vehicle Tab */}
                    <TabsContent value="vehicle" className="mt-4">
                        <Card padding="md">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Car className="w-8 h-8 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {driverProfile.vehicle.make} {driverProfile.vehicle.model}
                                    </h3>
                                    <p className="text-gray-500">{driverProfile.vehicle.registrationNumber}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="font-medium text-gray-900">{driverProfile.vehicle.year}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Color</p>
                                    <p className="font-medium text-gray-900">{driverProfile.vehicle.color}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Fuel Type</p>
                                    <p className="font-medium text-gray-900">{driverProfile.vehicle.fuelType}</p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-4">
                        <Card padding="md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Uploaded Documents</h3>
                                <Button variant="outline" size="sm">Upload New</Button>
                            </div>
                            <div className="space-y-3">
                                {driverProfile.documents.map((doc) => (
                                    <div
                                        key={doc.type}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(doc.status)}
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.type}</p>
                                                {doc.expiry && (
                                                    <p className="text-sm text-gray-500">
                                                        Expires: {doc.expiry}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(doc.status)}
                                            <Button variant="ghost" size="sm">View</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Bank Details Tab */}
                    <TabsContent value="bank" className="mt-4">
                        <Card padding="md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Bank Account</h3>
                                <Button variant="outline" size="sm">Update</Button>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Account Number</span>
                                    <span className="font-medium text-gray-900">{driverProfile.bankAccount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Bank Name</span>
                                    <span className="font-medium text-gray-900">{driverProfile.bankName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">IFSC Code</span>
                                    <span className="font-medium text-gray-900">{driverProfile.ifscCode}</span>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* Edit Profile Modal */}
            <Modal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                title="Edit Profile"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <Input
                        label="Phone Number"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                    <Input
                        label="Address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button fullWidth onClick={() => setShowEditModal(false)}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
