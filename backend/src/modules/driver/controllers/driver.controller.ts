import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DriverService } from '../services';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, DriverStatus } from '../../../common/enums';

@ApiTags('Drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Get('profile')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get current driver profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() currentUser: User) {
    return this.driverService.getProfile(currentUser.id);
  }

  @Patch('profile')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update driver profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@CurrentUser() currentUser: User, @Body() data: any) {
    return this.driverService.updateProfile(currentUser.id, data);
  }

  @Patch('status')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update driver availability status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@CurrentUser() currentUser: User, @Body('status') status: DriverStatus) {
    return this.driverService.updateStatus(currentUser.id, status);
  }

  @Patch('location')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update driver location' })
  async updateLocation(
    @CurrentUser() currentUser: User,
    @Body() data: { lat: number; lng: number },
  ) {
    return this.driverService.updateLocation(currentUser.id, data.lat, data.lng);
  }

  @Get('earnings')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get driver earnings' })
  async getEarnings(@CurrentUser() currentUser: User) {
    return this.driverService.getEarnings(currentUser.id);
  }

  @Patch('go-online')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Go online and start accepting trips' })
  async goOnline(@CurrentUser() currentUser: User) {
    return this.driverService.goOnline(currentUser.id);
  }

  @Patch('go-offline')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Go offline and stop accepting trips' })
  async goOffline(@CurrentUser() currentUser: User) {
    return this.driverService.goOffline(currentUser.id);
  }
}
