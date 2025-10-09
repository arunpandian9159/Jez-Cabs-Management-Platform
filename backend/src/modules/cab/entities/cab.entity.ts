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
import { CabStatus } from '../../../common/enums';
import { Company } from '../../iam/entities';

@Entity('cabs')
@Index(['companyId', 'registrationNumber'], { unique: true })
export class Cab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  companyId: string;

  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 50 })
  registrationNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  vin: string;

  @Column({
    type: 'enum',
    enum: CabStatus,
    default: CabStatus.AVAILABLE,
  })
  @Index()
  status: CabStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @Column({ type: 'int', nullable: true })
  seatingCapacity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuelType: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiry: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceProvider: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurancePolicyNumber: string;

  @Column({ type: 'date', nullable: true })
  registrationExpiry: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gpsDeviceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyRentalRate: number;

  @Column({ type: 'int', default: 0 })
  currentMileage: number;

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
}

