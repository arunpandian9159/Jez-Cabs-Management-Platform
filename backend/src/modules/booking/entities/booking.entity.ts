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
import { BookingStatus } from '../../../common/enums';
import { Company } from '../../iam/entities';
import { Cab } from '../../cab/entities/cab.entity';
import { Driver } from '../../driver/entities/driver.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  company_id: string;

  @Column({ type: 'uuid' })
  @Index()
  cab_id: string;

  @Column({ type: 'uuid', nullable: true })
  driver_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  client_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  client_contact_person: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  client_email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  client_phone: string | null;

  @Column({ type: 'timestamp' })
  @Index()
  start_date: Date;

  @Column({ type: 'timestamp' })
  @Index()
  end_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickup_location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dropoff_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  advance_amount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Index()
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;



  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Cab, { eager: true })
  @JoinColumn({ name: 'cab_id' })
  cab: Cab;

  @ManyToOne(() => Driver, { eager: true, nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
