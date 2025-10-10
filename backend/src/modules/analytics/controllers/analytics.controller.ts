import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from '../services';
import { AnalyticsQueryDto } from '../dto';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get dashboard KPIs and metrics (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Dashboard KPIs retrieved successfully' })
  async getDashboardKPIs(@Query() queryDto: AnalyticsQueryDto, @CurrentUser() currentUser: User) {
    return this.analyticsService.getDashboardKPIs(queryDto, currentUser);
  }

  @Get('fleet-utilization')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get fleet utilization metrics (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Fleet utilization metrics retrieved successfully' })
  async getFleetUtilization(@Query() queryDto: AnalyticsQueryDto, @CurrentUser() currentUser: User) {
    return this.analyticsService.getFleetUtilization(queryDto, currentUser);
  }

  @Get('revenue')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get revenue analytics (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully' })
  async getRevenueAnalytics(@Query() queryDto: AnalyticsQueryDto, @CurrentUser() currentUser: User) {
    return this.analyticsService.getRevenueAnalytics(queryDto, currentUser);
  }

  @Get('driver-performance')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get driver performance metrics (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Driver performance metrics retrieved successfully' })
  async getDriverPerformance(@Query() queryDto: AnalyticsQueryDto, @CurrentUser() currentUser: User) {
    return this.analyticsService.getDriverPerformance(queryDto, currentUser);
  }

  @Get('revenue-over-time')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get revenue over time analytics (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Revenue over time analytics retrieved successfully' })
  async getRevenueOverTime(@Query() queryDto: AnalyticsQueryDto, @CurrentUser() currentUser: User) {
    return this.analyticsService.getRevenueOverTime(queryDto, currentUser);
  }
}
