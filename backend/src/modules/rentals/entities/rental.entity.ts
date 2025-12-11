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
import { RentalStatus } from '../../common/enums';
import { User } from '../iam/entities/user.entity';
import { Cab } from '../cab/entities/cab.entity';

@Entity('rentals')
export class Rental {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index()
    customer_id: string;

    @Column({ type: 'uuid' })
    @Index()
    cab_id: string;

    @Column({ type: 'timestamp' })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column({ type: 'text', nullable: true })
    pickup_location: string | null;

    @Column({ type: 'text', nullable: true })
    return_location: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    daily_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_amount: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    deposit_amount: number | null;

    @Column({
        type: 'enum',
        enum: RentalStatus,
        default: RentalStatus.PENDING,
    })
    @Index()
    status: RentalStatus;

    @Column({ type: 'boolean', default: false })
    with_driver: boolean;

    @Column({ type: 'uuid', nullable: true })
    driver_id: string | null;

    @Column({ type: 'int', nullable: true })
    km_limit_per_day: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    extra_km_rate: number | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: 'customer_id' })
    customer: User;

    @ManyToOne(() => Cab)
    @JoinColumn({ name: 'cab_id' })
    cab: Cab;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'driver_id' })
    driver: User | null;
}
