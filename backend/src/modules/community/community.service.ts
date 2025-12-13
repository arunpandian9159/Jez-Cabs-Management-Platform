import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import {
  CommunityTrip,
  CommunityTripStatus,
} from './entities/community-trip.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityTrip)
    private tripRepository: Repository<CommunityTrip>,
  ) {}

  async findAll(): Promise<CommunityTrip[]> {
    return this.tripRepository.find({
      where: {
        status: CommunityTripStatus.ACTIVE,
        departure_date: MoreThanOrEqual(new Date()),
      },
      order: { departure_date: 'ASC' },
    });
  }

  async findByUser(userId: string): Promise<CommunityTrip[]> {
    return this.tripRepository.find({
      where: { poster_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async create(data: Partial<CommunityTrip>): Promise<CommunityTrip> {
    const trip = this.tripRepository.create({
      ...data,
      status: CommunityTripStatus.ACTIVE,
    });
    return this.tripRepository.save(trip);
  }

  async findOne(id: string): Promise<CommunityTrip> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Community trip not found');
    }
    return trip;
  }

  async updateSeats(id: string, seatsBooked: number): Promise<CommunityTrip> {
    const trip = await this.findOne(id);
    trip.seats_available -= seatsBooked;
    if (trip.seats_available <= 0) {
      trip.status = CommunityTripStatus.FULL;
    }
    return this.tripRepository.save(trip);
  }

  async cancel(id: string): Promise<CommunityTrip> {
    const trip = await this.findOne(id);
    trip.status = CommunityTripStatus.CANCELLED;
    return this.tripRepository.save(trip);
  }
}
