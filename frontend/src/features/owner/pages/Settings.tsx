import { motion } from 'framer-motion';
import {
  Bell,
  Shield,
  Globe,
  CreditCard,
  Building2,
  ChevronRight,
  Car,
  AlertTriangle,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { useOwnerSettings } from '../hooks/useOwnerSettings';
import { OwnerPageHeader } from '../components/OwnerPageHeader';

interface SettingToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function SettingToggle({
  label,
  description,
  enabled,
  onToggle,
  disabled,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 px-4 -mx-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <motion.button
        onClick={onToggle}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-200'
          }`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingRow({ label, value, onClick }: SettingRowProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div className="text-left">
        <p className="font-medium text-gray-900">{label}</p>
        {value && <p className="text-sm text-gray-500 mt-0.5">{value}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </motion.button>
  );
}

export function OwnerSettings() {
  const {
    settings,
    showBusinessModal,
    businessInfo,
    businessForm,
    isLoading,
    error,
    isSaving,
    setShowBusinessModal,
    toggleSetting,
    handleSaveBusinessInfo,
    updateBusinessForm,
    updateLanguage,
  } = useOwnerSettings();

  if (isLoading) {
    return <PageLoader message="Loading settings..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Settings"
        subtitle="Manage your fleet and business preferences"
        icon={SettingsIcon}
        iconColor="primary"
      />

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="lg" className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Business Information
                </h2>
                <p className="text-sm text-gray-500">Your company details</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBusinessModal(true)}
            >
              Edit
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Business Name</p>
              <p className="font-semibold text-gray-900">{businessInfo.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">GST Number</p>
              <p className="font-semibold text-gray-900">
                {businessInfo.registrationNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contact Email</p>
              <p className="font-semibold text-gray-900">{businessInfo.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contact Phone</p>
              <p className="font-semibold text-gray-900">{businessInfo.phone}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage your alerts</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingToggle
              label="Email Notifications"
              description="Receive updates via email"
              enabled={settings.emailNotifications}
              onToggle={() => toggleSetting('emailNotifications')}
            />
            <SettingToggle
              label="SMS Notifications"
              description="Receive updates via SMS"
              enabled={settings.smsNotifications}
              onToggle={() => toggleSetting('smsNotifications')}
            />
            <SettingToggle
              label="Driver Alerts"
              description="Notifications about driver activities"
              enabled={settings.driverAlerts}
              onToggle={() => toggleSetting('driverAlerts')}
            />
            <SettingToggle
              label="Maintenance Reminders"
              description="Get reminded about vehicle maintenance"
              enabled={settings.maintenanceReminders}
              onToggle={() => toggleSetting('maintenanceReminders')}
            />
            <SettingToggle
              label="Payment Alerts"
              description="Notifications about earnings and payouts"
              enabled={settings.paymentAlerts}
              onToggle={() => toggleSetting('paymentAlerts')}
            />
          </div>
        </Card>
      </motion.div>

      {/* Payment Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Payment Settings</h2>
              <p className="text-sm text-gray-500">Manage payments and payouts</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingToggle
              label="Auto Settlement"
              description="Automatically settle driver payments weekly"
              enabled={settings.autoSettlement}
              onToggle={() => toggleSetting('autoSettlement')}
            />
            <SettingRow
              label="Bank Account"
              value="HDFC Bank ••••4567"
            />
            <SettingRow
              label="Payout Schedule"
              value="Weekly (Every Friday)"
            />
          </div>
        </Card>
      </motion.div>

      {/* Fleet Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Fleet Settings</h2>
              <p className="text-sm text-gray-500">Vehicle and driver management</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingRow label="Driver Commission Rates" />
            <SettingRow label="Vehicle Maintenance Schedule" />
            <SettingRow label="Document Expiry Alerts" />
          </div>
        </Card>
      </motion.div>

      {/* General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">General</h2>
              <p className="text-sm text-gray-500">App preferences</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-500">
                Select your preferred language
              </p>
            </div>
            <Select
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'हिंदी' },
                { value: 'kn', label: 'ಕನ್ನಡ' },
              ]}
              value={settings.language}
              onValueChange={updateLanguage}
            />
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-error-500 to-error-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Security & Legal</h2>
              <p className="text-sm text-gray-500">Account security settings</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingRow label="Change Password" />
            <SettingRow label="Two-Factor Authentication" />
            <SettingRow label="Terms of Service" />
            <SettingRow label="Privacy Policy" />
          </div>
        </Card>
      </motion.div>

      {/* Business Info Modal */}
      <Modal
        open={showBusinessModal}
        onOpenChange={setShowBusinessModal}
        title="Edit Business Information"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Business Name"
            value={businessForm.name}
            onChange={(e) => updateBusinessForm('name', e.target.value)}
          />
          <Input
            label="GST Number"
            value={businessForm.registrationNumber}
            onChange={(e) =>
              updateBusinessForm('registrationNumber', e.target.value)
            }
          />
          <Input
            label="Contact Email"
            value={businessForm.email}
            onChange={(e) => updateBusinessForm('email', e.target.value)}
          />
          <Input
            label="Contact Phone"
            value={businessForm.phone}
            onChange={(e) => updateBusinessForm('phone', e.target.value)}
          />
          <Input
            label="Business Address"
            value={businessForm.address}
            onChange={(e) => updateBusinessForm('address', e.target.value)}
          />
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowBusinessModal(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSaveBusinessInfo}
              loading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
