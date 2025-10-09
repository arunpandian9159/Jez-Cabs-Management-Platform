import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { 
  Notification, 
  NotificationDocument, 
  NotificationType, 
  NotificationStatus,
  NotificationPriority 
} from '../schemas/notification.schema';
import { 
  NotificationPreference, 
  NotificationPreferenceDocument 
} from '../schemas/notification-preference.schema';
import { CreateNotificationDto, UpdatePreferenceDto } from '../dto';
import { User } from '../../iam/entities';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreference.name)
    private preferenceModel: Model<NotificationPreferenceDocument>,
  ) {}

  async create(createDto: CreateNotificationDto, currentUser: User): Promise<Notification> {
    const notification = new this.notificationModel({
      ...createDto,
      companyId: currentUser.companyId,
      priority: createDto.priority || NotificationPriority.MEDIUM,
    });

    const savedNotification = await notification.save();

    // Attempt to send notification
    this.sendNotification(savedNotification);

    return savedNotification;
  }

  async findAll(currentUser: User, userId?: string) {
    const filter: any = { companyId: currentUser.companyId };
    if (userId) {
      filter.userId = userId;
    }

    return this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async findOne(id: string, currentUser: User): Promise<Notification> {
    const notification = await this.notificationModel
      .findOne({ _id: id, companyId: currentUser.companyId })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, currentUser: User): Promise<NotificationDocument> {
    const notification = await this.findOne(id, currentUser);

    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();

    return (notification as NotificationDocument).save();
  }

  async getUnreadCount(currentUser: User, userId?: string): Promise<number> {
    const filter: any = { 
      companyId: currentUser.companyId,
      status: { $in: [NotificationStatus.PENDING, NotificationStatus.SENT] },
    };
    
    if (userId) {
      filter.userId = userId;
    }

    return this.notificationModel.countDocuments(filter).exec();
  }

  // Notification Preferences
  async getPreferences(currentUser: User): Promise<NotificationPreference> {
    let preferences = await this.preferenceModel
      .findOne({ companyId: currentUser.companyId, userId: currentUser.id })
      .exec();

    if (!preferences) {
      // Create default preferences
      preferences = new this.preferenceModel({
        companyId: currentUser.companyId,
        userId: currentUser.id,
      });
      await preferences.save();
    }

    return preferences;
  }

  async updatePreferences(
    updateDto: UpdatePreferenceDto,
    currentUser: User,
  ): Promise<NotificationPreference> {
    let preferences = await this.preferenceModel
      .findOne({ companyId: currentUser.companyId, userId: currentUser.id })
      .exec();

    if (!preferences) {
      preferences = new this.preferenceModel({
        companyId: currentUser.companyId,
        userId: currentUser.id,
        ...updateDto,
      });
    } else {
      Object.assign(preferences, updateDto);
    }

    return preferences.save();
  }

  // Event Listeners
  @OnEvent('booking.created')
  async handleBookingCreated(payload: any) {
    this.logger.log(`Booking created event received: ${payload.bookingId}`);
    
    // Create notification (simplified - in production, fetch user details)
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.MEDIUM,
      subject: 'New Booking Created',
      message: `A new booking has been created for cab ${payload.cabId}`,
      recipient: 'admin@company.com', // In production, fetch from user/company
      metadata: payload,
    });

    await notification.save();
    this.logger.log(`Notification created for booking: ${payload.bookingId}`);
  }

  @OnEvent('booking.status.changed')
  async handleBookingStatusChanged(payload: any) {
    this.logger.log(`Booking status changed: ${payload.bookingId} -> ${payload.newStatus}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.MEDIUM,
      subject: 'Booking Status Updated',
      message: `Booking status changed to ${payload.newStatus}`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('invoice.created')
  async handleInvoiceCreated(payload: any) {
    this.logger.log(`Invoice created event received: ${payload.invoiceId}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.HIGH,
      subject: 'New Invoice Generated',
      message: `Invoice ${payload.invoiceNumber} has been generated`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('invoice.status.changed')
  async handleInvoiceStatusChanged(payload: any) {
    this.logger.log(`Invoice status changed: ${payload.invoiceId} -> ${payload.newStatus}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: payload.newStatus === 'PAID' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
      subject: 'Invoice Status Updated',
      message: `Invoice ${payload.invoiceNumber} status changed to ${payload.newStatus}`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('checklist.approved')
  async handleChecklistApproved(payload: any) {
    this.logger.log(`Checklist approved: ${payload.checklistId}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.MEDIUM,
      subject: 'Checklist Approved',
      message: `Checklist for cab ${payload.cabId} has been approved`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('checklist.rejected')
  async handleChecklistRejected(payload: any) {
    this.logger.log(`Checklist rejected: ${payload.checklistId}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.HIGH,
      subject: 'Checklist Rejected',
      message: `Checklist for cab ${payload.cabId} has been rejected`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('driver.activated')
  async handleDriverActivated(payload: any) {
    this.logger.log(`Driver activated: ${payload.driverId}`);
    
    const notification = new this.notificationModel({
      companyId: payload.companyId,
      type: NotificationType.EMAIL,
      priority: NotificationPriority.LOW,
      subject: 'Driver Activated',
      message: `Driver has been activated`,
      recipient: 'admin@company.com',
      metadata: payload,
    });

    await notification.save();
  }

  @OnEvent('telematics.event')
  async handleTelematicsEvent(payload: any) {
    if (payload.eventType !== 'NORMAL') {
      this.logger.log(`Telematics event: ${payload.eventType} for cab ${payload.cabId}`);
      
      const notification = new this.notificationModel({
        companyId: payload.companyId,
        type: NotificationType.PUSH,
        priority: NotificationPriority.URGENT,
        subject: `Telematics Alert: ${payload.eventType}`,
        message: `${payload.eventType} detected for cab ${payload.cabId}`,
        recipient: 'admin@company.com',
        metadata: payload,
      });

      await notification.save();
    }
  }

  // Helper method to send notifications (mock implementation)
  private async sendNotification(notification: NotificationDocument) {
    try {
      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      // or SMS service (Twilio, etc.)

      this.logger.log(`Sending ${notification.type} notification to ${notification.recipient}`);
      this.logger.log(`Subject: ${notification.subject}`);
      this.logger.log(`Message: ${notification.message}`);

      // Mark as sent
      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
      await notification.save();

      this.logger.log(`Notification sent successfully: ${notification._id}`);
    } catch (error: any) {
      this.logger.error(`Failed to send notification: ${error.message}`);

      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error.message;
      notification.retryCount += 1;
      await notification.save();
    }
  }
}

