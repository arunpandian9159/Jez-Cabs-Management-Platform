import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Link2,
    Save,
    Check,
    Building2,
    Mail,
    Phone,
    Globe,
    Percent,
    Smartphone,
    MessageSquare,
    Lock,
    Key,
    Timer,
    AlertTriangle,
    Map,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { AdminPageHeader } from '../components';

const ToggleSwitch = ({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (value: boolean) => void;
}) => (
    <motion.button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-200'
            }`}
        whileTap={{ scale: 0.95 }}
    >
        <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
            animate={{ x: enabled ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    </motion.button>
);

export function AdminSettings() {
    const {
        activeTab,
        isSaving,
        saveSuccess,
        generalSettings,
        notificationSettings,
        securitySettings,
        integrationSettings,
        setActiveTab,
        updateGeneralSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        updateIntegrationSettings,
        saveSettings,
    } = useAdminSettings();

    const [hasChanges, setHasChanges] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon, description: 'Company info and preferences' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts and messaging' },
        { id: 'security', label: 'Security', icon: Shield, description: 'Authentication and access' },
        { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Third-party services' },
    ];

    const handleSettingChange = () => {
        setHasChanges(true);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Settings"
                subtitle="Configure platform settings and preferences"
                icon={SettingsIcon}
                iconColor="primary"
                action={
                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-warning-600 flex items-center gap-1"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                Unsaved changes
                            </motion.span>
                        )}
                        <Button
                            onClick={() => {
                                saveSettings();
                                setHasChanges(false);
                            }}
                            disabled={isSaving || !hasChanges}
                            leftIcon={
                                saveSuccess ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )
                            }
                        >
                            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                        </Button>
                    </div>
                }
            />

            <div className="flex gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-64 shrink-0"
                >
                    <Card padding="sm" className="sticky top-6">
                        <nav className="space-y-1">
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${isActive
                                                ? 'bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive
                                                ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                                : 'bg-gray-100'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                        </div>
                                        <div>
                                            <span className={`block text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                                                {tab.label}
                                            </span>
                                            <span className="text-xs text-gray-400">{tab.description}</span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </nav>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1"
                    key={activeTab}
                >
                    {activeTab === 'general' && (
                        <Card padding="lg" className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Company Information</h2>
                                    <p className="text-sm text-gray-500">Basic details about your business</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Company Name"
                                    value={generalSettings.companyName}
                                    onChange={(e) => {
                                        updateGeneralSettings('companyName', e.target.value);
                                        handleSettingChange();
                                    }}
                                    prefix={<Building2 className="w-4 h-4" />}
                                />
                                <Input
                                    label="Support Email"
                                    type="email"
                                    value={generalSettings.supportEmail}
                                    onChange={(e) => {
                                        updateGeneralSettings('supportEmail', e.target.value);
                                        handleSettingChange();
                                    }}
                                    prefix={<Mail className="w-4 h-4" />}
                                />
                                <Input
                                    label="Support Phone"
                                    value={generalSettings.supportPhone}
                                    onChange={(e) => {
                                        updateGeneralSettings('supportPhone', e.target.value);
                                        handleSettingChange();
                                    }}
                                    prefix={<Phone className="w-4 h-4" />}
                                />
                                <Select
                                    label="Timezone"
                                    options={[
                                        { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                                        { value: 'UTC', label: 'UTC' },
                                        { value: 'America/New_York', label: 'America/New_York (EST)' },
                                    ]}
                                    value={generalSettings.timezone}
                                    onValueChange={(value) => {
                                        updateGeneralSettings('timezone', value);
                                        handleSettingChange();
                                    }}
                                />
                                <Select
                                    label="Currency"
                                    options={[
                                        { value: 'INR', label: '₹ Indian Rupee (INR)' },
                                        { value: 'USD', label: '$ US Dollar (USD)' },
                                        { value: 'EUR', label: '€ Euro (EUR)' },
                                    ]}
                                    value={generalSettings.currency}
                                    onValueChange={(value) => {
                                        updateGeneralSettings('currency', value);
                                        handleSettingChange();
                                    }}
                                />
                                <Input
                                    label="Commission Rate (%)"
                                    type="number"
                                    value={generalSettings.commissionRate}
                                    onChange={(e) => {
                                        updateGeneralSettings('commissionRate', Number(e.target.value));
                                        handleSettingChange();
                                    }}
                                    prefix={<Percent className="w-4 h-4" />}
                                />
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card padding="lg" className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-accent-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Notification Settings</h2>
                                    <p className="text-sm text-gray-500">Control how notifications are sent</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Email Notifications</span>
                                            <p className="text-sm text-gray-500">Send updates via email</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        enabled={notificationSettings.emailNotifications}
                                        onChange={(value) => {
                                            updateNotificationSettings('emailNotifications', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">SMS Notifications</span>
                                            <p className="text-sm text-gray-500">Send updates via SMS</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        enabled={notificationSettings.smsNotifications}
                                        onChange={(value) => {
                                            updateNotificationSettings('smsNotifications', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <Smartphone className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Push Notifications</span>
                                            <p className="text-sm text-gray-500">Send push notifications to app</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        enabled={notificationSettings.pushNotifications}
                                        onChange={(value) => {
                                            updateNotificationSettings('pushNotifications', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-900 mb-4">Alert Types</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-sm text-gray-700">New User Alerts</span>
                                        <ToggleSwitch
                                            enabled={notificationSettings.newUserAlert}
                                            onChange={(value) => {
                                                updateNotificationSettings('newUserAlert', value);
                                                handleSettingChange();
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-sm text-gray-700">Trip Alerts</span>
                                        <ToggleSwitch
                                            enabled={notificationSettings.tripAlerts}
                                            onChange={(value) => {
                                                updateNotificationSettings('tripAlerts', value);
                                                handleSettingChange();
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-sm text-gray-700">Dispute Alerts</span>
                                        <ToggleSwitch
                                            enabled={notificationSettings.disputeAlerts}
                                            onChange={(value) => {
                                                updateNotificationSettings('disputeAlerts', value);
                                                handleSettingChange();
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="text-sm text-gray-700">Payment Alerts</span>
                                        <ToggleSwitch
                                            enabled={notificationSettings.paymentAlerts}
                                            onChange={(value) => {
                                                updateNotificationSettings('paymentAlerts', value);
                                                handleSettingChange();
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card padding="lg" className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-error-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Security Settings</h2>
                                    <p className="text-sm text-gray-500">Authentication and access control</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Two-Factor Authentication</span>
                                            <p className="text-sm text-gray-500">Require 2FA for admin login</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        enabled={securitySettings.twoFactorAuth}
                                        onChange={(value) => {
                                            updateSecuritySettings('twoFactorAuth', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">IP Whitelist</span>
                                            <p className="text-sm text-gray-500">Only allow specific IP addresses</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        enabled={securitySettings.ipWhitelist}
                                        onChange={(value) => {
                                            updateSecuritySettings('ipWhitelist', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <Input
                                    label="Session Timeout (minutes)"
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => {
                                        updateSecuritySettings('sessionTimeout', Number(e.target.value));
                                        handleSettingChange();
                                    }}
                                    prefix={<Timer className="w-4 h-4" />}
                                />
                                <Input
                                    label="Password Expiry (days)"
                                    type="number"
                                    value={securitySettings.passwordExpiry}
                                    onChange={(e) => {
                                        updateSecuritySettings('passwordExpiry', Number(e.target.value));
                                        handleSettingChange();
                                    }}
                                    prefix={<Key className="w-4 h-4" />}
                                />
                                <Input
                                    label="Max Login Attempts"
                                    type="number"
                                    value={securitySettings.maxLoginAttempts}
                                    onChange={(e) => {
                                        updateSecuritySettings('maxLoginAttempts', Number(e.target.value));
                                        handleSettingChange();
                                    }}
                                    prefix={<AlertTriangle className="w-4 h-4" />}
                                />
                            </div>
                        </Card>
                    )}

                    {activeTab === 'integrations' && (
                        <Card padding="lg" className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                                    <Link2 className="w-5 h-5 text-success-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Third-Party Integrations</h2>
                                    <p className="text-sm text-gray-500">Configure external service connections</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Map className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">Google Maps</span>
                                            <p className="text-sm text-gray-500">Maps and location services</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={integrationSettings.googleMapsEnabled}
                                            onChange={(value) => {
                                                updateIntegrationSettings('googleMapsEnabled', value);
                                                handleSettingChange();
                                            }}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Enter Google Maps API Key"
                                        type="password"
                                        value={integrationSettings.googleMapsApiKey}
                                        onChange={(e) => {
                                            updateIntegrationSettings('googleMapsApiKey', e.target.value);
                                            handleSettingChange();
                                        }}
                                        prefix={<Key className="w-4 h-4" />}
                                    />
                                </div>
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Payment Gateway</span>
                                            <p className="text-sm text-gray-500">Payment processing</p>
                                        </div>
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'razorpay', label: 'Razorpay' },
                                            { value: 'stripe', label: 'Stripe' },
                                            { value: 'paytm', label: 'Paytm' },
                                        ]}
                                        value={integrationSettings.paymentGateway}
                                        onValueChange={(value) => {
                                            updateIntegrationSettings('paymentGateway', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">SMS Provider</span>
                                            <p className="text-sm text-gray-500">SMS messaging service</p>
                                        </div>
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'twilio', label: 'Twilio' },
                                            { value: 'msg91', label: 'MSG91' },
                                            { value: 'textlocal', label: 'Textlocal' },
                                        ]}
                                        value={integrationSettings.smsProvider}
                                        onValueChange={(value) => {
                                            updateIntegrationSettings('smsProvider', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Email Provider</span>
                                            <p className="text-sm text-gray-500">Email delivery service</p>
                                        </div>
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'sendgrid', label: 'SendGrid' },
                                            { value: 'mailgun', label: 'Mailgun' },
                                            { value: 'ses', label: 'Amazon SES' },
                                        ]}
                                        value={integrationSettings.emailProvider}
                                        onValueChange={(value) => {
                                            updateIntegrationSettings('emailProvider', value);
                                            handleSettingChange();
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
