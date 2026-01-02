import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface LocationUpdate {
  tripId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
}

interface TripStatusUpdate {
  tripId: string;
  status: string;
  message?: string;
  data?: Record<string, unknown>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
@Injectable()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();
  private driverLocations: Map<string, LocationUpdate> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected - no token`);
        client.disconnect();
        return;
      }

      const jwtSecret = this.configService.get<string>('jwt.secret');
      const payload = this.jwtService.verify(token, { secret: jwtSecret });

      client.userId = payload.sub;
      client.userRole = payload.role;

      // Track user's socket connections
      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub)?.add(client.id);

      // Auto-join user to their personal notification room
      client.join(`user:${payload.sub}`);

      this.logger.log(
        `Client connected: ${client.id} (User: ${payload.sub}, Role: ${payload.role})`,
      );
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} disconnected - invalid token: ${error}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.userSockets.get(client.userId)?.delete(client.id);
      if (this.userSockets.get(client.userId)?.size === 0) {
        this.userSockets.delete(client.userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Join a trip room for real-time updates
   */
  @SubscribeMessage('trip:join')
  handleTripJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { tripId: string },
  ) {
    client.join(`trip:${data.tripId}`);
    this.logger.log(`Client ${client.id} joined trip room: ${data.tripId}`);
    return { success: true, room: `trip:${data.tripId}` };
  }

  /**
   * Leave a trip room
   */
  @SubscribeMessage('trip:leave')
  handleTripLeave(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { tripId: string },
  ) {
    client.leave(`trip:${data.tripId}`);
    this.logger.log(`Client ${client.id} left trip room: ${data.tripId}`);
    return { success: true };
  }

  /**
   * Driver sends location update
   */
  @SubscribeMessage('driver:location')
  handleDriverLocation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: LocationUpdate,
  ) {
    if (client.userRole !== 'driver') {
      return {
        success: false,
        error: 'Only drivers can send location updates',
      };
    }

    // Store latest driver location
    this.driverLocations.set(client.userId!, data);

    // Broadcast to the trip room
    this.server.to(`trip:${data.tripId}`).emit('driver:location:update', {
      driverId: client.userId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Get current driver location (for customer)
   */
  @SubscribeMessage('driver:location:get')
  handleGetDriverLocation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { driverId: string },
  ) {
    const location = this.driverLocations.get(data.driverId);
    return { success: true, location: location || null };
  }

  // ============ Server-side emit methods ============

  /**
   * Emit trip status update to all participants
   */
  emitTripStatusUpdate(tripId: string, update: TripStatusUpdate) {
    this.server.to(`trip:${tripId}`).emit('trip:status:update', update);
  }

  /**
   * Emit notification to specific user
   */
  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit driver assignment notification
   */
  emitDriverAssigned(
    tripId: string,
    customerId: string,
    driverInfo: {
      id: string;
      name: string;
      phone: string;
      rating: number;
      vehicle: {
        make: string;
        model: string;
        color: string;
        registration: string;
      };
    },
  ) {
    this.server.to(`trip:${tripId}`).emit('trip:driver:assigned', {
      tripId,
      driver: driverInfo,
      timestamp: new Date().toISOString(),
    });

    this.emitToUser(customerId, 'notification', {
      type: 'driver_assigned',
      title: 'Driver Assigned',
      message: `${driverInfo.name} is on the way in a ${driverInfo.vehicle.color} ${driverInfo.vehicle.make} ${driverInfo.vehicle.model}`,
      data: { tripId, driverId: driverInfo.id },
    });
  }

  /**
   * Emit payment notification
   */
  emitPaymentUpdate(
    userId: string,
    payment: {
      id: string;
      amount: number;
      status: string;
      tripId?: string;
    },
  ) {
    this.emitToUser(userId, 'payment:update', {
      ...payment,
      timestamp: new Date().toISOString(),
    });

    if (payment.status === 'completed') {
      this.emitToUser(userId, 'notification', {
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Payment of ₹${payment.amount} completed successfully`,
        data: { paymentId: payment.id },
      });
    }
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    return (
      this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0
    );
  }

  /**
   * Get all online drivers
   */
  getOnlineDrivers(): string[] {
    const onlineDrivers: string[] = [];
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.size > 0) {
        // We'd need to check role, but for now return all connected users
        // In production, maintain a separate set for drivers
        onlineDrivers.push(userId);
      }
    }
    return onlineDrivers;
  }
}
