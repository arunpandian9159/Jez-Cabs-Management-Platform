import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

export enum IncentiveType {
  QUEST = 'quest', // Complete X trips to earn bonus
  PEAK_BONUS = 'peak_bonus', // Extra pay during rush hours
  RATING_BONUS = 'rating_bonus', // Maintain high rating
  REFERRAL = 'referral', // Invite new drivers
  LOYALTY = 'loyalty', // Monthly/yearly milestones
  FUEL_SUBSIDY = 'fuel_subsidy', // Based on trip completion
}

export enum IncentiveStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLAIMED = 'claimed',
  EXPIRED = 'expired',
}

@Entity('driver_incentives')
export class DriverIncentive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  driver_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({
    type: 'enum',
    enum: IncentiveType,
  })
  type: IncentiveType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  target_value: number; // e.g., 10 trips, 4.8 rating

  @Column({ type: 'int', default: 0 })
  current_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bonus_amount: number;

  @Column({ type: 'timestamp' })
  starts_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({
    type: 'enum',
    enum: IncentiveStatus,
    default: IncentiveStatus.ACTIVE,
  })
  @Index()
  status: IncentiveStatus;

  @Column({ type: 'timestamp', nullable: true })
  claimed_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null; // Extra data like specific hours for peak bonus

  @CreateDateColumn()
  created_at: Date;
}
