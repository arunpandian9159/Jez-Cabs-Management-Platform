import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputeStatus } from '../../common/enums';

@Injectable()
export class DisputesService {
    constructor(
        @InjectRepository(Dispute)
        private disputeRepository: Repository<Dispute>,
    ) { }

    private generateTicketNumber(): string {
        const prefix = 'DSP';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    async create(data: Partial<Dispute>): Promise<Dispute> {
        const dispute = this.disputeRepository.create({
            ...data,
            ticket_number: this.generateTicketNumber(),
            status: DisputeStatus.OPEN,
        });
        return this.disputeRepository.save(dispute);
    }

    async findAll(userId?: string, status?: DisputeStatus): Promise<Dispute[]> {
        const where: any = {};
        if (userId) where.raised_by = userId;
        if (status) where.status = status;
        return this.disputeRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Dispute> {
        const dispute = await this.disputeRepository.findOne({ where: { id } });
        if (!dispute) {
            throw new NotFoundException('Dispute not found');
        }
        return dispute;
    }

    async resolve(id: string, resolution: string, refundAmount?: number): Promise<Dispute> {
        const dispute = await this.findOne(id);
        dispute.status = DisputeStatus.RESOLVED;
        dispute.resolution = resolution;
        dispute.refund_amount = refundAmount || null;
        dispute.resolved_at = new Date();
        return this.disputeRepository.save(dispute);
    }

    async updateStatus(id: string, status: DisputeStatus): Promise<Dispute> {
        const dispute = await this.findOne(id);
        dispute.status = status;
        return this.disputeRepository.save(dispute);
    }
}
