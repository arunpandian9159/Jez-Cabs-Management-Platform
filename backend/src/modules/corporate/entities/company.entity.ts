import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum CompanyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

export enum BillingCycle {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

export interface CompanyPolicy {
  maxFarePerTrip: number | null; // null = no limit
  maxTripsPerEmployee: number | null;
  allowedHours: { start: number; end: number } | null; // null = all hours
  allowedDays: number[] | null; // 0-6 for Sun-Sat, null = all days
  requiresApproval: boolean;
  approvalThreshold: number; // Trips above this amount need approval
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gst_number: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pan_number: string | null;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode: string | null;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.PENDING,
  })
  @Index()
  status: CompanyStatus;

  @Column({ type: 'uuid', nullable: true })
  admin_user_id: string | null; // Primary admin for the company

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  credit_limit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  current_balance: number; // Outstanding amount

  @Column({
    type: 'enum',
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
  })
  billing_cycle: BillingCycle;

  @Column({ type: 'int', default: 15 })
  payment_due_days: number; // Days after billing cycle end

  @Column({ type: 'jsonb', default: {} })
  policy: CompanyPolicy;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
