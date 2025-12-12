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

    // In production, calculate actual earnings from the earnings table
    // For now, return mock data structure that matches frontend expectations
    // Ensure totalEarnings is always a valid number
    const totalEarnings = Number(profile.total_earnings) || 0;

    return {
      today: Math.round(totalEarnings * 0.1), // Mock: 10% of total
      thisWeek: Math.round(totalEarnings * 0.3), // Mock: 30% of total
      thisMonth: Math.round(totalEarnings * 0.5), // Mock: 50% of total
      total: totalEarnings,
      transactions: [], // Would fetch from earnings table
      weeklyBreakdown: [
        { day: 'Mon', earnings: Math.round(totalEarnings * 0.04), trips: Math.floor(profile.total_trips * 0.04) || 0 },
        { day: 'Tue', earnings: Math.round(totalEarnings * 0.05), trips: Math.floor(profile.total_trips * 0.05) || 0 },
        { day: 'Wed', earnings: Math.round(totalEarnings * 0.06), trips: Math.floor(profile.total_trips * 0.06) || 0 },
        { day: 'Thu', earnings: Math.round(totalEarnings * 0.05), trips: Math.floor(profile.total_trips * 0.05) || 0 },
        { day: 'Fri', earnings: Math.round(totalEarnings * 0.07), trips: Math.floor(profile.total_trips * 0.07) || 0 },
        { day: 'Sat', earnings: Math.round(totalEarnings * 0.02), trips: Math.floor(profile.total_trips * 0.02) || 0 },
        { day: 'Sun', earnings: Math.round(totalEarnings * 0.01), trips: Math.floor(profile.total_trips * 0.01) || 0 },
      ],
    };
  }

  async getDashboardStats(userId: string) {
    const profile = await this.getProfile(userId);

    // Return dashboard statistics
    // In production, these would be calculated from actual trip data
    return {
      todayEarnings: 0, // Would sum today's completed trips
      weeklyEarnings: 0, // Would sum this week's completed trips
      monthlyEarnings: profile.total_earnings || 0,
      totalTrips: profile.total_trips || 0,
      rating: profile.rating || 0,
      acceptanceRate: 95, // Would be calculated from trip acceptance data
      completionRate: 98, // Would be calculated from completed vs cancelled trips
      onlineHours: 0, // Would be calculated from online time logs
    };
  }

  async getTripRequests(userId: string) {
    // In production, this would query pending trip requests assigned to this driver
    // For now, return an empty array
    return [];
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

