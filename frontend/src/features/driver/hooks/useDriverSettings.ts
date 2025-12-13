import { useState } from 'react';

export interface DriverSettingsState {
    pushNotifications: boolean;
    tripAlerts: boolean;
    earningsAlerts: boolean;
    promotionalAlerts: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    autoAcceptTrips: boolean;
    shareLocation: boolean;
    language: string;
}

const initialSettings: DriverSettingsState = {
    pushNotifications: true,
    tripAlerts: true,
    earningsAlerts: true,
    promotionalAlerts: false,
    soundEnabled: true,
    vibrationEnabled: true,
    autoAcceptTrips: false,
    shareLocation: true,
    language: 'en',
};

export function useDriverSettings() {
    const [settings, setSettings] = useState<DriverSettingsState>(initialSettings);

    const toggleSetting = (key: keyof DriverSettingsState) => {
        if (typeof settings[key] === 'boolean') {
            setSettings({ ...settings, [key]: !settings[key] });
        }
    };

    const updateLanguage = (value: string) => {
        setSettings({ ...settings, language: value });
    };

    return {
        settings,
        toggleSetting,
        updateLanguage,
    };
}
