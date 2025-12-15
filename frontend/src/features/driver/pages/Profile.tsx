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
  FileText,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { PageLoader } from '@/components/ui/Loading';
import { useDriverProfile } from '../hooks/useDriverProfile';

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

export function DriverProfile() {
  const {
    activeTab,
    showEditModal,
    isLoading,
    driverProfile,
    editForm,
    setActiveTab,
    setShowEditModal,
    updateEditForm,
    handleSaveProfile,
  } = useDriverProfile();

  if (isLoading) {
    return <PageLoader message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500" />
          <div className="relative pt-10 flex flex-col md:flex-row items-center md:items-end gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="ring-4 ring-white rounded-full shadow-xl">
                <Avatar size="2xl" name={driverProfile.name} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
              >
                <Camera className="w-5 h-5" />
              </motion.button>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-700">
                  {driverProfile.name}
                </h2>
                {driverProfile.verificationStatus === 'verified' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Shield className="w-5 h-5 text-success-600" />
                  </motion.div>
                )}
              </div>
              <p className="text-gray-500">{driverProfile.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-warning-50 rounded-lg">
                  <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                  <span className="font-bold text-warning-700">{driverProfile.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 font-medium">
                  {driverProfile.totalTrips} trips
                </span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                leftIcon={<Edit className="w-4 h-4" />}
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </Button>
            </motion.div>
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
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-1.5" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="vehicle">
              <Car className="w-4 h-4 mr-1.5" />
              Vehicle
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-1.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="bank">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Bank Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card padding="lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {driverProfile.name}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-100 to-success-200 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Phone Number</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {driverProfile.phone}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email Address</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {driverProfile.email}
                      </p>
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-error-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Address</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {driverProfile.address || 'Not provided'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle" className="mt-4">
            <Card padding="lg">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl"
                >
                  <Car className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {driverProfile.vehicle.make} {driverProfile.vehicle.model}
                  </h3>
                  <p className="text-gray-500 font-medium">
                    {driverProfile.vehicle.registrationNumber}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Year</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {driverProfile.vehicle.year}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Color</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {driverProfile.vehicle.color}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Fuel Type</p>
                  <p className="text-lg font-bold text-gray-900 mt-1 capitalize">
                    {driverProfile.vehicle.fuelType}
                  </p>
                </motion.div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Uploaded Documents
                  </h3>
                </div>
                <Button variant="outline" size="sm">
                  Upload New
                </Button>
              </div>
              <div className="space-y-3">
                {driverProfile.documents.map((doc, index) => (
                  <motion.div
                    key={doc.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{doc.type}</p>
                        {doc.expiry && (
                          <p className="text-sm text-gray-500">
                            Expires: {doc.expiry}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(doc.status)}
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="mt-4">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Bank Account</h3>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <span className="text-gray-500 font-medium">Account Number</span>
                  <span className="font-bold text-gray-900">
                    {driverProfile.bankAccount}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <span className="text-gray-500 font-medium">Bank Name</span>
                  <span className="font-bold text-gray-900">
                    {driverProfile.bankName}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-gray-500 font-medium">IFSC Code</span>
                  <span className="font-bold text-gray-900">
                    {driverProfile.ifscCode}
                  </span>
                </motion.div>
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
            onChange={(e) => updateEditForm('name', e.target.value)}
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) => updateEditForm('phone', e.target.value)}
          />
          <Input
            label="Email Address"
            value={editForm.email}
            onChange={(e) => updateEditForm('email', e.target.value)}
          />
          <Input
            label="Address"
            value={editForm.address}
            onChange={(e) => updateEditForm('address', e.target.value)}
          />
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
