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
import { InvoiceStatus } from '../../../common/enums';
import { Company } from '../../iam/entities';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  company_id: string;

  @Column({ type: 'uuid' })
  @Index()
  booking_id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  invoice_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  @Index()
  status: InvoiceStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  payment_link: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pdf_url: string;

  @Column({ type: 'date', nullable: true })
  paid_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment_method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_reference: string;

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

  @ManyToOne(() => Booking, { eager: true })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
