import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

export enum MessageType {
  TEXT = 'text',
  LOCATION = 'location',
  QUICK_REPLY = 'quick_reply',
  IMAGE = 'image',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ChatMessage {
  @Prop({ required: true, index: true })
  conversationId: string;

  @Prop({ required: true, index: true })
  tripId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Prop({
    type: String,
    enum: Object.values(MessageStatus),
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Prop({ type: Object, default: null })
  metadata: {
    location?: { lat: number; lng: number };
    quickReplyId?: string;
    imageUrl?: string;
  } | null;

  @Prop()
  readAt?: Date;

  @Prop()
  deliveredAt?: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

// Index for efficient querying
ChatMessageSchema.index({ conversationId: 1, created_at: -1 });
ChatMessageSchema.index({ tripId: 1 });

// Pre-defined quick replies
export const QUICK_REPLIES = [
  { id: 'waiting', text: "I'm waiting outside" },
  { id: 'late_5', text: 'Running 5 minutes late' },
  { id: 'late_10', text: 'Running 10 minutes late' },
  { id: 'call_me', text: 'Please call me' },
  { id: 'on_way', text: "I'm on my way" },
  { id: 'arrived', text: "I've arrived at the pickup location" },
  { id: 'cant_find', text: "I can't find you, please share location" },
  { id: 'thanks', text: 'Thank you!' },
];
