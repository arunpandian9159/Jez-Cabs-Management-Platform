import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Notification,
  NotificationDocument,
  NotificationType,
  NotificationStatus,
  NotificationPriority,
} from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    subject: string,
    message: string,
    type: NotificationType = NotificationType.PUSH,
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      userId,
      type,
      subject,
      message,
      priority: NotificationPriority.MEDIUM,
      status: NotificationStatus.PENDING,
    });

    return notification.save();
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

  // Event Listeners for trip-related notifications
  @OnEvent('trip.created')
  async handleTripCreated(payload: any) {
    this.logger.log(`Trip created event: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Trip Requested',
      'Your trip request has been submitted. Looking for a driver...',
      NotificationType.PUSH,
    );
  }

  @OnEvent('trip.accepted')
  async handleTripAccepted(payload: any) {
    this.logger.log(`Trip accepted: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Driver Found',
      'A driver has accepted your trip request!',
      NotificationType.PUSH,
    );
  }

  @OnEvent('trip.completed')
  async handleTripCompleted(payload: any) {
    this.logger.log(`Trip completed: ${payload.tripId}`);
    await this.create(
      payload.customerId,
      'Trip Completed',
      'Your trip has been completed. Please rate your driver!',
      NotificationType.PUSH,
    );
  }
}
