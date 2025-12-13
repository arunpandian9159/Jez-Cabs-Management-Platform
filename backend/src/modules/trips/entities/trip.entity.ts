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
import { TripStatus } from '../../../common/enums';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  customer_id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  driver_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  cab_id: string | null;

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_km: number | null;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actual_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  time_fare: number | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  surge_multiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tip_amount: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING,
  })
  @Index()
  status: TripStatus;

  @Column({ type: 'timestamp', nullable: true })
  scheduled_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  accepted_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  driver_arrived_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string | null;

  @Column({ type: 'uuid', nullable: true })
  cancelled_by: string | null;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column({ type: 'int', nullable: true })
  customer_rating: number | null;

  @Column({ type: 'int', nullable: true })
  driver_rating: number | null;

  @Column({ type: 'text', nullable: true })
  customer_feedback: string | null;

  @Column({ type: 'text', nullable: true })
  driver_feedback: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
