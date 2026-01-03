import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export interface ChatMessage {
  id?: string;
  conversationId?: string;
  tripId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: 'text' | 'location' | 'quick_reply' | 'image';
  status?: 'sent' | 'delivered' | 'read';
  timestamp: string;
  metadata?: {
    location?: { lat: number; lng: number };
    quickReplyId?: string;
  };
}

export interface QuickReply {
  id: string;
  text: string;
}

interface UseChatOptions {
  tripId: string;
  receiverId: string;
  onNewMessage?: (message: ChatMessage) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const WS_URL = API_BASE_URL.replace('/api/v1', '');

const QUICK_REPLIES: QuickReply[] = [
  { id: 'waiting', text: "I'm waiting outside" },
  { id: 'late_5', text: 'Running 5 minutes late' },
  { id: 'late_10', text: 'Running 10 minutes late' },
  { id: 'call_me', text: 'Please call me' },
  { id: 'on_way', text: "I'm on my way" },
  { id: 'arrived', text: "I've arrived at the pickup location" },
  { id: 'cant_find', text: "I can't find you, please share location" },
  { id: 'thanks', text: 'Thank you!' },
];

export function useChat({ tripId, receiverId, onNewMessage }: UseChatOptions) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!token || !tripId) return;

    const socket = io(`${WS_URL}/realtime`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      // Join trip room
      socket.emit('trip:join', { tripId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for new messages
    socket.on('chat:message', (message: ChatMessage) => {
      if (message.tripId === tripId && message.senderId !== user?.id) {
        setMessages((prev) => [...prev, message]);
        onNewMessage?.(message);
      }
    });

    // Listen for typing indicators
    socket.on(
      'chat:typing',
      (data: { senderId: string; isTyping: boolean }) => {
        if (data.senderId === receiverId) {
          setOtherUserTyping(data.isTyping);
        }
      }
    );

    // Listen for read receipts
    socket.on('chat:read:receipt', () => {
      // Update message statuses to 'read'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === user?.id ? { ...msg, status: 'read' } : msg
        )
      );
    });

    socketRef.current = socket;

    return () => {
      socket.emit('trip:leave', { tripId });
      socket.disconnect();
    };
  }, [token, tripId, receiverId, user?.id, onNewMessage]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !tripId) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/v1/chat/trips/${tripId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.reverse()); // Reverse to get oldest first
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [token, tripId]);

  // Send message
  const sendMessage = useCallback(
    async (
      message: string,
      messageType: ChatMessage['messageType'] = 'text',
      metadata?: ChatMessage['metadata']
    ) => {
      if (!socketRef.current || !user) return;

      const newMessage: ChatMessage = {
        tripId,
        senderId: user.id,
        receiverId,
        message,
        messageType,
        metadata,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      // Optimistic update
      setMessages((prev) => [...prev, newMessage]);

      // Send via WebSocket
      socketRef.current.emit('chat:send', {
        tripId,
        receiverId,
        message,
        messageType,
        ...metadata,
      });

      // Also persist via REST API
      try {
        await fetch(`${API_BASE_URL}/api/v1/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tripId,
            receiverId,
            message,
            messageType,
            ...metadata,
          }),
        });
      } catch (error) {
        console.error('Failed to persist message:', error);
      }
    },
    [tripId, receiverId, user, token]
  );

  // Send quick reply
  const sendQuickReply = useCallback(
    (quickReplyId: string) => {
      const quickReply = QUICK_REPLIES.find((qr) => qr.id === quickReplyId);
      if (quickReply) {
        sendMessage(quickReply.text, 'quick_reply', { quickReplyId });
      }
    },
    [sendMessage]
  );

  // Send location
  const sendLocation = useCallback(
    (lat: number, lng: number) => {
      sendMessage('📍 Shared location', 'location', { location: { lat, lng } });
    },
    [sendMessage]
  );

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socketRef.current) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('chat:typing', {
        tripId,
        receiverId,
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit('chat:typing', {
        tripId,
        receiverId,
        isTyping: false,
      });
    }, 2000);
  }, [tripId, receiverId, isTyping]);

  // Mark messages as read
  const markAsRead = useCallback(
    (conversationId: string) => {
      if (!socketRef.current || !user) return;

      socketRef.current.emit('chat:read', {
        conversationId,
        tripId,
        senderId: receiverId,
      });
    },
    [tripId, receiverId, user]
  );

  return {
    messages,
    isConnected,
    isLoading,
    otherUserTyping,
    quickReplies: QUICK_REPLIES,
    sendMessage,
    sendQuickReply,
    sendLocation,
    handleTyping,
    markAsRead,
  };
}

export default useChat;
