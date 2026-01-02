import { useEffect, useCallback, useState } from 'react';

interface UsePushNotificationsOptions {
  onNotification?: (notification: NotificationPayload) => void;
  autoRequest?: boolean;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}

export function usePushNotifications(
  options: UsePushNotificationsOptions = {}
) {
  const { onNotification, autoRequest = false } = options;
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('[Push] Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[Push] Error requesting permission:', error);
      return false;
    }
  }, [isSupported]);

  const registerToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.warn('[Push] No auth token available');
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/notifications/device-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            token,
            platform: 'web',
            deviceName: navigator.userAgent.substring(0, 50),
          }),
        }
      );

      if (response.ok) {
        setFcmToken(token);
        console.log('[Push] Token registered successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Push] Error registering token:', error);
      return false;
    }
  }, []);

  const showLocalNotification = useCallback(
    (payload: NotificationPayload) => {
      if (permission !== 'granted') {
        console.warn('[Push] Permission not granted');
        return;
      }

      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/notification-icon.png',
        data: payload.data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        onNotification?.(payload);
      };
    },
    [permission, onNotification]
  );

  // Auto-request permission on mount if specified
  useEffect(() => {
    if (autoRequest && permission === 'default') {
      requestPermission();
    }
  }, [autoRequest, permission, requestPermission]);

  return {
    isSupported,
    permission,
    fcmToken,
    requestPermission,
    registerToken,
    showLocalNotification,
  };
}

export default usePushNotifications;
