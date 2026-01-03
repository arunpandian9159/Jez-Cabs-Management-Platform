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

export enum BadgeType {
  FIVE_STAR = 'five_star',
  TOP_RATED = 'top_rated',
  POLITE_DRIVER = 'polite_driver',
  CLEAN_VEHICLE = 'clean_vehicle',
  SAFE_DRIVER = 'safe_driver',
  PUNCTUAL = 'punctual',
  EXCELLENT_NAVIGATION = 'excellent_navigation',
  HELPFUL = 'helpful',
  CUSTOMER_FAVORITE = 'customer_favorite',
  VETERAN = 'veteran',
  NIGHT_OWL = 'night_owl',
  EARLY_BIRD = 'early_bird',
  LONG_DISTANCE = 'long_distance',
  ECO_FRIENDLY = 'eco_friendly',
}

export const BADGE_CONFIG: Record<
  BadgeType,
  {
    name: string;
    description: string;
    icon: string;
    color: string;
    criteria: string;
  }
> = {
  [BadgeType.FIVE_STAR]: {
    name: '5-Star Rated',
    description: 'Maintained a 5-star rating for 50+ rides',
    icon: '⭐',
    color: '#FFD700',
    criteria: 'Average rating >= 5.0 for last 50 trips',
  },
  [BadgeType.TOP_RATED]: {
    name: 'Top Rated',
    description: 'Consistently rated 4.8+ stars',
    icon: '🏆',
    color: '#FFD700',
    criteria: 'Average rating >= 4.8 for last 100 trips',
  },
  [BadgeType.POLITE_DRIVER]: {
    name: 'Polite Driver',
    description: 'Known for excellent communication',
    icon: '😊',
    color: '#4CAF50',
    criteria: 'Communication rating >= 4.7 for last 50 trips',
  },
  [BadgeType.CLEAN_VEHICLE]: {
    name: 'Clean Vehicle',
    description: 'Always maintains a clean vehicle',
    icon: '✨',
    color: '#2196F3',
    criteria: 'Cleanliness rating >= 4.7 for last 50 trips',
  },
  [BadgeType.SAFE_DRIVER]: {
    name: 'Safe Driver',
    description: 'Excellent driving skills and safety record',
    icon: '🛡️',
    color: '#4CAF50',
    criteria: 'Driving skills rating >= 4.7 and zero safety incidents',
  },
  [BadgeType.PUNCTUAL]: {
    name: 'Punctual',
    description: 'Always arrives on time',
    icon: '⏰',
    color: '#9C27B0',
    criteria: 'On-time arrival rate >= 95%',
  },
  [BadgeType.EXCELLENT_NAVIGATION]: {
    name: 'Expert Navigator',
    description: 'Great route knowledge',
    icon: '🗺️',
    color: '#FF9800',
    criteria: 'Route knowledge rating >= 4.7 for last 50 trips',
  },
  [BadgeType.HELPFUL]: {
    name: 'Helpful',
    description: 'Goes above and beyond',
    icon: '🤝',
    color: '#E91E63',
    criteria: 'Received 20+ positive tags for helpfulness',
  },
  [BadgeType.CUSTOMER_FAVORITE]: {
    name: 'Customer Favorite',
    description: 'High repeat customer rate',
    icon: '❤️',
    color: '#F44336',
    criteria: 'Added to 10+ customer favorites',
  },
  [BadgeType.VETERAN]: {
    name: 'Veteran Driver',
    description: 'Completed 1000+ trips',
    icon: '🎖️',
    color: '#795548',
    criteria: 'Completed 1000+ trips',
  },
  [BadgeType.NIGHT_OWL]: {
    name: 'Night Owl',
    description: 'Available late night',
    icon: '🦉',
    color: '#3F51B5',
    criteria: 'Completed 100+ trips between 10 PM - 6 AM',
  },
  [BadgeType.EARLY_BIRD]: {
    name: 'Early Bird',
    description: 'Available early morning',
    icon: '🌅',
    color: '#FF9800',
    criteria: 'Completed 100+ trips between 4 AM - 7 AM',
  },
  [BadgeType.LONG_DISTANCE]: {
    name: 'Long Distance Expert',
    description: 'Experienced in long trips',
    icon: '🛣️',
    color: '#607D8B',
    criteria: 'Completed 50+ trips over 100km',
  },
  [BadgeType.ECO_FRIENDLY]: {
    name: 'Eco Warrior',
    description: 'Drives eco-friendly vehicles',
    icon: '🌱',
    color: '#4CAF50',
    criteria: 'Drives CNG/Electric vehicle',
  },
};

@Entity('driver_badges')
export class DriverBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  driver_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({
    type: 'enum',
    enum: BadgeType,
  })
  @Index()
  badge_type: BadgeType;

  @Column({ type: 'timestamp' })
  earned_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null; // Some badges may expire

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: true })
  is_displayed: boolean; // Driver can choose to hide badges

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null; // Additional badge-specific data

  @CreateDateColumn()
  created_at: Date;
}
