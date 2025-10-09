import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TelematicsService } from '../services';
import { CreateTelematicsLogDto, FilterTelematicsDto } from '../dto';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('Telematics')
@Controller('telematics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class TelematicsController {
  constructor(private readonly telematicsService: TelematicsService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Log GPS/telematics data' })
  @ApiResponse({ status: 201, description: 'Telematics log created successfully' })
  @ApiResponse({ status: 404, description: 'Cab not found' })
  async create(@Body() createDto: CreateTelematicsLogDto, @CurrentUser() currentUser: User) {
    return this.telematicsService.create(createDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all telematics logs with filtering' })
  @ApiResponse({ status: 200, description: 'Telematics logs retrieved successfully' })
  async findAll(@Query() filterDto: FilterTelematicsDto, @CurrentUser() currentUser: User) {
    return this.telematicsService.findAll(filterDto, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific telematics log by ID' })
  @ApiParam({ name: 'id', description: 'Telematics log ID' })
  @ApiResponse({ status: 200, description: 'Telematics log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Telematics log not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.telematicsService.findOne(id, currentUser);
  }

  @Get('cab/:cabId/latest')
  @ApiOperation({ summary: 'Get latest GPS location for a cab' })
  @ApiParam({ name: 'cabId', description: 'Cab ID' })
  @ApiResponse({ status: 200, description: 'Latest location retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cab not found or no location data available' })
  async getLatestLocation(@Param('cabId') cabId: string, @CurrentUser() currentUser: User) {
    return this.telematicsService.getLatestLocation(cabId, currentUser);
  }

  @Get('cab/:cabId/route')
  @ApiOperation({ summary: 'Get route/track for a cab within a date range' })
  @ApiParam({ name: 'cabId', description: 'Cab ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (ISO 8601)', example: '2025-10-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', description: 'End date (ISO 8601)', example: '2025-10-09T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Route retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cab not found' })
  async getRoute(
    @Param('cabId') cabId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.telematicsService.getRoute(
      cabId,
      new Date(startDate),
      new Date(endDate),
      currentUser,
    );
  }

  @Get('cab/:cabId/statistics')
  @ApiOperation({ summary: 'Get telematics statistics for a cab within a date range' })
  @ApiParam({ name: 'cabId', description: 'Cab ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (ISO 8601)', example: '2025-10-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', description: 'End date (ISO 8601)', example: '2025-10-09T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cab not found' })
  async getStatistics(
    @Param('cabId') cabId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.telematicsService.getStatistics(
      cabId,
      new Date(startDate),
      new Date(endDate),
      currentUser,
    );
  }

  @Post('cab/:cabId/mock-data')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Generate mock GPS data for testing (Owner and Manager only)' })
  @ApiParam({ name: 'cabId', description: 'Cab ID' })
  @ApiQuery({ name: 'count', description: 'Number of mock data points to generate', example: 100 })
  @ApiResponse({ status: 201, description: 'Mock data generated successfully' })
  @ApiResponse({ status: 404, description: 'Cab not found' })
  async generateMockData(
    @Param('cabId') cabId: string,
    @Query('count') count: string,
    @CurrentUser() currentUser: User,
  ) {
    const dataCount = parseInt(count, 10) || 100;
    return this.telematicsService.generateMockData(cabId, dataCount, currentUser);
  }
}

