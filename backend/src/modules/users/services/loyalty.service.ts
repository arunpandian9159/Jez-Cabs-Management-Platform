import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CustomerLoyalty,
  CustomerLoyaltyDocument,
  LoyaltyTier,
  TIER_CONFIG,
} from '../schemas/customer-loyalty.schema';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(
    @InjectModel(CustomerLoyalty.name)
    private loyaltyModel: Model<CustomerLoyaltyDocument>,
  ) {}

  /**
   * Get or create loyalty profile for a user
   */
  async getOrCreate(userId: string): Promise<CustomerLoyalty> {
    let loyalty = await this.loyaltyModel.findOne({ userId });

    if (!loyalty) {
      loyalty = await this.loyaltyModel.create({
        userId,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
        tier: LoyaltyTier.BRONZE,
        totalTrips: 0,
        totalSpend: 0,
        pointsHistory: [],
      });
    }

    return loyalty;
  }

  /**
   * Get loyalty profile
   */
  async getProfile(userId: string) {
    const loyalty = await this.getOrCreate(userId);
    const tierConfig = TIER_CONFIG[loyalty.tier];

    // Calculate progress to next tier
    const tiers = Object.values(LoyaltyTier);
    const currentTierIndex = tiers.indexOf(loyalty.tier);
    const nextTier =
      currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

    let progressToNextTier = 100;
    let pointsToNextTier = 0;
    let tripsToNextTier = 0;

    if (nextTier) {
      const nextTierConfig = TIER_CONFIG[nextTier as LoyaltyTier];
      pointsToNextTier = Math.max(
        0,
        nextTierConfig.minPoints - loyalty.lifetimePoints,
      );
      tripsToNextTier = Math.max(
        0,
        nextTierConfig.minTrips - loyalty.totalTrips,
      );

      const pointsProgress =
        (loyalty.lifetimePoints / nextTierConfig.minPoints) * 100;
      const tripsProgress =
        (loyalty.totalTrips / nextTierConfig.minTrips) * 100;
      progressToNextTier = Math.min(100, (pointsProgress + tripsProgress) / 2);
    }

    return {
      ...loyalty.toObject(),
      currentTierBenefits: tierConfig.benefits,
      nextTier,
      progressToNextTier,
      pointsToNextTier,
      tripsToNextTier,
    };
  }

  /**
   * Add points for a completed trip
   */
  async addPoints(
    userId: string,
    amount: number,
    tripId: string,
    description: string = 'Trip completed',
  ): Promise<CustomerLoyalty> {
    const loyalty = await this.getOrCreate(userId);
    const tierConfig = TIER_CONFIG[loyalty.tier];

    // Apply tier multiplier
    const pointsEarned = Math.floor(amount * tierConfig.pointsMultiplier);

    loyalty.totalPoints += pointsEarned;
    loyalty.availablePoints += pointsEarned;
    loyalty.lifetimePoints += pointsEarned;
    loyalty.totalSpend = Number(loyalty.totalSpend) + amount;
    loyalty.totalTrips += 1;

    loyalty.pointsHistory.push({
      type: 'earned',
      amount: pointsEarned,
      description: `${description} (+${tierConfig.pointsMultiplier}x bonus)`,
      tripId,
      timestamp: new Date(),
    });

    // Check for tier upgrade
    await this.checkTierUpgrade(loyalty);

    return loyalty.save();
  }

  /**
   * Redeem points
   */
  async redeemPoints(
    userId: string,
    points: number,
    description: string = 'Points redeemed',
  ): Promise<CustomerLoyalty> {
    const loyalty = await this.getOrCreate(userId);

    if (loyalty.availablePoints < points) {
      throw new NotFoundException('Insufficient points');
    }

    loyalty.availablePoints -= points;
    loyalty.pointsHistory.push({
      type: 'redeemed',
      amount: -points,
      description,
      timestamp: new Date(),
    });

    return loyalty.save();
  }

  /**
   * Check and upgrade tier if eligible
   */
  private async checkTierUpgrade(
    loyalty: CustomerLoyaltyDocument,
  ): Promise<void> {
    const tiers = [
      LoyaltyTier.BRONZE,
      LoyaltyTier.SILVER,
      LoyaltyTier.GOLD,
      LoyaltyTier.PLATINUM,
    ];

    let newTier = loyalty.tier;

    for (const tier of tiers) {
      const config = TIER_CONFIG[tier];
      if (
        loyalty.lifetimePoints >= config.minPoints &&
        loyalty.totalTrips >= config.minTrips
      ) {
        newTier = tier;
      }
    }

    if (newTier !== loyalty.tier) {
      loyalty.tier = newTier;
      loyalty.tierUpgradeDate = new Date();
      this.logger.log(`User ${loyalty.userId} upgraded to ${newTier} tier`);
    }
  }

  /**
   * Get tier benefits for a user
   */
  async getTierBenefits(userId: string) {
    const loyalty = await this.getOrCreate(userId);
    return TIER_CONFIG[loyalty.tier];
  }

  /**
   * Get discount percentage for a user
   */
  async getDiscountPercentage(userId: string): Promise<number> {
    const tierConfig = await this.getTierBenefits(userId);
    const discountBenefit = tierConfig.benefits.find(
      (b) => b.type === 'discount',
    );
    return discountBenefit?.value || 0;
  }

  /**
   * Get points multiplier for a user
   */
  async getPointsMultiplier(userId: string): Promise<number> {
    const tierConfig = await this.getTierBenefits(userId);
    return tierConfig.pointsMultiplier;
  }

  /**
   * Get points history
   */
  async getPointsHistory(
    userId: string,
    limit: number = 20,
  ): Promise<
    { type: string; amount: number; description: string; timestamp: Date }[]
  > {
    const loyalty = await this.getOrCreate(userId);
    return loyalty.pointsHistory.slice(-limit).reverse();
  }

  /**
   * Handle trip completion event
   */
  @OnEvent('trip.completed')
  async handleTripCompleted(payload: {
    tripId: string;
    customerId: string;
    fare: number;
  }) {
    try {
      // 1 point per ₹10 spent (before multiplier)
      const basePoints = Math.floor(payload.fare / 10);
      await this.addPoints(
        payload.customerId,
        basePoints,
        payload.tripId,
        'Trip completed',
      );
      this.logger.log(
        `Added ${basePoints} base points for user ${payload.customerId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to add loyalty points: ${error}`);
    }
  }
}
