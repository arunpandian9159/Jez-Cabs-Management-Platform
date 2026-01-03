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
import { TripStatus } from '../../../common/enums';
import { User } from '../../iam/entities/user.entity';
import { Cab } from '../../cab/entities/cab.entity';

export enum OutstationTripType {
  ONE_WAY = 'one_way',
  ROUND_TRIP = 'round_trip',
  MULTI_DAY = 'multi_day',
}

export interface OutstationStop {
  order: number;
  address: string;
  lat: number;
  lng: number;
  stayDuration?: number; // hours at this stop
  notes?: string;
}

export interface OutstationPricing {
  baseFare: number;
  perKmRate: number;
  driverAllowancePerDay: number;
  nightCharges: number;
  tollEstimate: number;
  permitCharges: number;
  gst: number;
  totalEstimate: number;
}

@Entity('outstation_bookings')
export class OutstationBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  trip_id: string | null;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ type: 'uuid' })
  @Index()
  customer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'uuid', nullable: true })
  driver_id: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'uuid', nullable: true })
  cab_id: string | null;

  @ManyToOne(() => Cab)
  @JoinColumn({ name: 'cab_id' })
  cab: Cab;

  @Column({
    type: 'enum',
    enum: OutstationTripType,
  })
  trip_type: OutstationTripType;

  @Column({ type: 'varchar', length: 500 })
  pickup_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  pickup_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  pickup_lng: number;

  @Column({ type: 'varchar', length: 500 })
  final_destination: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  destination_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  destination_lng: number;

  @Column({ type: 'jsonb', default: [] })
  stops: OutstationStop[];

  @Column({ type: 'int' })
  estimated_distance_km: number;

  @Column({ type: 'int', default: 1 })
  number_of_days: number;

  @Column({ type: 'timestamp' })
  departure_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date | null;

  @Column({ type: 'jsonb' })
  pricing: OutstationPricing;

  @Column({ type: 'boolean', default: false })
  includes_driver_accommodation: boolean;

  @Column({ type: 'text', nullable: true })
  special_requirements: string | null;

  @Column({ type: 'varchar', length: 50, default: 'sedan' })
  vehicle_type: string;

  @Column({ type: 'int', default: 4 })
  passenger_count: number;

  @Column({ type: 'int', default: 0 })
  luggage_count: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING,
  })
  @Index()
  status: TripStatus;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string | null;

  @CreateDateColumn()
  created_at: Date;
}
