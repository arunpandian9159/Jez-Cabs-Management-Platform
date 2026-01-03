import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Company } from './company.entity';
import { User } from '../../iam/entities/user.entity';

export enum EmployeeRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export enum EmployeeStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REMOVED = 'removed',
}

@Entity('company_employees')
@Index(['company_id', 'user_id'], { unique: true })
export class CompanyEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  company_id: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  user_id: string | null; // null until user accepts invite

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  employee_id: string | null; // Company's internal employee ID

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string | null;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.EMPLOYEE,
  })
  role: EmployeeRole;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.INVITED,
  })
  @Index()
  status: EmployeeStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  invite_token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  invite_expires_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  joined_at: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthly_limit: number | null; // Override company policy

  @Column({ type: 'int', default: 0 })
  trips_this_month: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  spend_this_month: number;

  @CreateDateColumn()
  created_at: Date;
}
