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
import { CabService } from '../services';
import { CreateCabDto, UpdateCabDto, FilterCabDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, CabStatus, CabType } from '../../../common/enums';

@ApiTags('Cabs')
@Controller('cabs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CabController {
  constructor(private readonly cabService: CabService) {}

  @Post()
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a new vehicle (Cab Owner only)' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  async create(
    @Body() createCabDto: CreateCabDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.create(createCabDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles with filtering' })
  @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully' })
  async findAll(
    @Query() filterDto: FilterCabDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.findAll(filterDto, currentUser);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available cabs for booking' })
  @ApiResponse({ status: 200, description: 'Available cabs retrieved' })
  async findAvailable(
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('type') cabType?: CabType,
  ) {
    return this.cabService.findAvailable(lat, lng, cabType);
  }

  @Get('statistics')
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get fleet statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.cabService.getStatistics(currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findOne(@Param('id') id: string) {
    return this.cabService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateCabDto: UpdateCabDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.cabService.update(id, updateCabDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Update vehicle status' })
  @ApiResponse({ status: 200, description: 'Vehicle status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CabStatus,
  ) {
    return this.cabService.updateStatus(id, status);
  }

  @Patch(':id/assign-driver')
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign driver to vehicle' })
  async assignDriver(
    @Param('id') id: string,
    @Body('driver_id') driverId: string,
  ) {
    return this.cabService.assignDriver(id, driverId);
  }

  @Delete(':id')
  @Roles(UserRole.CAB_OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.cabService.remove(id, currentUser);
  }
}
