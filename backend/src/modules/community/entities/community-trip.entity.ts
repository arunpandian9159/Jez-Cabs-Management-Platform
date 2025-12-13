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

export enum CommunityTripType {
  OFFERING = 'offering',
  REQUESTING = 'requesting',
}

export enum CommunityTripStatus {
  ACTIVE = 'active',
  FULL = 'full',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('community_trips')
export class CommunityTrip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  poster_id: string;

  @Column({
    type: 'enum',
    enum: CommunityTripType,
  })
  trip_type: CommunityTripType;

  @Column({ type: 'text' })
  from_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  from_lat: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  from_lng: number | null;

  @Column({ type: 'text' })
  to_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  to_lat: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  to_lng: number | null;

  @Column({ type: 'date' })
  @Index()
  departure_date: Date;

  @Column({ type: 'time' })
  departure_time: string;

  @Column({ type: 'int', default: 1 })
  seats_available: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_per_seat: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: CommunityTripStatus,
    default: CommunityTripStatus.ACTIVE,
  })
  @Index()
  status: CommunityTripStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'poster_id' })
  poster: User;
}
