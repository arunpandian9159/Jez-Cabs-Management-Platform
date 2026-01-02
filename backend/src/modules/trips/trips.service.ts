import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThan,
  IsNull,
  Not,
  Between,
} from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Trip } from './entities/trip.entity';
import {
  RecurringRide,
  RecurrenceType,
  RecurringRideStatus,
} from './entities/recurring-ride.entity';
import { TripStatus } from '../../common/enums';
import { ScheduleTripDto, UpdateScheduledTripDto } from './dto';

// OTP Configuration Constants
const OTP_MIN = 100000;
const OTP_MAX = 999999;

// Scheduling constants
const MAX_ADVANCE_BOOKING_DAYS = 7;
const REMINDER_MINUTES_BEFORE = 30;

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(RecurringRide)
    private recurringRideRepository: Repository<RecurringRide>,
    private eventEmitter: EventEmitter2,
  ) {}

  // ============ Basic Trip Methods ============

  async create(data: Partial<Trip>): Promise<Trip> {
    // Generate 6-digit OTP for trip verification
    const otp = Math.floor(
      OTP_MIN + Math.random() * (OTP_MAX - OTP_MIN + 1),
    ).toString();

    const trip = this.tripRepository.create({
      ...data,
      otp,
      status: data.scheduled_at ? TripStatus.PENDING : TripStatus.PENDING,
    });

    const savedTrip = await this.tripRepository.save(trip);

    // Emit event for notifications
    this.eventEmitter.emit('trip.created', {
      tripId: savedTrip.id,
      customerId: savedTrip.customer_id,
      scheduled: !!savedTrip.scheduled_at,
    });

    return savedTrip;
  }

  async findAll(
    userId: string,
    role: string,
    status?: string,
  ): Promise<Trip[]> {
    const whereClause: Record<string, unknown> = {};

    if (status) {
      whereClause.status = status;
    }

    if (role === 'customer') {
      return this.tripRepository.find({
        where: { ...whereClause, customer_id: userId },
        relations: ['customer', 'driver'],
        order: { created_at: 'DESC' },
      });
    } else if (role === 'driver') {
      return this.tripRepository.find({
        where: { ...whereClause, driver_id: userId },
        relations: ['customer', 'driver'],
        order: { created_at: 'DESC' },
      });
    }

    return this.tripRepository.find({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      relations: ['customer', 'driver'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['customer', 'driver'],
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async acceptTrip(
    tripId: string,
    driverId: string,
    cabId: string,
  ): Promise<Trip> {
    const trip = await this.findOne(tripId);
    if (trip.status !== TripStatus.PENDING) {
      throw new BadRequestException('Trip is not available');
    }
    trip.driver_id = driverId;
    trip.cab_id = cabId;
    trip.status = TripStatus.ACCEPTED;
    trip.accepted_at = new Date();

    const savedTrip = await this.tripRepository.save(trip);

    this.eventEmitter.emit('trip.accepted', {
      tripId: savedTrip.id,
      customerId: savedTrip.customer_id,
      driverName: '', // Would come from driver lookup
      vehicleInfo: '', // Would come from cab lookup
    });

    return savedTrip;
  }

  async startTrip(tripId: string, otp: string): Promise<Trip> {
    const trip = await this.findOne(tripId);
    if (trip.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    trip.status = TripStatus.IN_PROGRESS;
    trip.started_at = new Date();

    const savedTrip = await this.tripRepository.save(trip);

    this.eventEmitter.emit('trip.started', {
      tripId: savedTrip.id,
      customerId: savedTrip.customer_id,
    });

    return savedTrip;
  }

  async completeTrip(tripId: string, actualFare: number): Promise<Trip> {
    const trip = await this.findOne(tripId);
    trip.status = TripStatus.COMPLETED;
    trip.completed_at = new Date();
    trip.actual_fare = actualFare;

    const savedTrip = await this.tripRepository.save(trip);

    this.eventEmitter.emit('trip.completed', {
      tripId: savedTrip.id,
      customerId: savedTrip.customer_id,
      fare: actualFare,
    });

    return savedTrip;
  }

  async cancelTrip(
    tripId: string,
    userId: string,
    reason: string,
  ): Promise<Trip> {
    const trip = await this.findOne(tripId);
    trip.status = TripStatus.CANCELLED;
    trip.cancelled_at = new Date();
    trip.cancelled_by = userId;
    trip.cancellation_reason = reason;
    return this.tripRepository.save(trip);
  }

  async rateTrip(
    tripId: string,
    rating: number,
    feedback: string,
    isCustomer: boolean,
  ): Promise<Trip> {
    const trip = await this.findOne(tripId);
    if (isCustomer) {
      trip.driver_rating = rating;
      trip.customer_feedback = feedback;
    } else {
      trip.customer_rating = rating;
      trip.driver_feedback = feedback;
    }
    return this.tripRepository.save(trip);
  }

  // ============ Scheduled Rides Methods ============

  /**
   * Schedule a future trip (up to 7 days in advance)
   */
  async scheduleTrip(
    userId: string,
    dto: ScheduleTripDto,
  ): Promise<Trip | RecurringRide> {
    const scheduledDate = new Date(dto.scheduled_at);
    const now = new Date();
    const maxDate = new Date(
      now.getTime() + MAX_ADVANCE_BOOKING_DAYS * 24 * 60 * 60 * 1000,
    );

    // Validate scheduling time
    if (scheduledDate <= now) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    if (scheduledDate > maxDate) {
      throw new BadRequestException(
        `Cannot schedule more than ${MAX_ADVANCE_BOOKING_DAYS} days in advance`,
      );
    }

    // If recurring, create a recurring ride
    if (dto.recurrence && dto.recurrence !== RecurrenceType.NONE) {
      return this.createRecurringRide(userId, dto);
    }

    // Create a one-time scheduled trip
    const lockedFare = dto.lock_fare ? dto.estimated_fare : null;

    const trip = await this.create({
      customer_id: userId,
      pickup_address: dto.pickup_address,
      pickup_lat: dto.pickup_lat,
      pickup_lng: dto.pickup_lng,
      dropoff_address: dto.dropoff_address,
      dropoff_lat: dto.dropoff_lat,
      dropoff_lng: dto.dropoff_lng,
      scheduled_at: scheduledDate,
      estimated_fare: lockedFare || dto.estimated_fare,
    });

    return trip;
  }

  /**
   * Create a recurring ride schedule
   */
  async createRecurringRide(
    userId: string,
    dto: ScheduleTripDto,
  ): Promise<RecurringRide> {
    const scheduledDate = new Date(dto.scheduled_at);
    const timeString = scheduledDate.toTimeString().split(' ')[0];

    // Determine recurrence days based on type
    let recurrenceDays: number[] | null = null;
    if (dto.recurrence === RecurrenceType.WEEKDAYS) {
      recurrenceDays = [1, 2, 3, 4, 5]; // Monday to Friday
    } else if (dto.recurrence === RecurrenceType.DAILY) {
      recurrenceDays = [0, 1, 2, 3, 4, 5, 6]; // All days
    } else if (
      dto.recurrence === RecurrenceType.CUSTOM &&
      dto.recurrence_days
    ) {
      recurrenceDays = dto.recurrence_days;
    }

    const recurringRide = this.recurringRideRepository.create({
      customer_id: userId,
      pickup_address: dto.pickup_address,
      pickup_lat: dto.pickup_lat,
      pickup_lng: dto.pickup_lng,
      dropoff_address: dto.dropoff_address,
      dropoff_lat: dto.dropoff_lat,
      dropoff_lng: dto.dropoff_lng,
      scheduled_time: timeString,
      cab_type: dto.cab_type || null,
      locked_fare: dto.lock_fare ? dto.estimated_fare || null : null,
      recurrence_type: dto.recurrence!,
      recurrence_days: recurrenceDays,
      start_date: scheduledDate,
      end_date: dto.recurrence_end_date
        ? new Date(dto.recurrence_end_date)
        : null,
      notes: dto.notes || null,
      status: RecurringRideStatus.ACTIVE,
      next_ride_at: this.calculateNextRideDate(
        scheduledDate,
        timeString,
        dto.recurrence!,
        recurrenceDays,
      ),
    });

    return this.recurringRideRepository.save(recurringRide);
  }

  /**
   * Get all scheduled trips for a user
   */
  async getScheduledTrips(userId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: {
        customer_id: userId,
        scheduled_at: Not(IsNull()),
        status: TripStatus.PENDING,
      },
      order: { scheduled_at: 'ASC' },
    });
  }

  /**
   * Get all recurring rides for a user
   */
  async getRecurringRides(userId: string): Promise<RecurringRide[]> {
    return this.recurringRideRepository.find({
      where: {
        customer_id: userId,
        status: RecurringRideStatus.ACTIVE,
      },
      order: { next_ride_at: 'ASC' },
    });
  }

  /**
   * Update a scheduled trip
   */
  async updateScheduledTrip(
    tripId: string,
    userId: string,
    dto: UpdateScheduledTripDto,
  ): Promise<Trip> {
    const trip = await this.findOne(tripId);

    if (trip.customer_id !== userId) {
      throw new BadRequestException(
        'You can only update your own scheduled trips',
      );
    }

    if (trip.status !== TripStatus.PENDING) {
      throw new BadRequestException('Can only update pending trips');
    }

    // Validate new scheduled time if provided
    if (dto.scheduled_at) {
      const scheduledDate = new Date(dto.scheduled_at);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new BadRequestException('Scheduled time must be in the future');
      }
      trip.scheduled_at = scheduledDate;
    }

    // Update other fields if provided
    if (dto.pickup_address) trip.pickup_address = dto.pickup_address;
    if (dto.pickup_lat) trip.pickup_lat = dto.pickup_lat;
    if (dto.pickup_lng) trip.pickup_lng = dto.pickup_lng;
    if (dto.dropoff_address) trip.dropoff_address = dto.dropoff_address;
    if (dto.dropoff_lat) trip.dropoff_lat = dto.dropoff_lat;
    if (dto.dropoff_lng) trip.dropoff_lng = dto.dropoff_lng;

    return this.tripRepository.save(trip);
  }

  /**
   * Cancel a scheduled trip
   */
  async cancelScheduledTrip(tripId: string, userId: string): Promise<Trip> {
    const trip = await this.findOne(tripId);

    if (trip.customer_id !== userId) {
      throw new BadRequestException('You can only cancel your own trips');
    }

    if (!trip.scheduled_at) {
      throw new BadRequestException('This is not a scheduled trip');
    }

    return this.cancelTrip(tripId, userId, 'Cancelled by customer');
  }

  /**
   * Cancel a recurring ride
   */
  async cancelRecurringRide(
    recurringRideId: string,
    userId: string,
  ): Promise<RecurringRide> {
    const recurringRide = await this.recurringRideRepository.findOne({
      where: { id: recurringRideId },
    });

    if (!recurringRide) {
      throw new NotFoundException('Recurring ride not found');
    }

    if (recurringRide.customer_id !== userId) {
      throw new BadRequestException(
        'You can only cancel your own recurring rides',
      );
    }

    recurringRide.status = RecurringRideStatus.CANCELLED;
    return this.recurringRideRepository.save(recurringRide);
  }

  /**
   * Pause a recurring ride
   */
  async pauseRecurringRide(
    recurringRideId: string,
    userId: string,
  ): Promise<RecurringRide> {
    const recurringRide = await this.recurringRideRepository.findOne({
      where: { id: recurringRideId },
    });

    if (!recurringRide) {
      throw new NotFoundException('Recurring ride not found');
    }

    if (recurringRide.customer_id !== userId) {
      throw new BadRequestException(
        'You can only pause your own recurring rides',
      );
    }

    recurringRide.status = RecurringRideStatus.PAUSED;
    return this.recurringRideRepository.save(recurringRide);
  }

  /**
   * Resume a paused recurring ride
   */
  async resumeRecurringRide(
    recurringRideId: string,
    userId: string,
  ): Promise<RecurringRide> {
    const recurringRide = await this.recurringRideRepository.findOne({
      where: { id: recurringRideId, status: RecurringRideStatus.PAUSED },
    });

    if (!recurringRide) {
      throw new NotFoundException('Paused recurring ride not found');
    }

    if (recurringRide.customer_id !== userId) {
      throw new BadRequestException(
        'You can only resume your own recurring rides',
      );
    }

    recurringRide.status = RecurringRideStatus.ACTIVE;
    recurringRide.next_ride_at = this.calculateNextRideDate(
      new Date(),
      recurringRide.scheduled_time,
      recurringRide.recurrence_type,
      recurringRide.recurrence_days,
    );

    return this.recurringRideRepository.save(recurringRide);
  }

  /**
   * Calculate next ride date based on recurrence pattern
   */
  private calculateNextRideDate(
    fromDate: Date,
    timeString: string,
    recurrenceType: RecurrenceType,
    recurrenceDays: number[] | null,
  ): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    let nextDate = new Date(fromDate);
    nextDate.setHours(hours, minutes, seconds || 0, 0);

    // If the time today has passed, start from tomorrow
    if (nextDate <= new Date()) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    // Find next valid day based on recurrence
    if (recurrenceDays && recurrenceDays.length > 0) {
      let maxIterations = 7;
      while (!recurrenceDays.includes(nextDate.getDay()) && maxIterations > 0) {
        nextDate.setDate(nextDate.getDate() + 1);
        maxIterations--;
      }
    }

    return nextDate;
  }

  /**
   * Get trips that need reminder notifications (called by cron job)
   */
  async getTripsNeedingReminders(): Promise<Trip[]> {
    const now = new Date();
    const reminderWindow = new Date(
      now.getTime() + REMINDER_MINUTES_BEFORE * 60 * 1000,
    );

    return this.tripRepository.find({
      where: {
        scheduled_at: Between(now, reminderWindow),
        status: TripStatus.PENDING,
      },
      relations: ['customer'],
    });
  }
}
