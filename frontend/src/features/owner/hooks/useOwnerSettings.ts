import { useState, useEffect, useCallback } from 'react';
import { ownerService, type BusinessInfo, type OwnerSettings as SettingsType } from '@/services/owner.service';

export function useOwnerSettings() {
    const [settings, setSettings] = useState<SettingsType>({
        emailNotifications: true,
        smsNotifications: true,
        driverAlerts: true,
        maintenanceReminders: true,
        paymentAlerts: true,
        autoSettlement: false,
        language: 'en',
    });
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
        name: '',
        registrationNumber: '',
        address: '',
        phone: '',
        email: '',
    });
    const [businessForm, setBusinessForm] = useState<BusinessInfo>(businessInfo);

    // API state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [businessData, settingsData] = await Promise.all([
                ownerService.getBusinessInfo(),
                ownerService.getSettings(),
            ]);
            setBusinessInfo(businessData);
            setBusinessForm(businessData);
            setSettings(settingsData);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleSetting = async (key: keyof SettingsType) => {
        if (typeof settings[key] === 'boolean') {
            const newSettings = { ...settings, [key]: !settings[key] };
            setSettings(newSettings);

            try {
                await ownerService.updateSettings({ [key]: newSettings[key] });
            } catch (err) {
                setSettings(settings);
                console.error('Error updating setting:', err);
            }
        }
    };

    const handleSaveBusinessInfo = async () => {
        try {
            setIsSaving(true);
            const updated = await ownerService.updateBusinessInfo(businessForm);
            setBusinessInfo(updated);
            setShowBusinessModal(false);
        } catch (err) {
            console.error('Error saving business info:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const updateBusinessForm = (field: keyof BusinessInfo, value: string) => {
        setBusinessForm(prev => ({ ...prev, [field]: value }));
    };

    const updateLanguage = (value: string) => {
        setSettings(prev => ({ ...prev, language: value }));
    };

    return {
        // State
        settings,
        showBusinessModal,
        businessInfo,
        businessForm,
        isLoading,
        error,
        isSaving,
        // Actions
        setShowBusinessModal,
        toggleSetting,
        handleSaveBusinessInfo,
        updateBusinessForm,
        updateLanguage,
    };
}
