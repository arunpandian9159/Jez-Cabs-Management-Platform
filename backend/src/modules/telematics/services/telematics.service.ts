import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TelematicsLog, TelematicsLogDocument } from '../schemas/telematics-log.schema';
import { CreateTelematicsLogDto, FilterTelematicsDto, TelematicsEventType } from '../dto';
import { User } from '../../iam/entities';
import { Cab } from '../../cab/entities';

@Injectable()
export class TelematicsService {
  constructor(
    @InjectModel(TelematicsLog.name)
    private telematicsModel: Model<TelematicsLogDocument>,
    @InjectRepository(Cab)
    private cabRepository: Repository<Cab>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createDto: CreateTelematicsLogDto, currentUser: User): Promise<TelematicsLog> {
    // Verify cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: createDto.cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    // Create telematics log
    const log = new this.telematicsModel({
      ...createDto,
      companyId: currentUser.company_id,
    });

    const savedLog = await log.save();

    // Emit event based on event type
    if (createDto.eventType && createDto.eventType !== TelematicsEventType.NORMAL) {
      this.eventEmitter.emit('telematics.event', {
        logId: savedLog._id,
        companyId: savedLog.companyId,
        cabId: savedLog.cabId,
        eventType: savedLog.eventType,
        location: savedLog.location,
        timestamp: savedLog.timestamp,
      });
    }

    return savedLog;
  }

  async findAll(filterDto: FilterTelematicsDto, currentUser: User) {
    const {
      cabId,
      gpsDeviceId,
      bookingId,
      eventType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'DESC',
    } = filterDto;

    const filter: any = { companyId: currentUser.company_id };

    if (cabId) filter.cabId = cabId;
    if (gpsDeviceId) filter.gpsDeviceId = gpsDeviceId;
    if (bookingId) filter.bookingId = bookingId;
    if (eventType) filter.eventType = eventType;

    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'ASC' ? 1 : -1;

    const [logs, total] = await Promise.all([
      this.telematicsModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.telematicsModel.countDocuments(filter).exec(),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<TelematicsLog> {
    const log = await this.telematicsModel
      .findOne({ _id: id, companyId: currentUser.company_id })
      .exec();

    if (!log) {
      throw new NotFoundException('Telematics log not found');
    }

    return log;
  }

  async getLatestLocation(cabId: string, currentUser: User): Promise<TelematicsLog | null> {
    // Verify cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    const latestLog = await this.telematicsModel
      .findOne({ cabId, companyId: currentUser.company_id })
      .sort({ timestamp: -1 })
      .exec();

    return latestLog;
  }

  async getRoute(cabId: string, startDate: Date, endDate: Date, currentUser: User) {
    // Verify cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    const logs = await this.telematicsModel
      .find({
        cabId,
        companyId: currentUser.company_id,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .sort({ timestamp: 1 })
      .select('timestamp location speed heading')
      .exec();

    return {
      cabId,
      startDate,
      endDate,
      totalPoints: logs.length,
      route: logs,
    };
  }

  async getStatistics(cabId: string, startDate: Date, endDate: Date, currentUser: User) {
    // Verify cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    const logs = await this.telematicsModel
      .find({
        cabId,
        companyId: currentUser.company_id,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .exec();

    if (logs.length === 0) {
      return {
        cabId,
        startDate,
        endDate,
        totalLogs: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        totalDistance: 0,
        events: {},
      };
    }

    // Calculate statistics
    const speeds = logs.map((log) => log.speed || 0);
    const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);

    // Calculate approximate distance using Haversine formula
    let totalDistance = 0;
    for (let i = 1; i < logs.length; i++) {
      const prev = logs[i - 1].location;
      const curr = logs[i].location;
      totalDistance += this.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude,
      );
    }

    // Count events by type
    const events: Record<string, number> = {};
    logs.forEach((log) => {
      const eventType = log.eventType || 'NORMAL';
      events[eventType] = (events[eventType] || 0) + 1;
    });

    return {
      cabId,
      startDate,
      endDate,
      totalLogs: logs.length,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      maxSpeed,
      totalDistance: Math.round(totalDistance * 100) / 100,
      events,
    };
  }

  // Generate mock GPS data for testing
  async generateMockData(cabId: string, count: number, currentUser: User): Promise<TelematicsLog[]> {
    // Verify cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    const logs: TelematicsLog[] = [];
    const baseLatitude = 40.7128; // New York City
    const baseLongitude = -74.0060;
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now.getTime() - (count - i) * 60000); // 1 minute intervals
      const latitude = baseLatitude + (Math.random() - 0.5) * 0.1;
      const longitude = baseLongitude + (Math.random() - 0.5) * 0.1;
      const speed = Math.random() * 80; // 0-80 km/h
      const heading = Math.random() * 360;

      // Determine event type based on speed
      let eventType = TelematicsEventType.NORMAL;
      if (speed > 70) {
        eventType = TelematicsEventType.SPEEDING;
      } else if (speed < 5 && i > 0) {
        eventType = TelematicsEventType.IDLE;
      }

      const log = new this.telematicsModel({
        companyId: currentUser.company_id,
        cabId,
        gpsDeviceId: cab.gps_device_id || `GPS-${cabId.substring(0, 8)}`,
        timestamp,
        location: { latitude, longitude },
        speed,
        heading,
        altitude: 10 + Math.random() * 100,
        eventType,
        metadata: { generated: true },
      });

      const savedLog = await log.save();
      logs.push(savedLog);
    }

    return logs;
  }

  // Helper: Calculate distance between two GPS coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

