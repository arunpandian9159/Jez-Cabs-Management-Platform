import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

@Entity('cab_owner_profiles')
export class CabOwnerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    business_name: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gst_number: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    pan_number: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    bank_account_number: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    bank_ifsc: string | null;

    @Column({ type: 'int', default: 0 })
    total_cabs: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    total_earnings: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
