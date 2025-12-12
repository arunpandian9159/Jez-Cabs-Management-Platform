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
      relations: ['user'],
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
    try {
      const profile = await this.getProfile(userId);

      // Query actual trips from database
      // trips.driver_id stores the user's ID, not the driver_profile ID
      console.log('Fetching earnings for user_id:', userId);

      const completedTrips = await this.driverRepository.manager.query(`
        SELECT 
          actual_fare,
          estimated_fare,
          tip_amount,
          completed_at,
          EXTRACT(DOW FROM completed_at) as day_of_week
        FROM trips
        WHERE driver_id = $1
          AND status = 'completed'
          AND completed_at IS NOT NULL
        ORDER BY completed_at DESC
      `, [userId]);

      console.log('Found completed trips:', completedTrips.length);

      // Calculate date boundaries
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      console.log('Date boundaries:', { todayStart, weekAgo, monthAgo });

      // Calculate earnings
      let todayEarnings = 0;
      let weekEarnings = 0;
      let monthEarnings = 0;
      let totalEarnings = 0;

      // Weekly breakdown: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
      const weeklyBreakdown = [
        { day: 'Sun', earnings: 0, trips: 0 },
        { day: 'Mon', earnings: 0, trips: 0 },
        { day: 'Tue', earnings: 0, trips: 0 },
        { day: 'Wed', earnings: 0, trips: 0 },
        { day: 'Thu', earnings: 0, trips: 0 },
        { day: 'Fri', earnings: 0, trips: 0 },
        { day: 'Sat', earnings: 0, trips: 0 },
      ];

      completedTrips.forEach((trip: any) => {
        const fare = parseFloat(trip.actual_fare || trip.estimated_fare || '0');
        const tip = parseFloat(trip.tip_amount || '0');
        const tripTotal = fare + tip;
        const completedAt = new Date(trip.completed_at);

        console.log('Processing trip:', { fare, tip, tripTotal, completedAt });

        totalEarnings += tripTotal;

        // Check if trip is from today
        if (completedAt >= todayStart) {
          todayEarnings += tripTotal;
        }

        // Check if trip is from last 7 days
        if (completedAt >= weekAgo) {
          weekEarnings += tripTotal;

          // Add to weekly breakdown
          const dayOfWeek = parseInt(trip.day_of_week);
          if (dayOfWeek >= 0 && dayOfWeek <= 6) {
            weeklyBreakdown[dayOfWeek].earnings += tripTotal;
            weeklyBreakdown[dayOfWeek].trips += 1;
          }
        }

        // Check if trip is from last 30 days
        if (completedAt >= monthAgo) {
          monthEarnings += tripTotal;
        }
      });

      console.log('Earnings calculated:', { todayEarnings, weekEarnings, monthEarnings, totalEarnings });

      return {
        today: Math.round(todayEarnings),
        thisWeek: Math.round(weekEarnings),
        thisMonth: Math.round(monthEarnings),
        total: Math.round(totalEarnings),
        transactions: [],
        weeklyBreakdown: weeklyBreakdown,
      };
    } catch (error) {
      console.error('Error in getEarnings:', error);
      // Return default values on error
      return {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0,
        transactions: [],
        weeklyBreakdown: [
          { day: 'Sun', earnings: 0, trips: 0 },
          { day: 'Mon', earnings: 0, trips: 0 },
          { day: 'Tue', earnings: 0, trips: 0 },
          { day: 'Wed', earnings: 0, trips: 0 },
          { day: 'Thu', earnings: 0, trips: 0 },
          { day: 'Fri', earnings: 0, trips: 0 },
          { day: 'Sat', earnings: 0, trips: 0 },
        ],
      };
    }
  }

  async getDashboardStats(userId: string) {
    const profile = await this.getProfile(userId);

    // Calculate earnings from actual trip data
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query trips for earnings calculation
    const trips = await this.driverRepository.manager.query(`
      SELECT 
        actual_fare,
        estimated_fare,
        tip_amount,
        completed_at
      FROM trips
      WHERE driver_id = $1
        AND status = 'completed'
        AND completed_at IS NOT NULL
    `, [userId]);

    let todayEarnings = 0;
    let weeklyEarnings = 0;
    let monthlyEarnings = 0;

    trips.forEach((trip: any) => {
      const fare = parseFloat(trip.actual_fare || trip.estimated_fare || '0');
      const tip = parseFloat(trip.tip_amount || '0');
      const tripTotal = fare + tip;
      const completedAt = new Date(trip.completed_at);

      if (completedAt >= todayStart) {
        todayEarnings += tripTotal;
      }
      if (completedAt >= weekAgo) {
        weeklyEarnings += tripTotal;
      }
      if (completedAt >= monthAgo) {
        monthlyEarnings += tripTotal;
      }
    });

    return {
      todayEarnings: Math.round(todayEarnings),
      weeklyEarnings: Math.round(weeklyEarnings),
      monthlyEarnings: Math.round(monthlyEarnings),
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

