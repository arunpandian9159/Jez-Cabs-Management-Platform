import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { VerificationStatus } from '../../common/enums';

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

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Verification)
        private verificationRepository: Repository<Verification>,
    ) { }

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
