import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({ timestamps: true, collection: 'notification_preferences' })
export class NotificationPreference {
  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ default: true })
  emailEnabled: boolean;

  @Prop({ default: false })
  smsEnabled: boolean;

  @Prop({ default: true })
  pushEnabled: boolean;

  @Prop({ default: true })
  inAppEnabled: boolean;

  // Event-specific preferences
  @Prop({ default: true })
  bookingNotifications: boolean;

  @Prop({ default: true })
  invoiceNotifications: boolean;

  @Prop({ default: true })
  maintenanceNotifications: boolean;

  @Prop({ default: true })
  expiryAlerts: boolean;

  @Prop({ default: true })
  driverNotifications: boolean;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(
  NotificationPreference,
);

// Create compound unique index
NotificationPreferenceSchema.index(
  { companyId: 1, userId: 1 },
  { unique: true },
);
