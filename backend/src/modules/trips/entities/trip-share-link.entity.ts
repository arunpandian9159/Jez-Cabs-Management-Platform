import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Trip } from './trip.entity';
import { User } from '../../iam/entities/user.entity';

@Entity('trip_share_links')
export class TripShareLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  trip_id: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ type: 'uuid' })
  @Index()
  shared_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'shared_by' })
  sharer: User;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Index()
  token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shared_with_name: string | null; // Name of person it was shared with

  @Column({ type: 'varchar', length: 50, nullable: true })
  share_method: string | null; // 'whatsapp', 'sms', 'link', 'email'

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'int', default: 0 })
  access_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_accessed_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  access_log:
    | {
        timestamp: Date;
        ip?: string;
        userAgent?: string;
      }[]
    | null;

  @Column({ type: 'boolean', default: true })
  show_driver_info: boolean;

  @Column({ type: 'boolean', default: true })
  show_live_location: boolean;

  @Column({ type: 'boolean', default: true })
  show_eta: boolean;

  @CreateDateColumn()
  created_at: Date;
}
