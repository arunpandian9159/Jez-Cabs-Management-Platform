import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Driver } from '../entities/driver.entity';
import { User } from '../../iam/entities';
import { CreateDriverDto, UpdateDriverDto, FilterDriverDto } from '../dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createDriverDto: CreateDriverDto, currentUser: User): Promise<Driver> {
    // Check if license number already exists for this company
    const existingDriver = await this.driverRepository.findOne({
      where: {
        company_id: currentUser.company_id,
        license_number: createDriverDto.licenseNumber,
      },
    });

    if (existingDriver) {
      throw new ConflictException(
        `Driver with license number ${createDriverDto.licenseNumber} already exists`,
      );
    }

    // Check if email already exists for this company
    const existingEmail = await this.driverRepository.findOne({
      where: {
        company_id: currentUser.company_id,
        email: createDriverDto.email,
      },
    });

    if (existingEmail) {
      throw new ConflictException(
        `Driver with email ${createDriverDto.email} already exists`,
      );
    }

    // Create new driver
    const driver = this.driverRepository.create({
      ...createDriverDto,
      company_id: currentUser.company_id,
    });

    const savedDriver = await this.driverRepository.save(driver);

    // Emit event for driver creation
    this.eventEmitter.emit('driver.created', {
      driverId: savedDriver.id,
      companyId: savedDriver.company_id,
      name: `${savedDriver.first_name} ${savedDriver.last_name}`,
    });

    return savedDriver;
  }

  async findAll(filterDto: FilterDriverDto, currentUser: User) {
    const {
      search,
      isActive,
      expiringLicenses,
      page = 1,
      limit = 50,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder = this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.company_id = :companyId', { companyId: currentUser.company_id });

    // Apply filters
    if (isActive !== undefined) {
      queryBuilder.andWhere('driver.is_active = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(driver.first_name ILIKE :search OR driver.last_name ILIKE :search OR driver.email ILIKE :search OR driver.license_number ILIKE :search OR driver.contact_number ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter for expiring licenses (within 30 days)
    if (expiringLicenses) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      queryBuilder.andWhere('driver.license_expiry <= :expiryDate', {
        expiryDate: thirtyDaysFromNow,
      });
    }

    // Sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'first_name',
      'last_name',
      'email',
      'license_expiry',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    queryBuilder.orderBy(`driver.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [drivers, total] = await queryBuilder.getManyAndCount();

    // Add license expiry alerts
    const driversWithAlerts = drivers.map((driver) => this.addLicenseExpiryAlerts(driver));

    return {
      data: driversWithAlerts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id, company_id: currentUser.company_id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return this.addLicenseExpiryAlerts(driver);
  }

  async update(id: string, updateDriverDto: UpdateDriverDto, currentUser: User): Promise<Driver> {
    const driver = await this.findOne(id, currentUser);

    // If license number is being updated, check for conflicts
    if (
      updateDriverDto.licenseNumber &&
      updateDriverDto.licenseNumber !== driver.license_number
    ) {
      const existingDriver = await this.driverRepository.findOne({
        where: {
          company_id: currentUser.company_id,
          license_number: updateDriverDto.licenseNumber,
        },
      });

      if (existingDriver) {
        throw new ConflictException(
          `Driver with license number ${updateDriverDto.licenseNumber} already exists`,
        );
      }
    }

    // If email is being updated, check for conflicts
    if (updateDriverDto.email && updateDriverDto.email !== driver.email) {
      const existingEmail = await this.driverRepository.findOne({
        where: {
          company_id: currentUser.company_id,
          email: updateDriverDto.email,
        },
      });

      if (existingEmail) {
        throw new ConflictException(
          `Driver with email ${updateDriverDto.email} already exists`,
        );
      }
    }

    // Update driver
    Object.assign(driver, updateDriverDto);
    const updatedDriver = await this.driverRepository.save(driver);

    // Emit event for driver update
    this.eventEmitter.emit('driver.updated', {
      driverId: updatedDriver.id,
      companyId: updatedDriver.company_id,
      changes: updateDriverDto,
    });

    return this.addLicenseExpiryAlerts(updatedDriver);
  }

  async deactivate(id: string, currentUser: User): Promise<Driver> {
    const driver = await this.findOne(id, currentUser);

    driver.is_active = false;
    const updatedDriver = await this.driverRepository.save(driver);

    // Emit event for driver deactivation
    this.eventEmitter.emit('driver.deactivated', {
      driverId: updatedDriver.id,
      companyId: updatedDriver.company_id,
      name: `${updatedDriver.first_name} ${updatedDriver.last_name}`,
    });

    return updatedDriver;
  }

  async activate(id: string, currentUser: User): Promise<Driver> {
    const driver = await this.findOne(id, currentUser);

    driver.is_active = true;
    const updatedDriver = await this.driverRepository.save(driver);

    // Emit event for driver activation
    this.eventEmitter.emit('driver.activated', {
      driverId: updatedDriver.id,
      companyId: updatedDriver.company_id,
      name: `${updatedDriver.first_name} ${updatedDriver.last_name}`,
    });

    return updatedDriver;
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const driver = await this.findOne(id, currentUser);

    await this.driverRepository.remove(driver);

    // Emit event for driver deletion
    this.eventEmitter.emit('driver.deleted', {
      driverId: id,
      companyId: currentUser.company_id,
      name: `${driver.first_name} ${driver.last_name}`,
    });

    return { message: 'Driver deleted successfully' };
  }

  async getExpiringLicenses(currentUser: User, days: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.company_id = :companyId', { companyId: currentUser.company_id })
      .andWhere('driver.license_expiry <= :expiryDate', { expiryDate })
      .orderBy('driver.license_expiry', 'ASC')
      .getMany();

    return drivers.map((driver) => this.addLicenseExpiryAlerts(driver));
  }

  async getStatistics(currentUser: User) {
    const totalDrivers = await this.driverRepository.count({
      where: { company_id: currentUser.company_id },
    });

    const activeDrivers = await this.driverRepository.count({
      where: { company_id: currentUser.company_id, is_active: true },
    });

    const inactiveDrivers = await this.driverRepository.count({
      where: { company_id: currentUser.company_id, is_active: false },
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringLicenses = await this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.company_id = :companyId', { companyId: currentUser.company_id })
      .andWhere('driver.license_expiry <= :expiryDate', { expiryDate: thirtyDaysFromNow })
      .getCount();

    return {
      total: totalDrivers,
      active: activeDrivers,
      inactive: inactiveDrivers,
      expiringLicenses,
    };
  }

  private addLicenseExpiryAlerts(driver: Driver): any {
    const alerts: any[] = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (driver.license_expiry) {
      const licenseExpiry = new Date(driver.license_expiry);
      if (licenseExpiry <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil(
          (licenseExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        alerts.push({
          type: 'license',
          message:
            daysUntilExpiry > 0
              ? `License expires in ${daysUntilExpiry} days`
              : `License expired ${Math.abs(daysUntilExpiry)} days ago`,
          severity: daysUntilExpiry <= 0 ? 'critical' : daysUntilExpiry <= 7 ? 'high' : 'medium',
          expiryDate: driver.license_expiry,
        });
      }
    }

    return {
      ...driver,
      alerts: alerts.length > 0 ? alerts : undefined,
    };
  }
}

