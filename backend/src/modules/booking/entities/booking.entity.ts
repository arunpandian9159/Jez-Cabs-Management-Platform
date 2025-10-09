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
  companyId: string;

  @Column({ type: 'uuid' })
  @Index()
  cabId: string;

  @Column({ type: 'uuid', nullable: true })
  driverId: string | null;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @Column({ type: 'varchar', length: 255 })
  clientContactPerson: string;

  @Column({ type: 'varchar', length: 255 })
  clientEmail: string;

  @Column({ type: 'varchar', length: 20 })
  clientPhone: string;

  @Column({ type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickupLocation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dropoffLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  advanceAmount: number;

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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Cab, { eager: true })
  @JoinColumn({ name: 'cabId' })
  cab: Cab;

  @ManyToOne(() => Driver, { eager: true, nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;
}

