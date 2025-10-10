import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThanOrEqual, MoreThan } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cab } from '../entities/cab.entity';
import { User } from '../../iam/entities';
import { CreateCabDto, UpdateCabDto, FilterCabDto } from '../dto';
import { CabStatus } from '../../../common/enums';

@Injectable()
export class CabService {
  constructor(
    @InjectRepository(Cab)
    private readonly cabRepository: Repository<Cab>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createCabDto: CreateCabDto, currentUser: User): Promise<Cab> {
    // Check if registration number already exists for this company
    const existingCab = await this.cabRepository.findOne({
      where: {
        company_id: currentUser.company_id,
        registration_number: createCabDto.registration_number,
      },
    });

    if (existingCab) {
      throw new ConflictException(
        `Vehicle with registration number ${createCabDto.registration_number} already exists`,
      );
    }

    // Create new cab
    const cab = this.cabRepository.create({
      ...createCabDto,
      company_id: currentUser.company_id,
      status: createCabDto.status || CabStatus.AVAILABLE,
    });

    const savedCab = await this.cabRepository.save(cab);

    // Emit event for cab creation
    this.eventEmitter.emit('cab.created', {
      cabId: savedCab.id,
      companyId: savedCab.company_id,
      registrationNumber: savedCab.registration_number,
    });

    return savedCab;
  }

  async findAll(filterDto: FilterCabDto, currentUser: User) {
    const {
      status,
      make,
      model,
      fuel_type,
      search,
      expiring_documents,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = filterDto;

    const queryBuilder = this.cabRepository
      .createQueryBuilder('cab')
      .where('cab.company_id = :companyId', { companyId: currentUser.company_id });

    // Apply filters
    if (status) {
      queryBuilder.andWhere('cab.status = :status', { status });
    }

    if (make) {
      queryBuilder.andWhere('cab.make = :make', { make });
    }

    if (model) {
      queryBuilder.andWhere('cab.model = :model', { model });
    }

    if (fuel_type) {
      queryBuilder.andWhere('cab.fuel_type = :fuel_type', { fuel_type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(cab.registration_number ILIKE :search OR cab.vin ILIKE :search OR cab.make ILIKE :search OR cab.model ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter for expiring documents (within 30 days)
    if (expiring_documents) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      queryBuilder.andWhere(
        '(cab.insurance_expiry <= :expiryDate OR cab.registration_expiry <= :expiryDate)',
        { expiryDate: thirtyDaysFromNow },
      );
    }

    // Sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'make',
      'model',
      'year',
      'registration_number',
      'status',
    ];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    queryBuilder.orderBy(`cab.${sortField}`, sort_order);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [cabs, total] = await queryBuilder.getManyAndCount();

    // Check for expiring documents and add alerts
    const cabsWithAlerts = cabs.map((cab) => this.addExpiryAlerts(cab));

    return {
      data: cabsWithAlerts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<Cab> {
    const cab = await this.cabRepository.findOne({
      where: { id, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Vehicle not found');
    }

    return this.addExpiryAlerts(cab);
  }

  async update(id: string, updateCabDto: UpdateCabDto, currentUser: User): Promise<Cab> {
    const cab = await this.findOne(id, currentUser);

    // If registration number is being updated, check for conflicts
    if (
      updateCabDto.registration_number &&
      updateCabDto.registration_number !== cab.registration_number
    ) {
      const existingCab = await this.cabRepository.findOne({
        where: {
          company_id: currentUser.company_id,
          registration_number: updateCabDto.registration_number,
        },
      });

      if (existingCab) {
        throw new ConflictException(
          `Vehicle with registration number ${updateCabDto.registration_number} already exists`,
        );
      }
    }

    // Update cab
    Object.assign(cab, updateCabDto);
    const updatedCab = await this.cabRepository.save(cab);

    // Emit event for cab update
    this.eventEmitter.emit('cab.updated', {
      cabId: updatedCab.id,
      companyId: updatedCab.company_id,
      changes: updateCabDto,
    });

    return this.addExpiryAlerts(updatedCab);
  }

  async updateStatus(id: string, status: CabStatus, currentUser: User): Promise<Cab> {
    const cab = await this.findOne(id, currentUser);

    const oldStatus = cab.status;
    cab.status = status;
    const updatedCab = await this.cabRepository.save(cab);

    // Emit event for status change
    this.eventEmitter.emit('cab.status.changed', {
      cabId: updatedCab.id,
      companyId: updatedCab.company_id,
      oldStatus,
      newStatus: status,
    });

    return updatedCab;
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const cab = await this.findOne(id, currentUser);

    // Check if cab is currently rented
    if (cab.status === CabStatus.RENTED) {
      throw new BadRequestException('Cannot delete a vehicle that is currently rented');
    }

    await this.cabRepository.remove(cab);

    // Emit event for cab deletion
    this.eventEmitter.emit('cab.deleted', {
      cabId: id,
      companyId: currentUser.company_id,
      registrationNumber: cab.registration_number,
    });

    return { message: 'Vehicle deleted successfully' };
  }

  async getExpiringDocuments(currentUser: User, days: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const cabs = await this.cabRepository
      .createQueryBuilder('cab')
      .where('cab.company_id = :companyId', { companyId: currentUser.company_id })
      .andWhere(
        '(cab.insurance_expiry <= :expiryDate OR cab.registration_expiry <= :expiryDate)',
        { expiryDate },
      )
      .orderBy('cab.insurance_expiry', 'ASC')
      .getMany();

    return cabs.map((cab) => this.addExpiryAlerts(cab));
  }

  async getStatistics(currentUser: User) {
    const totalCabs = await this.cabRepository.count({
      where: { company_id: currentUser.company_id },
    });

    const availableCabs = await this.cabRepository.count({
      where: { company_id: currentUser.company_id, status: CabStatus.AVAILABLE },
    });

    const rentedCabs = await this.cabRepository.count({
      where: { company_id: currentUser.company_id, status: CabStatus.RENTED },
    });

    const inMaintenanceCabs = await this.cabRepository.count({
      where: { company_id: currentUser.company_id, status: CabStatus.IN_MAINTENANCE },
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringDocuments = await this.cabRepository
      .createQueryBuilder('cab')
      .where('cab.company_id = :companyId', { companyId: currentUser.company_id })
      .andWhere(
        '(cab.insurance_expiry <= :expiryDate OR cab.registration_expiry <= :expiryDate)',
        { expiryDate: thirtyDaysFromNow },
      )
      .getCount();

    return {
      total: totalCabs,
      available: availableCabs,
      rented: rentedCabs,
      inMaintenance: inMaintenanceCabs,
      expiringDocuments,
      utilizationRate: totalCabs > 0 ? ((rentedCabs / totalCabs) * 100).toFixed(2) : 0,
    };
  }

  private addExpiryAlerts(cab: Cab): any {
    const alerts: any[] = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (cab.insurance_expiry) {
      const insuranceExpiry = new Date(cab.insurance_expiry);
      if (insuranceExpiry <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil(
          (insuranceExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        alerts.push({
          type: 'insurance',
          message:
            daysUntilExpiry > 0
              ? `Insurance expires in ${daysUntilExpiry} days`
              : `Insurance expired ${Math.abs(daysUntilExpiry)} days ago`,
          severity: daysUntilExpiry <= 0 ? 'critical' : daysUntilExpiry <= 7 ? 'high' : 'medium',
          expiryDate: cab.insurance_expiry,
        });
      }
    }

    if (cab.registration_expiry) {
      const registrationExpiry = new Date(cab.registration_expiry);
      if (registrationExpiry <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil(
          (registrationExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        alerts.push({
          type: 'registration',
          message:
            daysUntilExpiry > 0
              ? `Registration expires in ${daysUntilExpiry} days`
              : `Registration expired ${Math.abs(daysUntilExpiry)} days ago`,
          severity: daysUntilExpiry <= 0 ? 'critical' : daysUntilExpiry <= 7 ? 'high' : 'medium',
          expiryDate: cab.registration_expiry,
        });
      }
    }

    return {
      ...cab,
      alerts: alerts.length > 0 ? alerts : undefined,
    };
  }
}
