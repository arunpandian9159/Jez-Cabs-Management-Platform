import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  ALL = 'ALL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  READ = 'READ',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ index: true })
  companyId?: string;

  @Prop({ index: true })
  userId: string;

  @Prop({
    required: true,
    enum: Object.values(NotificationType),
  })
  type: NotificationType;

  @Prop({
    required: true,
    enum: Object.values(NotificationStatus),
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Prop({
    enum: Object.values(NotificationPriority),
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  recipient: string; // Email address, phone number, or user ID

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  sentAt: Date;

  @Prop()
  readAt: Date;

  @Prop()
  errorMessage: string;

  @Prop({ default: 0 })
  retryCount: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ companyId: 1, userId: 1, createdAt: -1 });
NotificationSchema.index({ status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, status: 1 });
