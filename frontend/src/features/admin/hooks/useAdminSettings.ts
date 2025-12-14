import { useState } from 'react';

export interface GeneralSettings {
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    commissionRate: number;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newUserAlert: boolean;
    tripAlerts: boolean;
    disputeAlerts: boolean;
    paymentAlerts: boolean;
}

export interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    maxLoginAttempts: number;
    ipWhitelist: boolean;
}

export interface IntegrationSettings {
    googleMapsEnabled: boolean;
    googleMapsApiKey: string;
    paymentGateway: string;
    smsProvider: string;
    emailProvider: string;
}

export type SettingsTab = 'general' | 'notifications' | 'security' | 'integrations';

const defaultGeneralSettings: GeneralSettings = {
    companyName: 'Jez Cabs',
    supportEmail: 'support@jezcabs.com',
    supportPhone: '+91 1800-123-4567',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    commissionRate: 15,
};

const defaultNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newUserAlert: true,
    tripAlerts: false,
    disputeAlerts: true,
    paymentAlerts: true,
};

const defaultSecuritySettings: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelist: false,
};

const defaultIntegrationSettings: IntegrationSettings = {
    googleMapsEnabled: true,
    googleMapsApiKey: 'AIza...xxxxx',
    paymentGateway: 'razorpay',
    smsProvider: 'twilio',
    emailProvider: 'sendgrid',
};

export function useAdminSettings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Settings state
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSecuritySettings);
    const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>(defaultIntegrationSettings);

    const updateGeneralSettings = (key: keyof GeneralSettings, value: string | number) => {
        setGeneralSettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateNotificationSettings = (key: keyof NotificationSettings, value: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateSecuritySettings = (key: keyof SecuritySettings, value: boolean | number) => {
        setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateIntegrationSettings = (key: keyof IntegrationSettings, value: string | boolean) => {
        setIntegrationSettings((prev) => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        setIsSaving(true);
        setSaveSuccess(false);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSaving(false);
        setSaveSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return {
        // State
        activeTab,
        isSaving,
        saveSuccess,
        generalSettings,
        notificationSettings,
        securitySettings,
        integrationSettings,
        // Actions
        setActiveTab,
        updateGeneralSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        updateIntegrationSettings,
        saveSettings,
    };
}
