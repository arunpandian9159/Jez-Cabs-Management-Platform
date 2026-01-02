import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  namespace?: string;
}

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

const getSocketUrl = () => {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return backendUrl.replace('/api/v1', '');
};

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, namespace = '/realtime' } = options;
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const getAuthToken = useCallback(() => {
    // Get token from localStorage (matches your auth implementation)
    return localStorage.getItem('access_token');
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = getAuthToken();
    if (!token) {
      setState((prev) => ({
        ...prev,
        error: new Error('No authentication token available'),
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    const url = getSocketUrl() + namespace;
    socketRef.current = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current.on('connect', () => {
      setState({ isConnected: true, isConnecting: false, error: null });
      console.log('[Socket] Connected to real-time server');
    });

    socketRef.current.on('disconnect', (reason) => {
      setState((prev) => ({ ...prev, isConnected: false }));
      console.log('[Socket] Disconnected:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      setState({ isConnected: false, isConnecting: false, error });
      console.error('[Socket] Connection error:', error);
    });
  }, [getAuthToken, namespace]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({ isConnected: false, isConnecting: false, error: null });
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('[Socket] Cannot emit, socket not connected');
    }
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      socketRef.current?.on(event, callback);
      return () => {
        socketRef.current?.off(event, callback);
      };
    },
    []
  );

  const off = useCallback(
    (event: string, callback?: (...args: unknown[]) => void) => {
      if (callback) {
        socketRef.current?.off(event, callback);
      } else {
        socketRef.current?.removeAllListeners(event);
      }
    },
    []
  );

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    ...state,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

export default useSocket;
