import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cab } from '../entities/cab.entity';
import { User } from '../../iam/entities';
import { CreateCabDto, UpdateCabDto, FilterCabDto } from '../dto';
import { CabStatus, CabType } from '../../../common/enums';

@Injectable()
export class CabService {
  constructor(
    @InjectRepository(Cab)
    private readonly cabRepository: Repository<Cab>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(createCabDto: CreateCabDto, currentUser: User): Promise<Cab> {
    // Check if registration number already exists
    const existingCab = await this.cabRepository.findOne({
      where: {
        registration_number: createCabDto.registration_number,
      },
    });

    if (existingCab) {
      throw new ConflictException(
        `Vehicle with registration number ${createCabDto.registration_number} already exists`,
      );
    }

    // Create new cab with owner
    const cab = this.cabRepository.create({
      ...createCabDto,
      owner_id: currentUser.id,
      status: createCabDto.status || CabStatus.AVAILABLE,
      cab_type: createCabDto.cab_type || CabType.SEDAN,
    });

    const savedCab = await this.cabRepository.save(cab);

    // Emit event for cab creation
    this.eventEmitter.emit('cab.created', {
      cabId: savedCab.id,
      ownerId: savedCab.owner_id,
      registrationNumber: savedCab.registration_number,
    });

    return savedCab;
  }

  async findAll(filterDto: FilterCabDto, currentUser: User) {
    const {
      status,
      make,
      model,
      cab_type,
      search,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = filterDto;

    const queryBuilder = this.cabRepository.createQueryBuilder('cab');

    // If cab owner, only show their cabs
    if (currentUser.role === 'cab_owner') {
      queryBuilder.where('cab.owner_id = :ownerId', { ownerId: currentUser.id });
    }

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

    if (cab_type) {
      queryBuilder.andWhere('cab.cab_type = :cabType', { cabType: cab_type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(cab.registration_number ILIKE :search OR cab.make ILIKE :search OR cab.model ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    const allowedSortFields = ['created_at', 'updated_at', 'make', 'model', 'year', 'registration_number', 'status'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    queryBuilder.orderBy(`cab.${sortField}`, sort_order);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [cabs, total] = await queryBuilder.getManyAndCount();

    return {
      data: cabs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAvailable(lat?: number, lng?: number, cabType?: CabType): Promise<Cab[]> {
    const queryBuilder = this.cabRepository
      .createQueryBuilder('cab')
      .where('cab.status = :status', { status: CabStatus.AVAILABLE });

    if (cabType) {
      queryBuilder.andWhere('cab.cab_type = :cabType', { cabType });
    }

    // In production, add distance-based filtering using lat/lng
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Cab> {
    const cab = await this.cabRepository.findOne({
      where: { id },
      relations: ['owner', 'assigned_driver'],
    });

    if (!cab) {
      throw new NotFoundException('Vehicle not found');
    }

    return cab;
  }

  async findByOwner(ownerId: string): Promise<Cab[]> {
    return this.cabRepository.find({
      where: { owner_id: ownerId },
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateCabDto: UpdateCabDto, currentUser: User): Promise<Cab> {
    const cab = await this.findOne(id);

    // Check ownership
    if (currentUser.role === 'cab_owner' && cab.owner_id !== currentUser.id) {
      throw new BadRequestException('You can only update your own vehicles');
    }

    // If registration number is being updated, check for conflicts
    if (updateCabDto.registration_number && updateCabDto.registration_number !== cab.registration_number) {
      const existingCab = await this.cabRepository.findOne({
        where: { registration_number: updateCabDto.registration_number },
      });

      if (existingCab) {
        throw new ConflictException(
          `Vehicle with registration number ${updateCabDto.registration_number} already exists`,
        );
      }
    }

    Object.assign(cab, updateCabDto);
    return this.cabRepository.save(cab);
  }

  async updateStatus(id: string, status: CabStatus): Promise<Cab> {
    const cab = await this.findOne(id);
    cab.status = status;
    return this.cabRepository.save(cab);
  }

  async assignDriver(cabId: string, driverId: string): Promise<Cab> {
    const cab = await this.findOne(cabId);
    cab.assigned_driver_id = driverId;
    return this.cabRepository.save(cab);
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const cab = await this.findOne(id);

    if (currentUser.role === 'cab_owner' && cab.owner_id !== currentUser.id) {
      throw new BadRequestException('You can only delete your own vehicles');
    }

    if (cab.status === CabStatus.ON_TRIP) {
      throw new BadRequestException('Cannot delete a vehicle that is on a trip');
    }

    await this.cabRepository.remove(cab);
    return { message: 'Vehicle deleted successfully' };
  }

  async getStatistics(ownerId: string) {
    const totalCabs = await this.cabRepository.count({ where: { owner_id: ownerId } });
    const availableCabs = await this.cabRepository.count({ where: { owner_id: ownerId, status: CabStatus.AVAILABLE } });
    const onTripCabs = await this.cabRepository.count({ where: { owner_id: ownerId, status: CabStatus.ON_TRIP } });
    const maintenanceCabs = await this.cabRepository.count({ where: { owner_id: ownerId, status: CabStatus.MAINTENANCE } });

    return {
      total: totalCabs,
      available: availableCabs,
      onTrip: onTripCabs,
      maintenance: maintenanceCabs,
    };
  }
}
