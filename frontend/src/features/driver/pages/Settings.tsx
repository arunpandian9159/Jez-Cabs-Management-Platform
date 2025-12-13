import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Shield,
    Globe,
    Smartphone,
    Volume2,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';

interface SettingToggleProps {
    label: string;
    description?: string;
    enabled: boolean;
    onToggle: () => void;
}

function SettingToggle({ label, description, enabled, onToggle }: SettingToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="font-medium text-gray-900">{label}</p>
                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}
            </div>
            <button onClick={onToggle} className="text-primary-600">
                {enabled ? (
                    <ToggleRight className="w-10 h-6" />
                ) : (
                    <ToggleLeft className="w-10 h-6 text-gray-400" />
                )}
            </button>
        </div>
    );
}

export function DriverSettings() {
    const [settings, setSettings] = useState({
        pushNotifications: true,
        tripAlerts: true,
        earningsAlerts: true,
        promotionalAlerts: false,
        soundEnabled: true,
        vibrationEnabled: true,
        autoAcceptTrips: false,
        shareLocation: true,
        language: 'en',
    });

    const toggleSetting = (key: keyof typeof settings) => {
        if (typeof settings[key] === 'boolean') {
            setSettings({ ...settings, [key]: !settings[key] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
                <p className="text-gray-500">Manage your app preferences</p>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">Notifications</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <SettingToggle
                            label="Push Notifications"
                            description="Receive notifications on your device"
                            enabled={settings.pushNotifications}
                            onToggle={() => toggleSetting('pushNotifications')}
                        />
                        <SettingToggle
                            label="Trip Alerts"
                            description="Get notified about new trip requests"
                            enabled={settings.tripAlerts}
                            onToggle={() => toggleSetting('tripAlerts')}
                        />
                        <SettingToggle
                            label="Earnings Alerts"
                            description="Notifications about payouts and bonuses"
                            enabled={settings.earningsAlerts}
                            onToggle={() => toggleSetting('earningsAlerts')}
                        />
                        <SettingToggle
                            label="Promotional Alerts"
                            description="Updates about offers and promotions"
                            enabled={settings.promotionalAlerts}
                            onToggle={() => toggleSetting('promotionalAlerts')}
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Sound & Haptics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-accent-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">Sound & Haptics</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <SettingToggle
                            label="Sound"
                            description="Play sounds for notifications"
                            enabled={settings.soundEnabled}
                            onToggle={() => toggleSetting('soundEnabled')}
                        />
                        <SettingToggle
                            label="Vibration"
                            description="Vibrate for alerts"
                            enabled={settings.vibrationEnabled}
                            onToggle={() => toggleSetting('vibrationEnabled')}
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Trip Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-success-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">Trip Preferences</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <SettingToggle
                            label="Auto-Accept Trips"
                            description="Automatically accept trip requests"
                            enabled={settings.autoAcceptTrips}
                            onToggle={() => toggleSetting('autoAcceptTrips')}
                        />
                        <SettingToggle
                            label="Share Location"
                            description="Share your location while online"
                            enabled={settings.shareLocation}
                            onToggle={() => toggleSetting('shareLocation')}
                        />
                    </div>
                </Card>
            </motion.div>

            {/* General */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">General</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-gray-900">Language</p>
                                <p className="text-sm text-gray-500">Select your preferred language</p>
                            </div>
                            <Select
                                options={[
                                    { value: 'en', label: 'English' },
                                    { value: 'hi', label: 'हिंदी' },
                                    { value: 'kn', label: 'ಕನ್ನಡ' },
                                    { value: 'ta', label: 'தமிழ்' },
                                ]}
                                value={settings.language}
                                onValueChange={(value) => setSettings({ ...settings, language: value })}
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-error-600" />
                        </div>
                        <h2 className="font-semibold text-gray-900">Security</h2>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Change Password</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Two-Factor Authentication</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Active Sessions</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card padding="md" className="border-error-200">
                    <h2 className="font-semibold text-error-900 mb-4">Danger Zone</h2>
                    <div className="space-y-3">
                        <Button variant="outline" fullWidth className="text-error-600 border-error-300 hover:bg-error-50">
                            Deactivate Account
                        </Button>
                        <Button variant="outline" fullWidth className="text-error-600 border-error-300 hover:bg-error-50">
                            Delete Account
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
