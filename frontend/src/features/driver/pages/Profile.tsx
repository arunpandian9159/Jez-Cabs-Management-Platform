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
        <Card padding="md" className="relative overflow-hidden sm:p-6">
          <div className="absolute top-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500" />
          <div className="relative pt-6 sm:pt-10 flex flex-col md:flex-row items-center md:items-end gap-3 sm:gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="ring-2 sm:ring-4 ring-white rounded-full shadow-xl">
                <Avatar size="xl" name={driverProfile.name} className="sm:w-24 sm:h-24" />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5 sm:mb-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  {driverProfile.name}
                </h2>
                {driverProfile.verificationStatus === 'verified' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
                  </motion.div>
                )}
              </div>
              <p className="text-gray-500 text-xs sm:text-base">{driverProfile.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-4 mt-1 sm:mt-2">
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-warning-50 rounded-lg">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning-500 fill-warning-500" />
                  <span className="font-bold text-warning-700 text-xs sm:text-sm">{driverProfile.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  {driverProfile.totalTrips} trips
                </span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3 h-3 sm:w-4 sm:h-4" />}
                onClick={() => setShowEditModal(true)}
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
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
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-3">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="text-xs sm:text-sm px-2 sm:px-3">
              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Vehicle</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm px-2 sm:px-3">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="text-xs sm:text-sm px-2 sm:px-3">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Bank</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-3 sm:mt-4">
            <Card padding="sm" className="sm:p-6">
              <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
                <div className="space-y-2 sm:space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</p>
                      <p className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">
                        {driverProfile.name}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-success-100 to-success-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Phone</p>
                      <p className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">
                        {driverProfile.phone}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                      <p className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">
                        {driverProfile.email}
                      </p>
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-2 sm:space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors overflow-hidden"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-error-600" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Address</p>
                      <p className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base break-words line-clamp-2">
                        {driverProfile.address || 'Not provided'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle" className="mt-3 sm:mt-4">
            <Card padding="sm" className="sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl flex-shrink-0"
                >
                  <Car className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                    {driverProfile.vehicle.make} {driverProfile.vehicle.model}
                  </h3>
                  <p className="text-gray-500 font-medium text-xs sm:text-base">
                    {driverProfile.vehicle.registrationNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Year</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1">
                    {driverProfile.vehicle.year}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Color</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">
                    {driverProfile.vehicle.color}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Fuel</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1 capitalize truncate">
                    {driverProfile.vehicle.fuelType}
                  </p>
                </motion.div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-3 sm:mt-4">
            <Card padding="sm" className="sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Documents
                  </h3>
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Upload
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {driverProfile.documents.map((doc, index) => (
                  <motion.div
                    key={doc.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                    className="flex items-center justify-between p-2 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-xs sm:text-base truncate">{doc.type}</p>
                        {doc.expiry && (
                          <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                            Exp: {doc.expiry}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                      <div className="hidden sm:block">{getStatusBadge(doc.status)}</div>
                      <Button variant="ghost" size="sm" className="text-xs px-1 sm:px-2">
                        <span className="hidden sm:inline">View</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="mt-3 sm:mt-4">
            <Card padding="sm" className="sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Bank Account</h3>
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Update
                </Button>
              </div>
              <div className="p-3 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl space-y-3 sm:space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200"
                >
                  <span className="text-gray-500 font-medium text-xs sm:text-base">Account No.</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-base">
                    {driverProfile.bankAccount}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200"
                >
                  <span className="text-gray-500 font-medium text-xs sm:text-base">Bank Name</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-base">
                    {driverProfile.bankName}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center justify-between py-2 sm:py-3"
                >
                  <span className="text-gray-500 font-medium text-xs sm:text-base">IFSC Code</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-base">
                    {driverProfile.ifscCode}
                  </span>
                </motion.div>
              </div>
            </Card>
          </TabsContent>
        </TabsRoot >
      </motion.div >

      {/* Edit Profile Modal */}
      < Modal
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
      </Modal >
    </div >
  );
}
