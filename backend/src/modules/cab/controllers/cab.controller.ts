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
import { CabService } from '../services';
import { CreateCabDto, UpdateCabDto, FilterCabDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, CabStatus } from '../../../common/enums';

@ApiTags('Cabs')
@Controller('cabs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CabController {
  constructor(private readonly cabService: CabService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add a new vehicle to the fleet (Owner and Manager only)' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  @ApiResponse({ status: 409, description: 'Vehicle with this registration number already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createCabDto: CreateCabDto, @CurrentUser() currentUser: User) {
    return this.cabService.create(createCabDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully' })
  async findAll(@Query() filterDto: FilterCabDto, @CurrentUser() currentUser: User) {
    return this.cabService.findAll(filterDto, currentUser);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get fleet statistics and metrics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.cabService.getStatistics(currentUser);
  }

  @Get('expiring-documents')
  @ApiOperation({ summary: 'Get vehicles with expiring documents' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to check (default: 30)' })
  @ApiResponse({ status: 200, description: 'Expiring documents retrieved successfully' })
  async getExpiringDocuments(
    @Query('days') days: number = 30,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.getExpiringDocuments(currentUser, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.cabService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update vehicle details (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 409, description: 'Registration number conflict' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateCabDto: UpdateCabDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.update(id, updateCabDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update vehicle status' })
  @ApiResponse({ status: 200, description: 'Vehicle status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CabStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vehicle (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete a rented vehicle' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.cabService.remove(id, currentUser);
  }
}

