import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { RentalStatus } from '../../common/enums';

@Injectable()
export class RentalsService {
    constructor(
        @InjectRepository(Rental)
        private rentalRepository: Repository<Rental>,
    ) { }

    async create(data: Partial<Rental>): Promise<Rental> {
        const rental = this.rentalRepository.create({
            ...data,
            status: RentalStatus.PENDING,
        });
        return this.rentalRepository.save(rental);
    }

    async findAll(customerId?: string): Promise<Rental[]> {
        if (customerId) {
            return this.rentalRepository.find({
                where: { customer_id: customerId },
                order: { created_at: 'DESC' },
            });
        }
        return this.rentalRepository.find({ order: { created_at: 'DESC' } });
    }

    async findOne(id: string): Promise<Rental> {
        const rental = await this.rentalRepository.findOne({ where: { id } });
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }
        return rental;
    }

    async updateStatus(id: string, status: RentalStatus): Promise<Rental> {
        const rental = await this.findOne(id);
        rental.status = status;
        return this.rentalRepository.save(rental);
    }
}
