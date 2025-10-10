import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Invoice } from '../entities/invoice.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../iam/entities';
import { CreateInvoiceDto, UpdateInvoiceDto, FilterInvoiceDto } from '../dto';
import { InvoiceStatus } from '../../../common/enums';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, currentUser: User): Promise<Invoice> {
    const { bookingId, ...invoiceData } = createInvoiceDto;

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, company_id: currentUser.company_id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const invoiceNumber = await this.generateInvoiceNumber(currentUser.company_id);

    const invoice = this.invoiceRepository.create({
      ...invoiceData,
      booking_id: bookingId,
      company_id: currentUser.company_id,
      invoice_number: invoiceNumber,
      status: createInvoiceDto.status || InvoiceStatus.DRAFT,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    this.eventEmitter.emit('invoice.created', {
      invoiceId: savedInvoice.id,
      companyId: savedInvoice.company_id,
      bookingId: savedInvoice.booking_id,
    });

    return savedInvoice;
  }

  async findAll(filterDto: FilterInvoiceDto, currentUser: User) {
    const { status, bookingId, page = 1, limit = 50 } = filterDto;

    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.booking', 'booking')
      .where('invoice.company_id = :companyId', { companyId: currentUser.company_id });

    if (status) queryBuilder.andWhere('invoice.status = :status', { status });
    if (bookingId) queryBuilder.andWhere('invoice.booking_id = :bookingId', { bookingId });

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit).orderBy('invoice.created_at', 'DESC');

    const [invoices, total] = await queryBuilder.getManyAndCount();

    return {
      data: invoices,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, currentUser: User): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, company_id: currentUser.company_id },
      relations: ['booking'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, currentUser: User): Promise<Invoice> {
    const invoice = await this.findOne(id, currentUser);
    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async updateStatus(id: string, status: InvoiceStatus, currentUser: User): Promise<Invoice> {
    const invoice = await this.findOne(id, currentUser);
    invoice.status = status;

    if (status === InvoiceStatus.PAID) {
      invoice.paid_date = new Date();
    }

    const updatedInvoice = await this.invoiceRepository.save(invoice);

    this.eventEmitter.emit('invoice.status.changed', {
      invoiceId: updatedInvoice.id,
      companyId: updatedInvoice.company_id,
      status,
    });

    return updatedInvoice;
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const invoice = await this.findOne(id, currentUser);
    await this.invoiceRepository.remove(invoice);
    return { message: 'Invoice deleted successfully' };
  }

  async getStatistics(currentUser: User) {
    const total = await this.invoiceRepository.count({ where: { company_id: currentUser.company_id } });
    const draft = await this.invoiceRepository.count({ where: { company_id: currentUser.company_id, status: InvoiceStatus.DRAFT } });
    const sent = await this.invoiceRepository.count({ where: { company_id: currentUser.company_id, status: InvoiceStatus.SENT } });
    const paid = await this.invoiceRepository.count({ where: { company_id: currentUser.company_id, status: InvoiceStatus.PAID } });
    const overdue = await this.invoiceRepository.count({ where: { company_id: currentUser.company_id, status: InvoiceStatus.OVERDUE } });

    const revenueResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.amount)', 'total')
      .where('invoice.company_id = :companyId', { companyId: currentUser.company_id })
      .andWhere('invoice.status = :status', { status: InvoiceStatus.PAID })
      .getRawOne();

    return {
      total,
      draft,
      sent,
      paid,
      overdue,
      totalRevenue: parseFloat(revenueResult?.total || '0'),
    };
  }

  private async generateInvoiceNumber(companyId: string): Promise<string> {
    const count = await this.invoiceRepository.count({ where: { company_id: companyId } });
    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}

