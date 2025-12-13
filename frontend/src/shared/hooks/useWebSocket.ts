import { useEffect, useRef, useState, useCallback } from 'react';

// Get WebSocket URL from environment or construct from current location
const getWebSocketBaseUrl = (): string => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Extract host from API URL and construct WebSocket URL
  try {
    const url = new URL(apiUrl);
    return `${wsProtocol}//${url.host}`;
  } catch {
    return `${wsProtocol}//${window.location.host}`;
  }
};

export const WS_BASE_URL = getWebSocketBaseUrl();

export type WebSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface UseWebSocketOptions<T> {
  /** WebSocket endpoint path (e.g., '/api/v1/trips/123/location') */
  endpoint: string;
  /** Callback when a message is received */
  onMessage?: (data: T) => void;
  /** Callback when connection opens */
  onOpen?: () => void;
  /** Callback when connection closes */
  onClose?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Event) => void;
  /** Whether to auto-reconnect on disconnect */
  autoReconnect?: boolean;
  /** Reconnection delay in ms (default: 3000) */
  reconnectDelay?: number;
  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number;
  /** Whether to connect immediately (default: true) */
  enabled?: boolean;
}

export interface UseWebSocketReturn<T> {
  /** Current connection status */
  status: WebSocketStatus;
  /** Last received message data */
  lastMessage: T | null;
  /** Send a message through the WebSocket */
  sendMessage: (data: unknown) => void;
  /** Manually connect to WebSocket */
  connect: () => void;
  /** Manually disconnect from WebSocket */
  disconnect: () => void;
  /** Whether the connection is active */
  isConnected: boolean;
}

/**
 * Custom hook for WebSocket connections with auto-reconnect support
 */
export function useWebSocket<T = unknown>(
  options: UseWebSocketOptions<T>
): UseWebSocketReturn<T> {
  const {
    endpoint,
    onMessage,
    onOpen,
    onClose,
    onError,
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    enabled = true,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isManualDisconnectRef = useRef(false);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, [clearReconnectTimeout]);

  const connect = useCallback(() => {
    // Don't connect if already connected or connecting
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    isManualDisconnectRef.current = false;
    clearReconnectTimeout();

    const wsUrl = `${WS_BASE_URL}${endpoint}`;
    console.log(`[WebSocket] Connecting to ${wsUrl}`);

    setStatus('connecting');

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          setLastMessage(data);
          onMessage?.(data);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected', event.code, event.reason);
        wsRef.current = null;
        setStatus('disconnected');
        onClose?.();

        // Auto-reconnect logic
        if (
          autoReconnect &&
          !isManualDisconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `[WebSocket] Reconnecting in ${reconnectDelay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setStatus('error');
        onError?.(error);
      };
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      setStatus('error');
    }
  }, [
    endpoint,
    onMessage,
    onOpen,
    onClose,
    onError,
    autoReconnect,
    reconnectDelay,
    maxReconnectAttempts,
    clearReconnectTimeout,
  ]);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }, []);

  // Connect on mount if enabled
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    status,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    isConnected: status === 'connected',
  };
}

// ==================== Typed WebSocket Hooks for Specific Features ====================

/**
 * Driver location update message
 */
export interface DriverLocationMessage {
  type: 'location_update';
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

/**
 * Hook for tracking driver location in real-time
 */
export function useDriverLocationSocket(
  tripId: string | undefined,
  enabled = true
) {
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
  } | null>(null);

  const { status, isConnected } = useWebSocket<DriverLocationMessage>({
    endpoint: tripId ? `/api/v1/trips/${tripId}/location` : '',
    enabled: enabled && !!tripId,
    onMessage: (data) => {
      if (data.type === 'location_update') {
        setDriverLocation({
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
          speed: data.speed,
        });
      }
    },
  });

  return {
    driverLocation,
    isConnected,
    status,
  };
}

/**
 * Trip status update message
 */
export interface TripStatusMessage {
  type:
    | 'driver_assigned'
    | 'driver_en_route'
    | 'driver_arrived'
    | 'trip_started'
    | 'trip_completed'
    | 'trip_cancelled';
  driver?: {
    id: string;
    name: string;
    photo: string | null;
    rating: number;
    totalTrips: number;
    phone: string;
    cab: {
      make: string;
      model: string;
      color: string;
      registrationNumber: string;
    };
  };
  eta?: number;
  message?: string;
}

/**
 * Hook for tracking trip status updates (driver assignment, arrival, etc.)
 */
export function useTripStatusSocket(
  tripId: string | undefined,
  enabled = true
) {
  const [tripStatus, setTripStatus] = useState<TripStatusMessage | null>(null);
  const [driver, setDriver] = useState<TripStatusMessage['driver'] | null>(
    null
  );
  const [eta, setEta] = useState<number | null>(null);

  const { status, isConnected, sendMessage } = useWebSocket<TripStatusMessage>({
    endpoint: tripId ? `/api/v1/trips/${tripId}/status` : '',
    enabled: enabled && !!tripId,
    onMessage: (data) => {
      setTripStatus(data);

      if (data.driver) {
        setDriver(data.driver);
      }

      if (data.eta !== undefined) {
        setEta(data.eta);
      }
    },
  });

  return {
    tripStatus,
    driver,
    eta,
    isConnected,
    status,
    sendMessage,
  };
}

export default useWebSocket;
