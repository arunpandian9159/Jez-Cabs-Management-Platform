import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { safetyService } from '@/services';

export interface SafetySettingsDisplay {
  shareRideEnabled: boolean;
  trustedContactsCount: number;
  sosEnabled: boolean;
  audioRecordingEnabled: boolean;
  pinVerificationEnabled: boolean;
}

const initialSettings: SafetySettingsDisplay = {
  shareRideEnabled: false,
  trustedContactsCount: 0,
  sosEnabled: false,
  audioRecordingEnabled: false,
  pinVerificationEnabled: false,
};

export function useSafetyCenter() {
  const navigate = useNavigate();
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [safetySettings, setSafetySettings] =
    useState<SafetySettingsDisplay>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSafetyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const contacts = await safetyService.getEmergencyContacts();
      setSafetySettings((prev) => ({
        ...prev,
        trustedContactsCount: contacts.length,
        sosEnabled: contacts.length > 0,
        shareRideEnabled: contacts.length > 0,
      }));
    } catch (error) {
      console.error('Error fetching safety data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSafetyData();
  }, [fetchSafetyData]);

  const handleTriggerSOS = () => {
    setShowSOSModal(true);
    setSosTriggered(false);
    setCountdown(5);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          safetyService.triggerSOS({ lat: 0, lng: 0 }).catch(console.error);
          setSosTriggered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelSOS = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSOSModal(false);
    setSosTriggered(false);
    setCountdown(5);
  };

  const navigateToContacts = () => navigate('/customer/safety/contacts');

  return {
    showSOSModal,
    sosTriggered,
    countdown,
    safetySettings,
    isLoading,
    handleTriggerSOS,
    handleCancelSOS,
    navigateToContacts,
  };
}
