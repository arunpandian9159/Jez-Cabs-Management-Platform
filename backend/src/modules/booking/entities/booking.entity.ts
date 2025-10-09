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
  driverId: string;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @Column({ type: 'varchar', length: 50 })
  clientContact: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientCompany: string;

  @Column({ type: 'date' })
  @Index()
  startDate: Date;

  @Column({ type: 'date' })
  @Index()
  endDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickupLocation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dropoffLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advancePayment: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Index()
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bookingReference: string;

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

