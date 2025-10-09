import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking } from '../entities/booking.entity';
import { Cab } from '../../cab/entities/cab.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { User } from '../../iam/entities';
import { CreateBookingDto, UpdateBookingDto, FilterBookingDto } from '../dto';
import { BookingStatus, CabStatus } from '../../../common/enums';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Cab)
    private readonly cabRepository: Repository<Cab>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createBookingDto: CreateBookingDto, currentUser: User): Promise<Booking> {
    const { cabId, driverId, startDate, endDate, ...bookingData } = createBookingDto;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('End date must be after start date');
    }

    if (start < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Check if cab exists and belongs to the company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, companyId: currentUser.companyId },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    // Check if cab is available (not in maintenance)
    if (cab.status === CabStatus.IN_MAINTENANCE) {
      throw new BadRequestException('Cab is currently in maintenance and cannot be booked');
    }

    // Check for booking conflicts
    await this.checkBookingConflicts(cabId, startDate, endDate, currentUser.companyId);

    // If driver is specified, validate driver
    let driver: Driver | null = null;
    if (driverId) {
      driver = await this.driverRepository.findOne({
        where: { id: driverId, companyId: currentUser.companyId, isActive: true },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found or inactive');
      }

      // Check if driver is available for this period
      await this.checkDriverConflicts(driverId, startDate, endDate, currentUser.companyId);
    }

    // Create booking
    const booking = this.bookingRepository.create({
      ...bookingData,
      cabId,
      driverId: driverId || null,
      startDate,
      endDate,
      companyId: currentUser.companyId,
      status: createBookingDto.status || BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Update cab status to RENTED if booking is active
    if (savedBooking.status === BookingStatus.ACTIVE) {
      cab.status = CabStatus.RENTED;
      await this.cabRepository.save(cab);
    }

    // Emit event
    this.eventEmitter.emit('booking.created', {
      bookingId: savedBooking.id,
      companyId: savedBooking.companyId,
      cabId: savedBooking.cabId,
      driverId: savedBooking.driverId,
      startDate: savedBooking.startDate,
      endDate: savedBooking.endDate,
    });

    return this.findOne(savedBooking.id, currentUser);
  }

  async findAll(filterDto: FilterBookingDto, currentUser: User) {
    const {
      status,
      cabId,
      driverId,
      search,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.cab', 'cab')
      .leftJoinAndSelect('booking.driver', 'driver')
      .where('booking.companyId = :companyId', { companyId: currentUser.companyId });

    // Apply filters
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (cabId) {
      queryBuilder.andWhere('booking.cabId = :cabId', { cabId });
    }

    if (driverId) {
      queryBuilder.andWhere('booking.driverId = :driverId', { driverId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(booking.clientName ILIKE :search OR booking.clientEmail ILIKE :search OR booking.clientPhone ILIKE :search OR booking.clientContactPerson ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDateFrom) {
      queryBuilder.andWhere('booking.startDate >= :startDateFrom', { startDateFrom });
    }

    if (startDateTo) {
      queryBuilder.andWhere('booking.startDate <= :startDateTo', { startDateTo });
    }

    if (endDateFrom) {
      queryBuilder.andWhere('booking.endDate >= :endDateFrom', { endDateFrom });
    }

    if (endDateTo) {
      queryBuilder.andWhere('booking.endDate <= :endDateTo', { endDateTo });
    }

    // Sorting
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'startDate',
      'endDate',
      'totalAmount',
      'status',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`booking.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [bookings, total] = await queryBuilder.getManyAndCount();

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, companyId: currentUser.companyId },
      relations: ['cab', 'driver'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, currentUser: User): Promise<Booking> {
    const booking = await this.findOne(id, currentUser);

    // If dates are being updated, validate and check conflicts
    if (updateBookingDto.startDate || updateBookingDto.endDate) {
      const newStartDate = updateBookingDto.startDate || booking.startDate;
      const newEndDate = updateBookingDto.endDate || booking.endDate;

      const start = new Date(newStartDate);
      const end = new Date(newEndDate);

      if (start >= end) {
        throw new BadRequestException('End date must be after start date');
      }

      // Check for conflicts (excluding current booking)
      await this.checkBookingConflicts(
        updateBookingDto.cabId || booking.cabId,
        newStartDate.toString(),
        newEndDate.toString(),
        currentUser.companyId,
        id,
      );
    }

    // If driver is being updated, validate
    if (updateBookingDto.driverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: updateBookingDto.driverId, companyId: currentUser.companyId, isActive: true },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found or inactive');
      }
    }

    // Update booking
    Object.assign(booking, updateBookingDto);
    const updatedBooking = await this.bookingRepository.save(booking);

    // Emit event
    this.eventEmitter.emit('booking.updated', {
      bookingId: updatedBooking.id,
      companyId: updatedBooking.companyId,
      changes: updateBookingDto,
    });

    return this.findOne(updatedBooking.id, currentUser);
  }

  async updateStatus(id: string, status: BookingStatus, currentUser: User): Promise<Booking> {
    const booking = await this.findOne(id, currentUser);
    const oldStatus = booking.status;

    booking.status = status;
    const updatedBooking = await this.bookingRepository.save(booking);

    // Update cab status based on booking status
    const cab = await this.cabRepository.findOne({ where: { id: booking.cabId } });
    if (cab) {
      if (status === BookingStatus.ACTIVE) {
        cab.status = CabStatus.RENTED;
      } else if (status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED) {
        // Only set to AVAILABLE if no other active bookings exist
        const activeBookings = await this.bookingRepository.count({
          where: {
            cabId: cab.id,
            status: BookingStatus.ACTIVE,
          },
        });
        if (activeBookings === 0) {
          cab.status = CabStatus.AVAILABLE;
        }
      }
      await this.cabRepository.save(cab);
    }

    // Emit event
    this.eventEmitter.emit('booking.status.changed', {
      bookingId: updatedBooking.id,
      companyId: updatedBooking.companyId,
      oldStatus,
      newStatus: status,
    });

    return this.findOne(updatedBooking.id, currentUser);
  }

  async assignDriver(id: string, driverId: string, currentUser: User): Promise<Booking> {
    const booking = await this.findOne(id, currentUser);

    // Validate driver
    const driver = await this.driverRepository.findOne({
      where: { id: driverId, companyId: currentUser.companyId, isActive: true },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found or inactive');
    }

    // Check if driver is available
    await this.checkDriverConflicts(
      driverId,
      booking.startDate.toString(),
      booking.endDate.toString(),
      currentUser.companyId,
      id,
    );

    booking.driverId = driverId;
    await this.bookingRepository.save(booking);

    // Emit event
    this.eventEmitter.emit('booking.driver.assigned', {
      bookingId: booking.id,
      companyId: booking.companyId,
      driverId,
    });

    return this.findOne(booking.id, currentUser);
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const booking = await this.findOne(id, currentUser);

    // Only allow deletion of PENDING or CANCELLED bookings
    if (booking.status === BookingStatus.ACTIVE || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot delete active or completed bookings. Please cancel first.',
      );
    }

    await this.bookingRepository.remove(booking);

    // Emit event
    this.eventEmitter.emit('booking.deleted', {
      bookingId: id,
      companyId: currentUser.companyId,
    });

    return { message: 'Booking deleted successfully' };
  }

  async getStatistics(currentUser: User) {
    const totalBookings = await this.bookingRepository.count({
      where: { companyId: currentUser.companyId },
    });

    const pendingBookings = await this.bookingRepository.count({
      where: { companyId: currentUser.companyId, status: BookingStatus.PENDING },
    });

    const activeBookings = await this.bookingRepository.count({
      where: { companyId: currentUser.companyId, status: BookingStatus.ACTIVE },
    });

    const completedBookings = await this.bookingRepository.count({
      where: { companyId: currentUser.companyId, status: BookingStatus.COMPLETED },
    });

    const cancelledBookings = await this.bookingRepository.count({
      where: { companyId: currentUser.companyId, status: BookingStatus.CANCELLED },
    });

    // Calculate total revenue from completed bookings
    const revenueResult = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'total')
      .where('booking.companyId = :companyId', { companyId: currentUser.companyId })
      .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getRawOne();

    return {
      total: totalBookings,
      pending: pendingBookings,
      active: activeBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      totalRevenue: parseFloat(revenueResult?.total || '0'),
    };
  }

  private async checkBookingConflicts(
    cabId: string,
    startDate: string,
    endDate: string,
    companyId: string,
    excludeBookingId?: string,
  ): Promise<void> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.cabId = :cabId', { cabId })
      .andWhere('booking.companyId = :companyId', { companyId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.ACTIVE],
      })
      .andWhere(
        '(booking.startDate < :endDate AND booking.endDate > :startDate)',
        { startDate, endDate },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await queryBuilder.getOne();

    if (conflictingBooking) {
      throw new ConflictException(
        `Cab is already booked for the selected period (${new Date(conflictingBooking.startDate).toLocaleDateString()} - ${new Date(conflictingBooking.endDate).toLocaleDateString()})`,
      );
    }
  }

  private async checkDriverConflicts(
    driverId: string,
    startDate: string,
    endDate: string,
    companyId: string,
    excludeBookingId?: string,
  ): Promise<void> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.driverId = :driverId', { driverId })
      .andWhere('booking.companyId = :companyId', { companyId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.ACTIVE],
      })
      .andWhere(
        '(booking.startDate < :endDate AND booking.endDate > :startDate)',
        { startDate, endDate },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await queryBuilder.getOne();

    if (conflictingBooking) {
      throw new ConflictException(
        `Driver is already assigned to another booking for the selected period`,
      );
    }
  }
}

