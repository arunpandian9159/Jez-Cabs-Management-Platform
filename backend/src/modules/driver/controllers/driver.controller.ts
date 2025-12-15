import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { DriverService } from '../services';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, DriverStatus } from '../../../common/enums';
import { DriverOnboardingDto } from '../dto';

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
    // Try to get profile, but don't throw if not found
    const profile = await this.driverService.getProfileOrNull(currentUser.id);
    if (!profile) {
      // Return a minimal response indicating onboarding is needed
      return {
        onboarding_required: true,
        user_id: currentUser.id,
      };
    }
    return profile;
  }

  @Get('verification-status')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get driver verification status' })
  @ApiResponse({ status: 200, description: 'Verification status retrieved successfully' })
  async getVerificationStatus(@CurrentUser() currentUser: User) {
    return this.driverService.getVerificationStatus(currentUser.id);
  }

  @Post('onboarding')
  @Roles(UserRole.DRIVER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'license_front', maxCount: 1 },
      { name: 'license_back', maxCount: 1 },
      { name: 'aadhaar_front', maxCount: 1 },
      { name: 'aadhaar_back', maxCount: 1 },
      { name: 'police_clearance', maxCount: 1 },
      { name: 'vehicle_rc', maxCount: 1 },
      { name: 'vehicle_insurance', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Complete driver onboarding with documents' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Onboarding completed successfully' })
  async completeOnboarding(
    @CurrentUser() currentUser: User,
    @Body() data: DriverOnboardingDto,
    @UploadedFiles()
    files: {
      license_front?: { originalname: string; buffer: Buffer; mimetype: string }[];
      license_back?: { originalname: string; buffer: Buffer; mimetype: string }[];
      aadhaar_front?: { originalname: string; buffer: Buffer; mimetype: string }[];
      aadhaar_back?: { originalname: string; buffer: Buffer; mimetype: string }[];
      police_clearance?: { originalname: string; buffer: Buffer; mimetype: string }[];
      vehicle_rc?: { originalname: string; buffer: Buffer; mimetype: string }[];
      vehicle_insurance?: { originalname: string; buffer: Buffer; mimetype: string }[];
    },
  ) {
    // In production, you would upload files to cloud storage (S3, GCS, etc.)
    // and get back URLs. For now, we'll generate placeholder URLs.
    const baseUrl = '/uploads/documents';
    const documentUrls = {
      license_front: files?.license_front?.[0]
        ? `${baseUrl}/${currentUser.id}/license_front_${Date.now()}.${files.license_front[0].originalname.split('.').pop()}`
        : undefined,
      license_back: files?.license_back?.[0]
        ? `${baseUrl}/${currentUser.id}/license_back_${Date.now()}.${files.license_back[0].originalname.split('.').pop()}`
        : undefined,
      aadhaar_front: files?.aadhaar_front?.[0]
        ? `${baseUrl}/${currentUser.id}/aadhaar_front_${Date.now()}.${files.aadhaar_front[0].originalname.split('.').pop()}`
        : undefined,
      aadhaar_back: files?.aadhaar_back?.[0]
        ? `${baseUrl}/${currentUser.id}/aadhaar_back_${Date.now()}.${files.aadhaar_back[0].originalname.split('.').pop()}`
        : undefined,
      police_clearance: files?.police_clearance?.[0]
        ? `${baseUrl}/${currentUser.id}/police_clearance_${Date.now()}.${files.police_clearance[0].originalname.split('.').pop()}`
        : undefined,
      vehicle_rc: files?.vehicle_rc?.[0]
        ? `${baseUrl}/${currentUser.id}/vehicle_rc_${Date.now()}.${files.vehicle_rc[0].originalname.split('.').pop()}`
        : undefined,
      vehicle_insurance: files?.vehicle_insurance?.[0]
        ? `${baseUrl}/${currentUser.id}/vehicle_insurance_${Date.now()}.${files.vehicle_insurance[0].originalname.split('.').pop()}`
        : undefined,
    };

    return this.driverService.completeOnboarding(
      currentUser.id,
      data,
      documentUrls,
    );
  }

  @Get('stats')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get driver dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@CurrentUser() currentUser: User) {
    return this.driverService.getDashboardStats(currentUser.id);
  }

  @Get('trip-requests')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get pending trip requests for driver' })
  @ApiResponse({
    status: 200,
    description: 'Trip requests retrieved successfully',
  })
  async getTripRequests(@CurrentUser() currentUser: User) {
    return this.driverService.getTripRequests(currentUser.id);
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
  async updateStatus(
    @CurrentUser() currentUser: User,
    @Body('status') status: DriverStatus,
  ) {
    return this.driverService.updateStatus(currentUser.id, status);
  }

  @Patch('location')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update driver location' })
  async updateLocation(
    @CurrentUser() currentUser: User,
    @Body() data: { lat: number; lng: number },
  ) {
    return this.driverService.updateLocation(
      currentUser.id,
      data.lat,
      data.lng,
    );
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
