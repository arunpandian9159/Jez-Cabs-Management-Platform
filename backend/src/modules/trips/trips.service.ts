import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { TripStatus } from '../../common/enums';

// OTP Configuration Constants
const OTP_MIN = 100000;
const OTP_MAX = 999999;

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) { }

  async create(data: Partial<Trip>): Promise<Trip> {
    // Generate 6-digit OTP for trip verification
    const otp = Math.floor(OTP_MIN + Math.random() * (OTP_MAX - OTP_MIN + 1)).toString();
    const trip = this.tripRepository.create({
      ...data,
      otp,
      status: TripStatus.PENDING,
    });
    return this.tripRepository.save(trip);
  }

  async findAll(userId: string, role: string): Promise<Trip[]> {
    if (role === 'customer') {
      return this.tripRepository.find({
        where: { customer_id: userId },
        relations: ['customer', 'driver'],
        order: { created_at: 'DESC' },
      });
    } else if (role === 'driver') {
      return this.tripRepository.find({
        where: { driver_id: userId },
        relations: ['customer', 'driver'],
        order: { created_at: 'DESC' },
      });
    }
    // For admin users, return all trips with relations
    return this.tripRepository.find({
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
    return this.tripRepository.save(trip);
  }

  async startTrip(tripId: string, otp: string): Promise<Trip> {
    const trip = await this.findOne(tripId);
    if (trip.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    trip.status = TripStatus.IN_PROGRESS;
    trip.started_at = new Date();
    return this.tripRepository.save(trip);
  }

  async completeTrip(tripId: string, actualFare: number): Promise<Trip> {
    const trip = await this.findOne(tripId);
    trip.status = TripStatus.COMPLETED;
    trip.completed_at = new Date();
    trip.actual_fare = actualFare;
    return this.tripRepository.save(trip);
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
}
