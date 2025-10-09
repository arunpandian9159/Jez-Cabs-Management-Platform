import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingService } from '../services';
import { CreateBookingDto, UpdateBookingDto, FilterBookingDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, BookingStatus } from '../../../common/enums';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid dates or cab not available' })
  @ApiResponse({ status: 404, description: 'Cab or driver not found' })
  @ApiResponse({ status: 409, description: 'Booking conflict exists' })
  async create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() currentUser: User) {
    return this.bookingService.create(createBookingDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async findAll(@Query() filterDto: FilterBookingDto, @CurrentUser() currentUser: User) {
    return this.bookingService.findAll(filterDto, currentUser);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get booking statistics and metrics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.bookingService.getStatistics(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.bookingService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update booking details (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 409, description: 'Booking conflict exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.bookingService.update(id, updateBookingDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.bookingService.updateStatus(id, status, currentUser);
  }

  @Patch(':id/assign-driver')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Assign a driver to a booking' })
  @ApiResponse({ status: 200, description: 'Driver assigned successfully' })
  @ApiResponse({ status: 404, description: 'Booking or driver not found' })
  @ApiResponse({ status: 409, description: 'Driver conflict exists' })
  async assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.bookingService.assignDriver(id, driverId, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a booking (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete active or completed bookings' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.bookingService.remove(id, currentUser);
  }
}

