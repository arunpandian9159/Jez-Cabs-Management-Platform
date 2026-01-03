import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, MessageCircle, X, Loader2 } from 'lucide-react';
import { useChat, ChatMessage, QuickReply } from '../hooks/useChat';
import { cn } from '@/shared/utils/cn';

interface ChatWindowProps {
  tripId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  isDriver?: boolean;
  onClose?: () => void;
  className?: string;
}

export function ChatWindow({
  tripId,
  receiverId,
  receiverName,
  receiverAvatar,
  isDriver = false,
  onClose,
  className,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isConnected,
    isLoading,
    otherUserTyping,
    quickReplies,
    sendMessage,
    sendQuickReply,
    sendLocation,
    handleTyping,
  } = useChat({
    tripId,
    receiverId,
    onNewMessage: () => {
      // Scroll to bottom on new message
      scrollToBottom();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue('');
    setShowQuickReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location');
      }
    );
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendQuickReply(reply.id);
    setShowQuickReplies(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isOwnMessage = msg.senderId !== receiverId;

    return (
      <div
        key={msg.id || index}
        className={cn(
          'flex mb-3',
          isOwnMessage ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted rounded-bl-md'
          )}
        >
          {msg.messageType === 'location' && msg.metadata?.location && (
            <a
              href={`https://www.google.com/maps?q=${msg.metadata.location.lat},${msg.metadata.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm underline"
            >
              <MapPin className="h-4 w-4" />
              View Location
            </a>
          )}
          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
          <div
            className={cn(
              'flex items-center gap-1 mt-1',
              isOwnMessage ? 'justify-end' : 'justify-start'
            )}
          >
            <span className="text-xs opacity-70">
              {formatTime(msg.timestamp)}
            </span>
            {isOwnMessage && msg.status && (
              <span className="text-xs opacity-70">
                {msg.status === 'sent' && '✓'}
                {msg.status === 'delivered' && '✓✓'}
                {msg.status === 'read' && '✓✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background border rounded-lg shadow-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            {receiverAvatar ? (
              <img
                src={receiverAvatar}
                alt={receiverName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {receiverName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background',
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              )}
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{receiverName}</h3>
            <p className="text-xs text-muted-foreground">
              {isDriver ? 'Your Driver' : 'Customer'}
              {otherUserTyping && ' • typing...'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start a conversation with {receiverName}</p>
          </div>
        ) : (
          messages.map((msg, index) => renderMessage(msg, index))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="px-4 py-2 border-t bg-muted/50">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 text-xs bg-background border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={cn(
              'p-2 rounded-full transition-colors',
              showQuickReplies
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
            title="Quick replies"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            onClick={handleShareLocation}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Share location"
          >
            <MapPin className="h-5 w-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'p-2 rounded-full transition-colors',
              inputValue.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
