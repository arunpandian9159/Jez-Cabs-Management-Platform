import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

export enum PaymentMethodType {
  CARD = 'card',
  UPI = 'upi',
  WALLET = 'wallet',
  NETBANKING = 'netbanking',
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'enum', enum: PaymentMethodType })
  type: PaymentMethodType;

  @Column({ type: 'varchar', length: 100 })
  display_name: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  last_four: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  upi_id: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
