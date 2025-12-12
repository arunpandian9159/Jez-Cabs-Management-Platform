import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { DriverStatus } from '../../../common/enums';
import { User } from '../../iam/entities/user.entity';

@Entity('driver_profiles')
export class DriverProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    license_number: string | null;

    @Column({ type: 'date', nullable: true })
    license_expiry: Date | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    license_type: string | null;

    @Column({ type: 'date', nullable: true })
    date_of_birth: Date | null;

    @Column({ type: 'text', nullable: true })
    address: string | null;

    @Column({
        type: 'enum',
        enum: DriverStatus,
        default: DriverStatus.OFFLINE,
    })
    status: DriverStatus;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
    rating: number;

    @Column({ type: 'int', default: 0 })
    total_trips: number;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    current_location_lat: number | null;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    current_location_lng: number | null;

    @Column({ type: 'boolean', default: false })
    is_online: boolean;

    @Column({ type: 'uuid', nullable: true })
    current_cab_id: string | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
