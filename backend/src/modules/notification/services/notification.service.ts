import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  FirebaseService,
  PushNotificationPayload,
} from '../../../common/firebase.service';
import { WebsocketGateway } from '../../websocket/websocket.gateway';
import {
  Notification,
  NotificationDocument,
  NotificationType,
  NotificationStatus,
  NotificationPriority,
} from '../schemas/notification.schema';
import {
  DeviceToken,
  DeviceTokenDocument,
} from '../schemas/device-token.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(DeviceToken.name)
    private deviceTokenModel: Model<DeviceTokenDocument>,
    private firebaseService: FirebaseService,
    private websocketGateway: WebsocketGateway,
  ) {}

  /**
   * Register a device token for push notifications
   */
  async registerDeviceToken(
    userId: string,
    token: string,
    platform: 'web' | 'android' | 'ios',
    deviceName?: string,
  ): Promise<DeviceToken> {
    const existing = await this.deviceTokenModel.findOne({ userId, token });

    if (existing) {
      existing.isActive = true;
      existing.lastUsedAt = new Date();
      existing.platform = platform;
      if (deviceName) existing.deviceName = deviceName;
      return existing.save();
    }

    const deviceToken = new this.deviceTokenModel({
      userId,
      token,
      platform,
      deviceName,
      isActive: true,
      lastUsedAt: new Date(),
    });

    return deviceToken.save();
  }

  /**
   * Remove a device token
   */
  async removeDeviceToken(userId: string, token: string): Promise<void> {
    await this.deviceTokenModel.findOneAndUpdate(
      { userId, token },
      { isActive: false },
    );
  }

  /**
   * Get all active device tokens for a user
   */
  async getDeviceTokens(userId: string): Promise<string[]> {
    const tokens = await this.deviceTokenModel.find({
      userId,
      isActive: true,
    });
    return tokens.map((t) => t.token);
  }

  /**
   * Create a notification and send it via push & websocket
   */
  async create(
    userId: string,
    subject: string,
    message: string,
    type: NotificationType = NotificationType.PUSH,
    data?: Record<string, string>,
  ): Promise<Notification> {
    // Save notification to database
    const notification = new this.notificationModel({
      userId,
      type,
      subject,
      message,
      priority: NotificationPriority.MEDIUM,
      status: NotificationStatus.PENDING,
      data,
    });

    const saved = await notification.save();

    // Send via WebSocket for instant delivery
    this.websocketGateway.emitToUser(userId, 'notification', {
      id: saved._id,
      title: subject,
      message,
      type,
      data,
      timestamp: new Date().toISOString(),
    });

    // Send push notification if type includes push
    if (type === NotificationType.PUSH || type === NotificationType.ALL) {
      try {
        const tokens = await this.getDeviceTokens(userId);
        if (tokens.length > 0) {
          const payload: PushNotificationPayload = {
            title: subject,
            body: message,
            data: data
              ? { ...data, notificationId: saved._id?.toString() || '' }
              : undefined,
          };
          await this.firebaseService.sendToDevices(tokens, payload);
          saved.status = NotificationStatus.SENT;
          await saved.save();
        }
      } catch (error) {
        this.logger.error(`Failed to send push notification: ${error}`);
      }
    }

    return saved;
  }

  /**
   * Send push notification to a specific user
   */
  async sendPush(
    userId: string,
    payload: PushNotificationPayload,
  ): Promise<boolean> {
    const tokens = await this.getDeviceTokens(userId);
    if (tokens.length === 0) {
      this.logger.warn(`No device tokens found for user: ${userId}`);
      return false;
    }

    const result = await this.firebaseService.sendToDevices(tokens, payload);
    return result.success > 0;
  }

  async findByUser(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ created_at: -1 })
      .limit(100)
      .exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel
      .countDocuments({
        userId,
        status: { $in: [NotificationStatus.PENDING, NotificationStatus.SENT] },
      })
      .exec();
  }

  async markAsRead(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel
      .findByIdAndUpdate(
        id,
        { status: NotificationStatus.READ, readAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel
      .updateMany(
        { userId, status: { $ne: NotificationStatus.READ } },
        { status: NotificationStatus.READ, readAt: new Date() },
      )
      .exec();
    return { message: 'All notifications marked as read' };
  }

  // ============ Event Listeners ============

  @OnEvent('trip.created')
  async handleTripCreated(payload: { tripId: string; customerId: string }) {
    this.logger.log(`Trip created event: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Trip Requested',
      'Your trip request has been submitted. Looking for a driver...',
      NotificationType.PUSH,
      { tripId: payload.tripId, action: 'view_trip' },
    );
  }

  @OnEvent('trip.accepted')
  async handleTripAccepted(payload: {
    tripId: string;
    customerId: string;
    driverName: string;
    vehicleInfo: string;
  }) {
    this.logger.log(`Trip accepted: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Driver Found! 🚗',
      `${payload.driverName} is on the way in a ${payload.vehicleInfo}`,
      NotificationType.PUSH,
      { tripId: payload.tripId, action: 'track_trip' },
    );
  }

  @OnEvent('trip.driver_arriving')
  async handleDriverArriving(payload: {
    tripId: string;
    customerId: string;
    eta: number;
  }) {
    this.logger.log(`Driver arriving: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Driver Arriving 📍',
      `Your driver will arrive in ${payload.eta} minutes`,
      NotificationType.PUSH,
      { tripId: payload.tripId, action: 'track_trip' },
    );
  }

  @OnEvent('trip.started')
  async handleTripStarted(payload: { tripId: string; customerId: string }) {
    this.logger.log(`Trip started: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Trip Started 🚀',
      'Your trip has begun. Enjoy your ride!',
      NotificationType.PUSH,
      { tripId: payload.tripId, action: 'view_trip' },
    );
  }

  @OnEvent('trip.completed')
  async handleTripCompleted(payload: {
    tripId: string;
    customerId: string;
    fare: number;
  }) {
    this.logger.log(`Trip completed: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Trip Completed ✅',
      `Your trip is complete. Total fare: ₹${payload.fare}. Please rate your driver!`,
      NotificationType.PUSH,
      { tripId: payload.tripId, action: 'rate_trip' },
    );
  }

  @OnEvent('payment.completed')
  async handlePaymentCompleted(payload: {
    payment: { id: string; amount: number; trip_id?: string };
    userId: string;
  }) {
    this.logger.log(`Payment completed: ${payload.payment.id}`);
    await this.create(
      payload.userId,
      'Payment Successful 💰',
      `Payment of ₹${payload.payment.amount} completed successfully`,
      NotificationType.PUSH,
      { paymentId: payload.payment.id, action: 'view_payment' },
    );

    // Also send via WebSocket for instant update
    this.websocketGateway.emitPaymentUpdate(payload.userId, {
      id: payload.payment.id,
      amount: payload.payment.amount,
      status: 'completed',
      tripId: payload.payment.trip_id,
    });
  }

  @OnEvent('payment.refunded')
  async handlePaymentRefunded(payload: {
    payment: { id: string; amount: number };
    userId: string;
    reason: string;
  }) {
    this.logger.log(`Payment refunded: ${payload.payment.id}`);
    await this.create(
      payload.userId,
      'Refund Processed 💸',
      `₹${payload.payment.amount} has been refunded to your account. Reason: ${payload.reason}`,
      NotificationType.PUSH,
      { paymentId: payload.payment.id, action: 'view_payment' },
    );
  }
}
