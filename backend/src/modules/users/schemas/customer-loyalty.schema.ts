import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerLoyaltyDocument = CustomerLoyalty & Document;

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface TierBenefit {
  name: string;
  description: string;
  value: number;
  type: 'discount' | 'multiplier' | 'priority' | 'free_upgrade';
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class CustomerLoyalty {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({ default: 0 })
  availablePoints: number; // Points that can be redeemed

  @Prop({ default: 0 })
  lifetimePoints: number; // Total points ever earned

  @Prop({
    type: String,
    enum: Object.values(LoyaltyTier),
    default: LoyaltyTier.BRONZE,
  })
  tier: LoyaltyTier;

  @Prop({ default: 0 })
  totalTrips: number;

  @Prop({ type: Number, default: 0 })
  totalSpend: number;

  @Prop({ default: 0 })
  consecutiveMonthsActive: number;

  @Prop()
  tierUpgradeDate?: Date;

  @Prop()
  tierExpiryDate?: Date;

  @Prop({ type: [Object], default: [] })
  pointsHistory: {
    type: 'earned' | 'redeemed' | 'expired';
    amount: number;
    description: string;
    tripId?: string;
    timestamp: Date;
  }[];
}

export const CustomerLoyaltySchema =
  SchemaFactory.createForClass(CustomerLoyalty);

// Tier thresholds and benefits
export const TIER_CONFIG = {
  [LoyaltyTier.BRONZE]: {
    minPoints: 0,
    minTrips: 0,
    pointsMultiplier: 1,
    benefits: [
      {
        name: 'Basic Rewards',
        description: 'Earn 1 point per ₹10 spent',
        value: 1,
        type: 'multiplier' as const,
      },
    ],
  },
  [LoyaltyTier.SILVER]: {
    minPoints: 500,
    minTrips: 25,
    pointsMultiplier: 1.25,
    benefits: [
      {
        name: 'Bonus Points',
        description: 'Earn 1.25x points on all rides',
        value: 1.25,
        type: 'multiplier' as const,
      },
      {
        name: 'Priority Support',
        description: 'Access to priority customer support',
        value: 1,
        type: 'priority' as const,
      },
    ],
  },
  [LoyaltyTier.GOLD]: {
    minPoints: 2000,
    minTrips: 100,
    pointsMultiplier: 1.5,
    benefits: [
      {
        name: 'Gold Bonus',
        description: 'Earn 1.5x points on all rides',
        value: 1.5,
        type: 'multiplier' as const,
      },
      {
        name: '5% Discount',
        description: '5% off on all rides',
        value: 5,
        type: 'discount' as const,
      },
      {
        name: 'Free Upgrades',
        description: 'Occasional free cab upgrades',
        value: 1,
        type: 'free_upgrade' as const,
      },
    ],
  },
  [LoyaltyTier.PLATINUM]: {
    minPoints: 5000,
    minTrips: 250,
    pointsMultiplier: 2,
    benefits: [
      {
        name: 'Platinum Bonus',
        description: 'Earn 2x points on all rides',
        value: 2,
        type: 'multiplier' as const,
      },
      {
        name: '10% Discount',
        description: '10% off on all rides',
        value: 10,
        type: 'discount' as const,
      },
      {
        name: 'Priority Matching',
        description: 'Get matched with top-rated drivers',
        value: 1,
        type: 'priority' as const,
      },
      {
        name: 'Guaranteed Upgrades',
        description: 'Free cab upgrades when available',
        value: 1,
        type: 'free_upgrade' as const,
      },
    ],
  },
};
