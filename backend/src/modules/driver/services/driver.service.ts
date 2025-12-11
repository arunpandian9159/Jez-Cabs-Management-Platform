import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile } from '../entities/driver-profile.entity';
import { DriverStatus } from '../../../common/enums';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverProfile)
    private readonly driverRepository: Repository<DriverProfile>,
  ) { }

  async getProfile(userId: string): Promise<DriverProfile> {
    const profile = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, data: Partial<DriverProfile>): Promise<DriverProfile> {
    const profile = this.driverRepository.create({
      ...data,
      user_id: userId,
      status: DriverStatus.OFFLINE,
    });
    return this.driverRepository.save(profile);
  }

  async updateProfile(userId: string, data: Partial<DriverProfile>): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, data);
    return this.driverRepository.save(profile);
  }

  async updateStatus(userId: string, status: DriverStatus): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.status = status;
    profile.is_online = status === DriverStatus.AVAILABLE;
    return this.driverRepository.save(profile);
  }

  async updateLocation(userId: string, lat: number, lng: number): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.current_location_lat = lat;
    profile.current_location_lng = lng;
    return this.driverRepository.save(profile);
  }

  async goOnline(userId: string): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.is_online = true;
    profile.status = DriverStatus.AVAILABLE;
    return this.driverRepository.save(profile);
  }

  async goOffline(userId: string): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.is_online = false;
    profile.status = DriverStatus.OFFLINE;
    return this.driverRepository.save(profile);
  }

  async getEarnings(userId: string) {
    const profile = await this.getProfile(userId);
    return {
      totalEarnings: profile.total_earnings,
      totalTrips: profile.total_trips,
      rating: profile.rating,
    };
  }

  async getAvailableDrivers(lat?: number, lng?: number): Promise<DriverProfile[]> {
    const queryBuilder = this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.is_online = true')
      .andWhere('driver.status = :status', { status: DriverStatus.AVAILABLE });

    // In production, add distance-based filtering
    return queryBuilder.getMany();
  }
}
