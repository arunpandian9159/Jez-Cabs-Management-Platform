import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase credentials not configured. Push notifications will be disabled.',
      );
      return;
    }

    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            // Handle escaped newlines in private key
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase:', error);
    }
  }

  /**
   * Send push notification to a single device
   */
  async sendToDevice(
    token: string,
    payload: PushNotificationPayload,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.warn('Firebase not initialized. Skipping push notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            priority: 'high',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
        webpush: {
          notification: {
            icon: '/icons/notification-icon.png',
            badge: '/icons/badge-icon.png',
            vibrate: [200, 100, 200],
          },
        },
      };

      await admin.messaging().send(message);
      this.logger.log(
        `Push notification sent successfully to token: ${token.substring(0, 20)}...`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error}`);
      return false;
    }
  }

  /**
   * Send push notification to multiple devices
   */
  async sendToDevices(
    tokens: string[],
    payload: PushNotificationPayload,
  ): Promise<{ success: number; failure: number }> {
    if (!this.isInitialized) {
      this.logger.warn(
        'Firebase not initialized. Skipping push notifications.',
      );
      return { success: 0, failure: tokens.length };
    }

    if (tokens.length === 0) {
      return { success: 0, failure: 0 };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            priority: 'high',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      this.logger.log(
        `Push notifications sent: ${response.successCount} success, ${response.failureCount} failure`,
      );

      return {
        success: response.successCount,
        failure: response.failureCount,
      };
    } catch (error) {
      this.logger.error(`Failed to send push notifications: ${error}`);
      return { success: 0, failure: tokens.length };
    }
  }

  /**
   * Send push notification to a topic
   */
  async sendToTopic(
    topic: string,
    payload: PushNotificationPayload,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.warn('Firebase not initialized. Skipping push notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
      };

      await admin.messaging().send(message);
      this.logger.log(`Push notification sent to topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification to topic: ${error}`);
      return false;
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    try {
      await admin.messaging().subscribeToTopic(tokens, topic);
      this.logger.log(`Subscribed ${tokens.length} tokens to topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic: ${error}`);
      return false;
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  async unsubscribeFromTopic(
    tokens: string[],
    topic: string,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    try {
      await admin.messaging().unsubscribeFromTopic(tokens, topic);
      this.logger.log(
        `Unsubscribed ${tokens.length} tokens from topic: ${topic}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from topic: ${error}`);
      return false;
    }
  }
}
