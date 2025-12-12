import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../iam/entities/user.entity';

@Entity('saved_addresses')
export class SavedAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 50 })
    label: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    lat: number;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    lng: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    icon: string;

    @Column({ type: 'boolean', default: false })
    is_default: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
