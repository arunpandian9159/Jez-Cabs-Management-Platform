import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum PromoCodeType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  FREE_RIDE = 'free_ride',
  CASHBACK = 'cashback',
}

export enum PromoCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  EXHAUSTED = 'exhausted',
  DISABLED = 'disabled',
}

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Index({ unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: PromoCodeType,
  })
  discount_type: PromoCodeType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number; // Percentage or flat amount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_discount: number | null; // Max discount for percentage type

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_ride_value: number;

  @Column({ type: 'int', nullable: true })
  max_uses: number | null; // null = unlimited

  @Column({ type: 'int', default: 0 })
  current_uses: number;

  @Column({ type: 'int', default: 1 })
  per_user_limit: number;

  @Column({ type: 'boolean', default: false })
  first_ride_only: boolean;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @Column({ type: 'timestamp' })
  valid_to: Date;

  @Column({
    type: 'enum',
    enum: PromoCodeStatus,
    default: PromoCodeStatus.ACTIVE,
  })
  @Index()
  status: PromoCodeStatus;

  @Column({ type: 'simple-array', nullable: true })
  targeted_user_ids: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  applicable_cities: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  applicable_vehicle_types: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;
}
