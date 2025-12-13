import { motion } from 'framer-motion';
import {
    Bell,
    Shield,
    Globe,
    CreditCard,
    Building2,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    Car,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { useOwnerSettings } from '../hooks/useOwnerSettings';

interface SettingToggleProps {
    label: string;
    description?: string;
    enabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

function SettingToggle({ label, description, enabled, onToggle, disabled }: SettingToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="font-medium text-gray-900">{label}</p>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <button onClick={onToggle} className="text-primary-600" disabled={disabled}>
                {enabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6 text-gray-400" />}
            </button>
        </div>
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
                    <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
                <p className="text-gray-500">Manage your fleet and business preferences</p>
            </motion.div>

            {/* Business Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary-600" /></div>
                            <h2 className="font-semibold text-gray-900">Business Information</h2>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowBusinessModal(true)}>Edit</Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div><p className="text-sm text-gray-500">Business Name</p><p className="font-medium text-gray-900">{businessInfo.name}</p></div>
                        <div><p className="text-sm text-gray-500">GST Number</p><p className="font-medium text-gray-900">{businessInfo.registrationNumber}</p></div>
                        <div><p className="text-sm text-gray-500">Contact Email</p><p className="font-medium text-gray-900">{businessInfo.email}</p></div>
                        <div><p className="text-sm text-gray-500">Contact Phone</p><p className="font-medium text-gray-900">{businessInfo.phone}</p></div>
                    </div>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center"><Bell className="w-5 h-5 text-accent-600" /></div>
                        <h2 className="font-semibold text-gray-900">Notifications</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <SettingToggle label="Email Notifications" description="Receive updates via email" enabled={settings.emailNotifications} onToggle={() => toggleSetting('emailNotifications')} />
                        <SettingToggle label="SMS Notifications" description="Receive updates via SMS" enabled={settings.smsNotifications} onToggle={() => toggleSetting('smsNotifications')} />
                        <SettingToggle label="Driver Alerts" description="Notifications about driver activities" enabled={settings.driverAlerts} onToggle={() => toggleSetting('driverAlerts')} />
                        <SettingToggle label="Maintenance Reminders" description="Get reminded about vehicle maintenance" enabled={settings.maintenanceReminders} onToggle={() => toggleSetting('maintenanceReminders')} />
                        <SettingToggle label="Payment Alerts" description="Notifications about earnings and payouts" enabled={settings.paymentAlerts} onToggle={() => toggleSetting('paymentAlerts')} />
                    </div>
                </Card>
            </motion.div>

            {/* Payment Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-success-600" /></div>
                        <h2 className="font-semibold text-gray-900">Payment Settings</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <SettingToggle label="Auto Settlement" description="Automatically settle driver payments weekly" enabled={settings.autoSettlement} onToggle={() => toggleSetting('autoSettlement')} />
                        <div className="py-3"><button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><div><p className="font-medium text-gray-900 text-left">Bank Account</p><p className="text-sm text-gray-500">HDFC Bank ••••4567</p></div><ChevronRight className="w-5 h-5 text-gray-400" /></button></div>
                        <div className="py-3"><button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><div><p className="font-medium text-gray-900 text-left">Payout Schedule</p><p className="text-sm text-gray-500">Weekly (Every Friday)</p></div><ChevronRight className="w-5 h-5 text-gray-400" /></button></div>
                    </div>
                </Card>
            </motion.div>

            {/* Fleet Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center"><Car className="w-5 h-5 text-warning-600" /></div>
                        <h2 className="font-semibold text-gray-900">Fleet Settings</h2>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Driver Commission Rates</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Vehicle Maintenance Schedule</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Document Expiry Alerts</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                    </div>
                </Card>
            </motion.div>

            {/* General */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Globe className="w-5 h-5 text-gray-600" /></div>
                        <h2 className="font-semibold text-gray-900">General</h2>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div><p className="font-medium text-gray-900">Language</p><p className="text-sm text-gray-500">Select your preferred language</p></div>
                        <Select options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'kn', label: 'ಕನ್ನಡ' }]} value={settings.language} onValueChange={updateLanguage} />
                    </div>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center"><Shield className="w-5 h-5 text-error-600" /></div>
                        <h2 className="font-semibold text-gray-900">Security & Legal</h2>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Change Password</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Two-Factor Authentication</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Terms of Service</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900">Privacy Policy</span><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                    </div>
                </Card>
            </motion.div>

            {/* Business Info Modal */}
            <Modal open={showBusinessModal} onOpenChange={setShowBusinessModal} title="Edit Business Information" size="md">
                <div className="space-y-4">
                    <Input label="Business Name" value={businessForm.name} onChange={(e) => updateBusinessForm('name', e.target.value)} />
                    <Input label="GST Number" value={businessForm.registrationNumber} onChange={(e) => updateBusinessForm('registrationNumber', e.target.value)} />
                    <Input label="Contact Email" value={businessForm.email} onChange={(e) => updateBusinessForm('email', e.target.value)} />
                    <Input label="Contact Phone" value={businessForm.phone} onChange={(e) => updateBusinessForm('phone', e.target.value)} />
                    <Input label="Business Address" value={businessForm.address} onChange={(e) => updateBusinessForm('address', e.target.value)} />
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowBusinessModal(false)} disabled={isSaving}>Cancel</Button>
                        <Button fullWidth onClick={handleSaveBusinessInfo} loading={isSaving} disabled={isSaving}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
