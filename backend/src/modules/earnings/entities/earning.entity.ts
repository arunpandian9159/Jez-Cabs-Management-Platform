import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

@Entity('earnings')
export class Earning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  driver_id: string;

  @Column({ type: 'uuid', nullable: true })
  trip_id: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20.0 })
  commission_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commission_amount: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  net_amount: number | null;

  @Column({ type: 'varchar', length: 50, default: 'trip' })
  type: string;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;
}
