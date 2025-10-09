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
  ApiQuery,
} from '@nestjs/swagger';
import { DriverService } from '../services';
import { CreateDriverDto, UpdateDriverDto, FilterDriverDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums';

@ApiTags('Drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add a new driver (Owner and Manager only)' })
  @ApiResponse({ status: 201, description: 'Driver created successfully' })
  @ApiResponse({ status: 409, description: 'Driver with this license number or email already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createDriverDto: CreateDriverDto, @CurrentUser() currentUser: User) {
    return this.driverService.create(createDriverDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Drivers retrieved successfully' })
  async findAll(@Query() filterDto: FilterDriverDto, @CurrentUser() currentUser: User) {
    return this.driverService.findAll(filterDto, currentUser);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get driver statistics and metrics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.driverService.getStatistics(currentUser);
  }

  @Get('expiring-licenses')
  @ApiOperation({ summary: 'Get drivers with expiring licenses' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to check (default: 30)' })
  @ApiResponse({ status: 200, description: 'Expiring licenses retrieved successfully' })
  async getExpiringLicenses(
    @Query('days') days: number = 30,
    @CurrentUser() currentUser: User,
  ) {
    return this.driverService.getExpiringLicenses(currentUser, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.driverService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update driver details (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Driver updated successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 409, description: 'License number or email conflict' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.driverService.update(id, updateDriverDto, currentUser);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Deactivate a driver (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Driver deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deactivate(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.driverService.deactivate(id, currentUser);
  }

  @Patch(':id/activate')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Activate a driver (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Driver activated successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async activate(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.driverService.activate(id, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a driver (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Driver deleted successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.driverService.remove(id, currentUser);
  }
}

