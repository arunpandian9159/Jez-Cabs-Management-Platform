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

export interface CategoryRatings {
  drivingSkills: number; // 1-5
  vehicleCleanliness: number; // 1-5
  communication: number; // 1-5
  routeKnowledge: number; // 1-5
}

@Entity('enhanced_ratings')
export class EnhancedRating {
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
  rated_by: string; // User who gave the rating

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rated_by' })
  rater: User;

  @Column({ type: 'uuid' })
  @Index()
  rated_user: string; // User being rated (driver or customer)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rated_user' })
  ratee: User;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  overall_rating: number; // 1-5

  @Column({ type: 'jsonb', nullable: true })
  category_ratings: CategoryRatings | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'simple-array', nullable: true })
  photo_urls: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[] | null; // e.g., 'polite', 'clean_vehicle', 'safe_driver'

  @Column({ type: 'boolean', default: false })
  is_verified_ride: boolean;

  @Column({ type: 'boolean', default: false })
  is_public: boolean; // Whether comment is publicly visible

  @Column({ type: 'text', nullable: true })
  driver_response: string | null; // Driver's response to the review

  @Column({ type: 'timestamp', nullable: true })
  driver_response_at: Date | null;

  @Column({ type: 'boolean', default: false })
  is_flagged: boolean; // Flagged for review

  @Column({ type: 'text', nullable: true })
  flag_reason: string | null;

  @CreateDateColumn()
  created_at: Date;
}
