import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ZoneType {
  AIRPORT = 'airport',
  RAILWAY_STATION = 'railway_station',
  BUS_STATION = 'bus_station',
  MALL = 'mall',
  TECH_PARK = 'tech_park',
  HOTEL = 'hotel',
  HOSPITAL = 'hospital',
  UNIVERSITY = 'university',
  STADIUM = 'stadium',
  CUSTOM = 'custom',
}

export interface ZonePolygon {
  type: 'Polygon';
  coordinates: number[][][]; // GeoJSON polygon format
}

export interface ZonePickupPoint {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
}

@Entity('special_zones')
export class SpecialZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ZoneType,
  })
  @Index()
  type: ZoneType;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  city: string;

  @Column({ type: 'jsonb' })
  polygon: ZonePolygon;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  center_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  center_lng: number;

  @Column({ type: 'int', default: 500 })
  radius_meters: number;

  @Column({ type: 'jsonb', default: [] })
  pickup_points: ZonePickupPoint[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  surcharge_percent: number; // e.g., 10% surcharge

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  surcharge_flat: number; // Flat surcharge amount

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  waiting_charge_per_min: number;

  @Column({ type: 'int', default: 15 })
  free_waiting_mins: number;

  @Column({ type: 'boolean', default: false })
  requires_terminal_selection: boolean;

  @Column({ type: 'simple-array', nullable: true })
  terminals: string[] | null; // e.g., ['Terminal 1', 'Terminal 2', 'Terminal 3']

  @Column({ type: 'varchar', length: 500, nullable: true })
  special_instructions: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  operating_hours: {
    start: string; // "HH:mm" format
    end: string;
  } | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
