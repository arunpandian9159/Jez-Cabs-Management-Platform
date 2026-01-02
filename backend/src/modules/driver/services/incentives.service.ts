import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DriverIncentive,
  IncentiveType,
  IncentiveStatus,
} from '../entities/driver-incentive.entity';

interface CreateIncentiveDto {
  driver_id: string;
  type: IncentiveType;
  title: string;
  description?: string;
  target_value: number;
  bonus_amount: number;
  starts_at: Date;
  expires_at: Date;
  metadata?: Record<string, any>;
}

@Injectable()
export class IncentivesService {
  constructor(
    @InjectRepository(DriverIncentive)
    private incentiveRepository: Repository<DriverIncentive>,
  ) {}

  /**
   * Create a new incentive for a driver
   */
  async create(dto: CreateIncentiveDto): Promise<DriverIncentive> {
    const incentive = this.incentiveRepository.create({
      ...dto,
      current_value: 0,
      status: IncentiveStatus.ACTIVE,
    });
    return this.incentiveRepository.save(incentive);
  }

  /**
   * Get active incentives for a driver
   */
  async getActiveIncentives(driverId: string): Promise<DriverIncentive[]> {
    const now = new Date();
    return this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.ACTIVE,
        starts_at: LessThan(now),
        expires_at: MoreThan(now),
      },
      order: { expires_at: 'ASC' },
    });
  }

  /**
   * Get completed (claimable) incentives for a driver
   */
  async getClaimableIncentives(driverId: string): Promise<DriverIncentive[]> {
    return this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.COMPLETED,
      },
      order: { expires_at: 'ASC' },
    });
  }

  /**
   * Get all incentives for a driver (for dashboard)
   */
  async getAllIncentives(driverId: string): Promise<{
    active: DriverIncentive[];
    claimable: DriverIncentive[];
    claimed: DriverIncentive[];
  }> {
    const now = new Date();

    const active = await this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.ACTIVE,
        expires_at: MoreThan(now),
      },
    });

    const claimable = await this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.COMPLETED,
      },
    });

    const claimed = await this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.CLAIMED,
      },
      order: { claimed_at: 'DESC' },
      take: 10,
    });

    return { active, claimable, claimed };
  }

  /**
   * Update incentive progress
   */
  async updateProgress(
    incentiveId: string,
    incrementBy: number = 1,
  ): Promise<DriverIncentive> {
    const incentive = await this.incentiveRepository.findOne({
      where: { id: incentiveId },
    });

    if (!incentive) {
      throw new NotFoundException('Incentive not found');
    }

    if (incentive.status !== IncentiveStatus.ACTIVE) {
      throw new BadRequestException('Incentive is not active');
    }

    incentive.current_value += incrementBy;

    // Check if target is reached
    if (incentive.current_value >= incentive.target_value) {
      incentive.current_value = incentive.target_value;
      incentive.status = IncentiveStatus.COMPLETED;
    }

    return this.incentiveRepository.save(incentive);
  }

  /**
   * Claim a completed incentive
   */
  async claimIncentive(
    incentiveId: string,
    driverId: string,
  ): Promise<DriverIncentive> {
    const incentive = await this.incentiveRepository.findOne({
      where: { id: incentiveId, driver_id: driverId },
    });

    if (!incentive) {
      throw new NotFoundException('Incentive not found');
    }

    if (incentive.status !== IncentiveStatus.COMPLETED) {
      throw new BadRequestException('Incentive is not ready to be claimed');
    }

    incentive.status = IncentiveStatus.CLAIMED;
    incentive.claimed_at = new Date();

    return this.incentiveRepository.save(incentive);
  }

  /**
   * Get incentive statistics for a driver
   */
  async getStats(driverId: string): Promise<{
    totalEarned: number;
    activeCount: number;
    completedCount: number;
  }> {
    const claimed = await this.incentiveRepository.find({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.CLAIMED,
      },
    });

    const activeCount = await this.incentiveRepository.count({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.ACTIVE,
        expires_at: MoreThan(new Date()),
      },
    });

    const completedCount = await this.incentiveRepository.count({
      where: {
        driver_id: driverId,
        status: IncentiveStatus.COMPLETED,
      },
    });

    const totalEarned = claimed.reduce(
      (sum, inc) => sum + Number(inc.bonus_amount),
      0,
    );

    return { totalEarned, activeCount, completedCount };
  }

  /**
   * Create default weekly incentives for a driver
   */
  async createWeeklyIncentives(driverId: string): Promise<DriverIncentive[]> {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const incentives: CreateIncentiveDto[] = [
      {
        driver_id: driverId,
        type: IncentiveType.QUEST,
        title: 'Complete 20 Trips',
        description: 'Complete 20 trips this week to earn a bonus',
        target_value: 20,
        bonus_amount: 500,
        starts_at: now,
        expires_at: weekEnd,
      },
      {
        driver_id: driverId,
        type: IncentiveType.QUEST,
        title: 'Complete 50 Trips',
        description: 'Complete 50 trips this week for a bigger bonus',
        target_value: 50,
        bonus_amount: 1500,
        starts_at: now,
        expires_at: weekEnd,
      },
      {
        driver_id: driverId,
        type: IncentiveType.RATING_BONUS,
        title: 'Maintain 4.8+ Rating',
        description: 'Keep your rating above 4.8 with at least 10 rated trips',
        target_value: 10,
        bonus_amount: 300,
        starts_at: now,
        expires_at: weekEnd,
        metadata: { min_rating: 4.8 },
      },
      {
        driver_id: driverId,
        type: IncentiveType.PEAK_BONUS,
        title: 'Peak Hour Champion',
        description: 'Complete 15 trips during peak hours (8-10 AM, 6-9 PM)',
        target_value: 15,
        bonus_amount: 400,
        starts_at: now,
        expires_at: weekEnd,
        metadata: {
          peak_hours: [
            [8, 10],
            [18, 21],
          ],
        },
      },
    ];

    const created: DriverIncentive[] = [];
    for (const dto of incentives) {
      const incentive = await this.create(dto);
      created.push(incentive);
    }

    return created;
  }

  /**
   * Update incentives when a trip is completed
   */
  @OnEvent('trip.completed')
  async handleTripCompleted(payload: {
    tripId: string;
    driverId?: string;
    customerId: string;
    fare: number;
  }) {
    if (!payload.driverId) return;

    // Update quest incentives
    const activeIncentives = await this.getActiveIncentives(payload.driverId);

    for (const incentive of activeIncentives) {
      if (incentive.type === IncentiveType.QUEST) {
        await this.updateProgress(incentive.id, 1);
      }

      if (incentive.type === IncentiveType.PEAK_BONUS) {
        const hour = new Date().getHours();
        const peakHours = incentive.metadata?.peak_hours || [];
        const isPeakHour = peakHours.some(
          ([start, end]: [number, number]) => hour >= start && hour < end,
        );
        if (isPeakHour) {
          await this.updateProgress(incentive.id, 1);
        }
      }
    }
  }

  /**
   * Expire old incentives (called by cron job)
   */
  async expireOldIncentives(): Promise<number> {
    const result = await this.incentiveRepository.update(
      {
        status: IncentiveStatus.ACTIVE,
        expires_at: LessThan(new Date()),
      },
      { status: IncentiveStatus.EXPIRED },
    );
    return result.affected || 0;
  }
}
