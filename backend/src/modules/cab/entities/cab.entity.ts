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
import { CabStatus, CabType } from '../../../common/enums';
import { User } from '../../iam/entities/user.entity';

@Entity('cabs')
export class Cab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  owner_id: string;

  @Column({ type: 'uuid', nullable: true })
  assigned_driver_id: string | null;

  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'varchar', length: 50 })
  registration_number: string;

  @Column({
    type: 'enum',
    enum: CabType,
    default: CabType.SEDAN,
  })
  cab_type: CabType;

  @Column({
    type: 'enum',
    enum: CabStatus,
    default: CabStatus.AVAILABLE,
  })
  @Index()
  status: CabStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string | null;

  @Column({ type: 'int', default: 4 })
  seating_capacity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuel_type: string | null;

  @Column({ type: 'boolean', default: true })
  ac_available: boolean;

  @Column({ type: 'text', nullable: true })
  image_url: string | null;

  @Column({ type: 'date', nullable: true })
  insurance_expiry: Date | null;

  @Column({ type: 'date', nullable: true })
  registration_expiry: Date | null;

  @Column({ type: 'date', nullable: true })
  fitness_expiry: Date | null;

  @Column({ type: 'date', nullable: true })
  permit_expiry: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50 })
  base_fare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 12 })
  per_km_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 2 })
  per_min_rate: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_trips: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  current_location_lat: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  current_location_lng: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_driver_id' })
  assigned_driver: User | null;
}
