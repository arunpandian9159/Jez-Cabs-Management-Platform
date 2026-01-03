import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SubscriptionTier {
  BASIC = 'basic',
  PLUS = 'plus',
  PREMIUM = 'premium',
  FAMILY = 'family',
  BUSINESS = 'business',
}

export interface SubscriptionBenefits {
  discountPercent: number;
  freeCancellations: number;
  prioritySupport: boolean;
  freeUpgrades: boolean;
  familyMembers: number;
  invoicing: boolean;
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionTier,
  {
    name: string;
    price: number;
    benefits: SubscriptionBenefits;
    description: string;
  }
> = {
  [SubscriptionTier.BASIC]: {
    name: 'Basic',
    price: 0,
    description: 'Standard booking experience',
    benefits: {
      discountPercent: 0,
      freeCancellations: 0,
      prioritySupport: false,
      freeUpgrades: false,
      familyMembers: 0,
      invoicing: false,
    },
  },
  [SubscriptionTier.PLUS]: {
    name: 'Plus',
    price: 199,
    description: 'Great for regular riders',
    benefits: {
      discountPercent: 10,
      freeCancellations: 2,
      prioritySupport: true,
      freeUpgrades: false,
      familyMembers: 0,
      invoicing: false,
    },
  },
  [SubscriptionTier.PREMIUM]: {
    name: 'Premium',
    price: 499,
    description: 'Best value for frequent travelers',
    benefits: {
      discountPercent: 20,
      freeCancellations: 5,
      prioritySupport: true,
      freeUpgrades: true,
      familyMembers: 0,
      invoicing: false,
    },
  },
  [SubscriptionTier.FAMILY]: {
    name: 'Family',
    price: 799,
    description: 'Perfect for families',
    benefits: {
      discountPercent: 15,
      freeCancellations: 5,
      prioritySupport: true,
      freeUpgrades: true,
      familyMembers: 5,
      invoicing: false,
    },
  },
  [SubscriptionTier.BUSINESS]: {
    name: 'Business',
    price: 1999,
    description: 'For teams and businesses',
    benefits: {
      discountPercent: 25,
      freeCancellations: 10,
      prioritySupport: true,
      freeUpgrades: true,
      familyMembers: 10,
      invoicing: true,
    },
  },
};

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    unique: true,
  })
  tier: SubscriptionTier;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Monthly price in INR

  @Column({ type: 'int', default: 1 })
  duration_months: number;

  @Column({ type: 'jsonb' })
  benefits: SubscriptionBenefits;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  subscriber_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
