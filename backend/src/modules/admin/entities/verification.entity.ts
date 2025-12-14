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
import { VerificationStatus } from '../../../common/enums';
import { User } from '../../iam/entities/user.entity';

@Entity('document_verifications')
export class Verification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index()
    user_id: string;

    @Column({ type: 'varchar', length: 50 })
    document_type: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    document_number: string | null;

    @Column({ type: 'text', nullable: true })
    document_url: string | null;

    @Column({
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    })
    @Index()
    status: VerificationStatus;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    submitted_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    verified_at: Date | null;

    @Column({ type: 'uuid', nullable: true })
    verified_by: string | null;

    @Column({ type: 'text', nullable: true })
    rejection_reason: string | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'verified_by' })
    verifiedBy: User | null;

    // Virtual property for type (derived from document_type)
    get type(): 'driver' | 'cab_owner' {
        // If document_type contains license or driver, return driver
        // Otherwise, return cab_owner
        const driverDocs = ['license', 'aadhaar', 'pan'];
        return driverDocs.some((d) => this.document_type?.toLowerCase().includes(d))
            ? 'driver'
            : 'cab_owner';
    }
}
