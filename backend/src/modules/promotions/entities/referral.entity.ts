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

export enum ReferralStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  referrer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  referred_id: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referred_id' })
  referred: User;

  @Column({ type: 'varchar', length: 20 })
  @Index({ unique: true })
  referral_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referred_email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  referred_phone: string | null;

  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  @Index()
  status: ReferralStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referrer_reward: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referred_reward: number;

  @Column({ type: 'boolean', default: false })
  referrer_reward_credited: boolean;

  @Column({ type: 'boolean', default: false })
  referred_reward_credited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  signed_up_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  first_ride_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
