import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { User, UserStatus } from '../iam/entities/user.entity';
import { Trip } from '../trips/entities/trip.entity';
import { Payment } from '../payments/entities/payment.entity';
import { VerificationStatus, UserRole } from '../../common/enums';

export interface VerificationStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export interface VerificationFilters {
    status?: VerificationStatus;
    type?: 'driver' | 'cab_owner';
    search?: string;
    limit?: number;
    offset?: number;
}

export interface UserFilters {
    status?: string;
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface UserWithStats {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    location: string;
    joinedAt: string;
    totalTrips: number;
    totalSpent: number;
}

export interface UserStats {
    total: number;
    active: number;
    suspended: number;
    inactive: number;
}

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Verification)
        private verificationRepository: Repository<Verification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Trip)
        private tripRepository: Repository<Trip>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ) { }

    // ==================== User Management ====================

    async getAllUsers(filters?: UserFilters): Promise<UserWithStats[]> {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .orderBy('user.created_at', 'DESC');

        // Only get customers by default (not admins/support)
        if (filters?.role) {
            queryBuilder.andWhere('user.role = :role', { role: filters.role });
        } else {
            queryBuilder.andWhere('user.role = :role', { role: UserRole.CUSTOMER });
        }

        if (filters?.status && filters.status !== 'all') {
            queryBuilder.andWhere('user.status = :status', { status: filters.status });
        }

        if (filters?.search) {
            queryBuilder.andWhere(
                '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        if (filters?.limit) {
            queryBuilder.take(filters.limit);
        }

        if (filters?.offset) {
            queryBuilder.skip(filters.offset);
        }

        const users = await queryBuilder.getMany();

        // Get trip counts and total spent for each user
        const usersWithStats: UserWithStats[] = await Promise.all(
            users.map(async (user) => {
                const tripCount = await this.tripRepository.count({
                    where: { customer_id: user.id },
                });

                const payments = await this.paymentRepository.find({
                    where: { payer_id: user.id },
                });

                const totalSpent = payments.reduce(
                    (acc, payment) => acc + Number(payment.amount || 0),
                    0,
                );

                return {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    status: user.status,
                    location: 'India', // Default location, can be enhanced later
                    joinedAt: user.created_at.toISOString(),
                    totalTrips: tripCount,
                    totalSpent,
                };
            }),
        );

        return usersWithStats;
    }

    async getUserStats(): Promise<UserStats> {
        const [total, active, suspended, inactive] = await Promise.all([
            this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
            this.userRepository.count({
                where: { role: UserRole.CUSTOMER, status: UserStatus.ACTIVE },
            }),
            this.userRepository.count({
                where: { role: UserRole.CUSTOMER, status: UserStatus.SUSPENDED },
            }),
            this.userRepository.count({
                where: { role: UserRole.CUSTOMER, status: UserStatus.INACTIVE },
            }),
        ]);

        return { total, active, suspended, inactive };
    }

    // ==================== Verifications ====================

    async getVerifications(
        filters?: VerificationFilters,
    ): Promise<Verification[]> {
        const queryBuilder = this.verificationRepository
            .createQueryBuilder('v')
            .leftJoinAndSelect('v.user', 'user')
            .leftJoinAndSelect('v.verifiedBy', 'verifiedBy')
            .orderBy('v.created_at', 'DESC');

        if (filters?.status) {
            queryBuilder.andWhere('v.status = :status', { status: filters.status });
        }

        if (filters?.type) {
            // Filter by document type patterns
            if (filters.type === 'driver') {
                queryBuilder.andWhere(
                    "(v.document_type ILIKE '%license%' OR v.document_type ILIKE '%aadhaar%' OR v.document_type ILIKE '%pan%')",
                );
            } else {
                queryBuilder.andWhere(
                    "(v.document_type ILIKE '%rc%' OR v.document_type ILIKE '%insurance%' OR v.document_type ILIKE '%permit%')",
                );
            }
        }

        if (filters?.search) {
            queryBuilder.andWhere(
                '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search OR v.document_number ILIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        if (filters?.limit) {
            queryBuilder.take(filters.limit);
        }

        if (filters?.offset) {
            queryBuilder.skip(filters.offset);
        }

        return queryBuilder.getMany();
    }

    async getVerificationStats(): Promise<VerificationStats> {
        const [total, pending, approved, rejected] = await Promise.all([
            this.verificationRepository.count(),
            this.verificationRepository.count({
                where: { status: VerificationStatus.PENDING },
            }),
            this.verificationRepository.count({
                where: { status: VerificationStatus.APPROVED },
            }),
            this.verificationRepository.count({
                where: { status: VerificationStatus.REJECTED },
            }),
        ]);

        return { total, pending, approved, rejected };
    }

    async getVerification(id: string): Promise<Verification> {
        const verification = await this.verificationRepository.findOne({
            where: { id },
            relations: ['user', 'verifiedBy'],
        });

        if (!verification) {
            throw new NotFoundException('Verification not found');
        }

        return verification;
    }

    async approveVerification(
        id: string,
        adminId: string,
        notes?: string,
    ): Promise<Verification> {
        const verification = await this.getVerification(id);

        verification.status = VerificationStatus.APPROVED;
        verification.verified_by = adminId;
        verification.verified_at = new Date();

        return this.verificationRepository.save(verification);
    }

    async rejectVerification(
        id: string,
        adminId: string,
        reason: string,
    ): Promise<Verification> {
        const verification = await this.getVerification(id);

        verification.status = VerificationStatus.REJECTED;
        verification.verified_by = adminId;
        verification.verified_at = new Date();
        verification.rejection_reason = reason;

        return this.verificationRepository.save(verification);
    }

    async createVerification(data: Partial<Verification>): Promise<Verification> {
        const verification = this.verificationRepository.create(data);
        return this.verificationRepository.save(verification);
    }
}
