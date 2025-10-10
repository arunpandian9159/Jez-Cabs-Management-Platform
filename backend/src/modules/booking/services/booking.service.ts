import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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
      where: { id: cabId, company_id: currentUser.company_id },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    // Check if cab is available (not in maintenance)
    if (cab.status === CabStatus.IN_MAINTENANCE) {
      throw new BadRequestException('Cab is currently in maintenance and cannot be booked');
    }

    // Check for booking conflicts
    await this.checkBookingConflicts(cabId, startDate, endDate, currentUser.company_id);

    // If driver is specified, validate driver
    let driver: Driver | null = null;
    if (driverId) {
      driver = await this.driverRepository.findOne({
        where: { id: driverId, company_id: currentUser.company_id, is_active: true },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found or inactive');
      }

      // Check if driver is available for this period
      await this.checkDriverConflicts(driverId, startDate, endDate, currentUser.company_id);
    }

    // Create booking
    const bookingEntityData = {
      ...bookingData,
      cab_id: cabId,
      driver_id: driverId || null,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      company_id: currentUser.company_id,
      status: createBookingDto.status || BookingStatus.PENDING,
      client_name: createBookingDto.clientName,
      client_email: createBookingDto.clientEmail,
      client_phone: createBookingDto.clientPhone,
      client_contact_person: createBookingDto.clientContactPerson,
      pickup_location: createBookingDto.pickupLocation,
      dropoff_location: createBookingDto.dropoffLocation,
      total_amount: createBookingDto.totalAmount,
      advance_amount: createBookingDto.advanceAmount,
    };

    const booking = this.bookingRepository.create(bookingEntityData);
    const savedBooking = await this.bookingRepository.save(booking);

    // Update cab status to RENTED if booking is active
    if (savedBooking.status === BookingStatus.ACTIVE) {
      cab.status = CabStatus.RENTED;
      await this.cabRepository.save(cab);
    }

    // Emit event
    this.eventEmitter.emit('booking.created', {
      bookingId: savedBooking.id,
      companyId: savedBooking.company_id,
      cabId: savedBooking.cab_id,
      driverId: savedBooking.driver_id,
      startDate: savedBooking.start_date,
      endDate: savedBooking.end_date,
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
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.cab', 'cab')
      .leftJoinAndSelect('booking.driver', 'driver')
      .where('booking.company_id = :companyId', { companyId: currentUser.company_id });

    // Apply filters
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (cabId) {
      queryBuilder.andWhere('booking.cab_id = :cabId', { cabId });
    }

    if (driverId) {
      queryBuilder.andWhere('booking.driver_id = :driverId', { driverId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(booking.client_name ILIKE :search OR booking.client_email ILIKE :search OR booking.client_phone ILIKE :search OR booking.client_contact_person ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDateFrom) {
      queryBuilder.andWhere('booking.start_date >= :startDateFrom', { startDateFrom });
    }

    if (startDateTo) {
      queryBuilder.andWhere('booking.start_date <= :startDateTo', { startDateTo });
    }

    if (endDateFrom) {
      queryBuilder.andWhere('booking.end_date >= :endDateFrom', { endDateFrom });
    }

    if (endDateTo) {
      queryBuilder.andWhere('booking.end_date <= :endDateTo', { endDateTo });
    }

    // Sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'start_date',
      'end_date',
      'total_amount',
      'status',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
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
      where: { id, company_id: currentUser.company_id },
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
      const newStartDate = updateBookingDto.startDate || booking.start_date;
      const newEndDate = updateBookingDto.endDate || booking.end_date;

      const start = new Date(newStartDate);
      const end = new Date(newEndDate);

      if (start >= end) {
        throw new BadRequestException('End date must be after start date');
      }

      // Check for conflicts (excluding current booking)
      await this.checkBookingConflicts(
        updateBookingDto.cabId || booking.cab_id,
        newStartDate.toString(),
        newEndDate.toString(),
        currentUser.company_id,
        id,
      );
    }

    // If driver is being updated, validate
    if (updateBookingDto.driverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: updateBookingDto.driverId, company_id: currentUser.company_id, is_active: true },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found or inactive');
      }
    }

    // Map DTO to entity fields
    const {
      cabId,
      driverId,
      startDate,
      endDate,
      clientName,
      clientEmail,
      clientPhone,
      clientContactPerson,
      pickupLocation,
      dropoffLocation,
      totalAmount,
      advanceAmount,
      ...rest
    } = updateBookingDto;

    const updateData: Partial<Booking> = { ...rest };
    if (cabId) updateData.cab_id = cabId;
    if (driverId) updateData.driver_id = driverId;
    if (startDate) updateData.start_date = new Date(startDate);
    if (endDate) updateData.end_date = new Date(endDate);
    if (clientName) updateData.client_name = clientName;
    if (clientEmail) updateData.client_email = clientEmail;
    if (clientPhone) updateData.client_phone = clientPhone;
    if (clientContactPerson) updateData.client_contact_person = clientContactPerson;
    if (pickupLocation) updateData.pickup_location = pickupLocation;
    if (dropoffLocation) updateData.dropoff_location = dropoffLocation;
    if (totalAmount) updateData.total_amount = totalAmount;
    if (advanceAmount) updateData.advance_amount = advanceAmount;

    // Update booking
    Object.assign(booking, updateData);
    const updatedBooking = await this.bookingRepository.save(booking);

    // Emit event
    this.eventEmitter.emit('booking.updated', {
      bookingId: updatedBooking.id,
      companyId: updatedBooking.company_id,
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
    const cab = await this.cabRepository.findOne({ where: { id: booking.cab_id } });
    if (cab) {
      if (status === BookingStatus.ACTIVE) {
        cab.status = CabStatus.RENTED;
      } else if (status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED) {
        // Only set to AVAILABLE if no other active bookings exist
        const activeBookings = await this.bookingRepository.count({
          where: {
            cab_id: cab.id,
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
      companyId: updatedBooking.company_id,
      oldStatus,
      newStatus: status,
    });

    return this.findOne(updatedBooking.id, currentUser);
  }

  async assignDriver(id: string, driverId: string, currentUser: User): Promise<Booking> {
    const booking = await this.findOne(id, currentUser);

    // Validate driver
    const driver = await this.driverRepository.findOne({
      where: { id: driverId, company_id: currentUser.company_id, is_active: true },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found or inactive');
    }

    // Check if driver is available
    await this.checkDriverConflicts(
      driverId,
      booking.start_date.toString(),
      booking.end_date.toString(),
      currentUser.company_id,
      id,
    );

    booking.driver_id = driverId;
    await this.bookingRepository.save(booking);

    // Emit event
    this.eventEmitter.emit('booking.driver.assigned', {
      bookingId: booking.id,
      companyId: booking.company_id,
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
      companyId: currentUser.company_id,
    });

    return { message: 'Booking deleted successfully' };
  }

  async getStatistics(currentUser: User) {
    const totalBookings = await this.bookingRepository.count({
      where: { company_id: currentUser.company_id },
    });

    const pendingBookings = await this.bookingRepository.count({
      where: { company_id: currentUser.company_id, status: BookingStatus.PENDING },
    });

    const activeBookings = await this.bookingRepository.count({
      where: { company_id: currentUser.company_id, status: BookingStatus.ACTIVE },
    });

    const completedBookings = await this.bookingRepository.count({
      where: { company_id: currentUser.company_id, status: BookingStatus.COMPLETED },
    });

    const cancelledBookings = await this.bookingRepository.count({
      where: { company_id: currentUser.company_id, status: BookingStatus.CANCELLED },
    });

    // Calculate total revenue from completed bookings
    const revenueResult = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.total_amount)', 'total')
      .where('booking.company_id = :companyId', { companyId: currentUser.company_id })
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
      .where('booking.cab_id = :cabId', { cabId })
      .andWhere('booking.company_id = :companyId', { companyId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.ACTIVE],
      })
      .andWhere(
        '(booking.start_date < :endDate AND booking.end_date > :startDate)',
        { startDate, endDate },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await queryBuilder.getOne();

    if (conflictingBooking) {
      throw new ConflictException(
        `Cab is already booked for the selected period (${new Date(conflictingBooking.start_date).toLocaleDateString()} - ${new Date(conflictingBooking.end_date).toLocaleDateString()})`,
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
      .where('booking.driver_id = :driverId', { driverId })
      .andWhere('booking.company_id = :companyId', { companyId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.ACTIVE],
      })
      .andWhere(
        '(booking.start_date < :endDate AND booking.end_date > :startDate)',
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

