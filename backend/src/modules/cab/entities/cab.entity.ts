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
@Index(['company_id', 'registration_number'], { unique: true })
export class Cab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  make: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model: string | null;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registration_number: string | null;

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
  seating_capacity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuel_type: string;

  @Column({ type: 'date', nullable: true })
  insurance_expiry: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurance_provider: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurance_policy_number: string;

  @Column({ type: 'date', nullable: true })
  registration_expiry: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gps_device_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  daily_rental_rate: number;

  @Column({ type: 'int', default: 0 })
  current_mileage: number;

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
}
