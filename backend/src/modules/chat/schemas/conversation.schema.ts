import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

export enum ConversationType {
  TRIP = 'trip', // Conversation between driver and customer for a trip
  SUPPORT = 'support', // Conversation with customer support
}

export enum ConversationStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Conversation {
  @Prop({ required: true, type: [String] })
  participants: string[]; // Array of user IDs

  @Prop({ required: true, index: true })
  tripId: string;

  @Prop({
    type: String,
    enum: Object.values(ConversationType),
    default: ConversationType.TRIP,
  })
  type: ConversationType;

  @Prop({
    type: String,
    enum: Object.values(ConversationStatus),
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Prop({ type: Object, default: null })
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: Date;
  } | null;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ type: Object, default: {} })
  unreadCount: Record<string, number>; // userId -> unread count

  @Prop()
  closedAt?: Date;

  @Prop()
  closedReason?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes for efficient querying
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ tripId: 1 }, { unique: true });
ConversationSchema.index({ status: 1, updated_at: -1 });
