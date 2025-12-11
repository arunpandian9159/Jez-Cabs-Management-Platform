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
import { DisputeStatus, DisputePriority } from '../../../common/enums';
import { User } from '../../iam/entities/user.entity';

@Entity('disputes')
export class Dispute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    ticket_number: string;

    @Column({ type: 'uuid', nullable: true })
    trip_id: string | null;

    @Column({ type: 'uuid', nullable: true })
    rental_id: string | null;

    @Column({ type: 'uuid' })
    @Index()
    raised_by: string;

    @Column({ type: 'uuid', nullable: true })
    against_user: string | null;

    @Column({ type: 'varchar', length: 100 })
    issue_type: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: DisputePriority,
        default: DisputePriority.MEDIUM,
    })
    priority: DisputePriority;

    @Column({
        type: 'enum',
        enum: DisputeStatus,
        default: DisputeStatus.OPEN,
    })
    @Index()
    status: DisputeStatus;

    @Column({ type: 'uuid', nullable: true })
    assigned_to: string | null;

    @Column({ type: 'text', nullable: true })
    resolution: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    refund_amount: number | null;

    @Column({ type: 'timestamp', nullable: true })
    resolved_at: Date | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: 'raised_by' })
    raisedByUser: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'against_user' })
    againstUser: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignedToUser: User | null;
}
