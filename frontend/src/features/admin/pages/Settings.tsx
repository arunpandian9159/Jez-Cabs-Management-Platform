import { motion } from 'framer-motion';
import {
    Settings2,
    Bell,
    Shield,
    Plug,
    Save,
    Check,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAdminSettings, SettingsTab } from '../hooks/useAdminSettings';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
}

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

    const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { key: 'general', label: 'General', icon: <Settings2 className="w-4 h-4" /> },
        { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { key: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
        { key: 'integrations', label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
                    <p className="text-gray-500">Manage your platform settings and preferences</p>
                </div>
                <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                    leftIcon={
                        isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveSuccess ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )
                    }
                    variant={saveSuccess ? 'primary' : 'primary'}
                >
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
            >
                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <Card padding="sm">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Card padding="lg">
                        {activeTab === 'general' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Company Name"
                                        value={generalSettings.companyName}
                                        onChange={(e) => updateGeneralSettings('companyName', e.target.value)}
                                    />
                                    <Input
                                        label="Support Email"
                                        type="email"
                                        value={generalSettings.supportEmail}
                                        onChange={(e) => updateGeneralSettings('supportEmail', e.target.value)}
                                    />
                                    <Input
                                        label="Support Phone"
                                        value={generalSettings.supportPhone}
                                        onChange={(e) => updateGeneralSettings('supportPhone', e.target.value)}
                                    />
                                    <Select
                                        label="Timezone"
                                        options={[
                                            { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                                            { value: 'UTC', label: 'UTC' },
                                            { value: 'America/New_York', label: 'America/New_York (EST)' },
                                        ]}
                                        value={generalSettings.timezone}
                                        onValueChange={(value) => updateGeneralSettings('timezone', value)}
                                    />
                                    <Select
                                        label="Currency"
                                        options={[
                                            { value: 'INR', label: 'Indian Rupee (₹)' },
                                            { value: 'USD', label: 'US Dollar ($)' },
                                            { value: 'EUR', label: 'Euro (€)' },
                                        ]}
                                        value={generalSettings.currency}
                                        onValueChange={(value) => updateGeneralSettings('currency', value)}
                                    />
                                    <Input
                                        label="Commission Rate (%)"
                                        type="number"
                                        value={generalSettings.commissionRate.toString()}
                                        onChange={(e) => updateGeneralSettings('commissionRate', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                                <div className="divide-y divide-gray-100">
                                    <ToggleSwitch
                                        label="Email Notifications"
                                        description="Receive notifications via email"
                                        enabled={notificationSettings.emailNotifications}
                                        onChange={(value) => updateNotificationSettings('emailNotifications', value)}
                                    />
                                    <ToggleSwitch
                                        label="SMS Notifications"
                                        description="Receive notifications via SMS"
                                        enabled={notificationSettings.smsNotifications}
                                        onChange={(value) => updateNotificationSettings('smsNotifications', value)}
                                    />
                                    <ToggleSwitch
                                        label="Push Notifications"
                                        description="Receive push notifications in browser"
                                        enabled={notificationSettings.pushNotifications}
                                        onChange={(value) => updateNotificationSettings('pushNotifications', value)}
                                    />
                                    <div className="pt-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Alert Types</h3>
                                        <ToggleSwitch
                                            label="New User Signups"
                                            enabled={notificationSettings.newUserAlert}
                                            onChange={(value) => updateNotificationSettings('newUserAlert', value)}
                                        />
                                        <ToggleSwitch
                                            label="Trip Alerts"
                                            enabled={notificationSettings.tripAlerts}
                                            onChange={(value) => updateNotificationSettings('tripAlerts', value)}
                                        />
                                        <ToggleSwitch
                                            label="Dispute Alerts"
                                            enabled={notificationSettings.disputeAlerts}
                                            onChange={(value) => updateNotificationSettings('disputeAlerts', value)}
                                        />
                                        <ToggleSwitch
                                            label="Payment Alerts"
                                            enabled={notificationSettings.paymentAlerts}
                                            onChange={(value) => updateNotificationSettings('paymentAlerts', value)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                                <div className="divide-y divide-gray-100">
                                    <ToggleSwitch
                                        label="Two-Factor Authentication"
                                        description="Require 2FA for admin accounts"
                                        enabled={securitySettings.twoFactorAuth}
                                        onChange={(value) => updateSecuritySettings('twoFactorAuth', value)}
                                    />
                                    <ToggleSwitch
                                        label="IP Whitelist"
                                        description="Restrict admin access to specific IPs"
                                        enabled={securitySettings.ipWhitelist}
                                        onChange={(value) => updateSecuritySettings('ipWhitelist', value)}
                                    />
                                    <div className="py-4 grid grid-cols-3 gap-4">
                                        <Input
                                            label="Session Timeout (minutes)"
                                            type="number"
                                            value={securitySettings.sessionTimeout.toString()}
                                            onChange={(e) => updateSecuritySettings('sessionTimeout', parseInt(e.target.value) || 30)}
                                        />
                                        <Input
                                            label="Password Expiry (days)"
                                            type="number"
                                            value={securitySettings.passwordExpiry.toString()}
                                            onChange={(e) => updateSecuritySettings('passwordExpiry', parseInt(e.target.value) || 90)}
                                        />
                                        <Input
                                            label="Max Login Attempts"
                                            type="number"
                                            value={securitySettings.maxLoginAttempts.toString()}
                                            onChange={(e) => updateSecuritySettings('maxLoginAttempts', parseInt(e.target.value) || 5)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'integrations' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">Integration Settings</h2>
                                <div className="space-y-6">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Google Maps</h3>
                                                <p className="text-sm text-gray-500">Maps and location services</p>
                                            </div>
                                            <ToggleSwitch
                                                label=""
                                                enabled={integrationSettings.googleMapsEnabled}
                                                onChange={(value) => updateIntegrationSettings('googleMapsEnabled', value)}
                                            />
                                        </div>
                                        {integrationSettings.googleMapsEnabled && (
                                            <Input
                                                label="API Key"
                                                type="password"
                                                value={integrationSettings.googleMapsApiKey}
                                                onChange={(e) => updateIntegrationSettings('googleMapsApiKey', e.target.value)}
                                            />
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Payment Gateway"
                                            options={[
                                                { value: 'razorpay', label: 'Razorpay' },
                                                { value: 'stripe', label: 'Stripe' },
                                                { value: 'paypal', label: 'PayPal' },
                                            ]}
                                            value={integrationSettings.paymentGateway}
                                            onValueChange={(value) => updateIntegrationSettings('paymentGateway', value)}
                                        />
                                        <Select
                                            label="SMS Provider"
                                            options={[
                                                { value: 'twilio', label: 'Twilio' },
                                                { value: 'msg91', label: 'MSG91' },
                                                { value: 'nexmo', label: 'Nexmo' },
                                            ]}
                                            value={integrationSettings.smsProvider}
                                            onValueChange={(value) => updateIntegrationSettings('smsProvider', value)}
                                        />
                                        <Select
                                            label="Email Provider"
                                            options={[
                                                { value: 'sendgrid', label: 'SendGrid' },
                                                { value: 'mailgun', label: 'Mailgun' },
                                                { value: 'ses', label: 'Amazon SES' },
                                            ]}
                                            value={integrationSettings.emailProvider}
                                            onValueChange={(value) => updateIntegrationSettings('emailProvider', value)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
