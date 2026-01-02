import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKDAYS = 'weekdays',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export enum RecurringRideStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('recurring_rides')
export class RecurringRide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  customer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'text' })
  pickup_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  pickup_lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  pickup_lng: number;

  @Column({ type: 'text' })
  dropoff_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  dropoff_lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  dropoff_lng: number;

  @Column({ type: 'time' })
  scheduled_time: string; // Time of day for the ride (HH:mm:ss)

  @Column({ type: 'varchar', length: 50, nullable: true })
  cab_type: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  locked_fare: number | null; // Fare locked at time of scheduling

  @Column({
    type: 'enum',
    enum: RecurrenceType,
    default: RecurrenceType.WEEKDAYS,
  })
  recurrence_type: RecurrenceType;

  @Column({ type: 'jsonb', nullable: true })
  recurrence_days: number[] | null; // Array of days (0-6, Sunday = 0)

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({
    type: 'enum',
    enum: RecurringRideStatus,
    default: RecurringRideStatus.ACTIVE,
  })
  @Index()
  status: RecurringRideStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'uuid', nullable: true })
  preferred_driver_id: string | null;

  @Column({ type: 'int', default: 0 })
  total_rides_created: number;

  @Column({ type: 'timestamp', nullable: true })
  last_ride_created_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  next_ride_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
