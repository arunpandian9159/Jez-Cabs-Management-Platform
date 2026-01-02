import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { NotificationService } from '../services';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';

class RegisterDeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsEnum(['web', 'android', 'ios'])
  platform: 'web' | 'android' | 'ios';

  @IsOptional()
  @IsString()
  deviceName?: string;
}

interface AuthRequest extends Request {
  user: {
    sub: string;
    id: string;
    email: string;
    role: string;
  };
}

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved' })
  async findAll(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    return this.notificationService.findByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved' })
  async getUnreadCount(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { unreadCount: count };
  }

  @Post('device-token')
  @ApiOperation({ summary: 'Register a device token for push notifications' })
  @ApiResponse({ status: 201, description: 'Device token registered' })
  async registerDeviceToken(
    @Request() req: AuthRequest,
    @Body() dto: RegisterDeviceTokenDto,
  ) {
    const userId = req.user.sub || req.user.id;
    const token = await this.notificationService.registerDeviceToken(
      userId,
      dto.token,
      dto.platform,
      dto.deviceName,
    );
    return {
      success: true,
      message: 'Device token registered successfully',
      data: token,
    };
  }

  @Delete('device-token/:token')
  @ApiOperation({ summary: 'Remove a device token' })
  @ApiResponse({ status: 200, description: 'Device token removed' })
  async removeDeviceToken(
    @Request() req: AuthRequest,
    @Param('token') token: string,
  ) {
    const userId = req.user.sub || req.user.id;
    await this.notificationService.removeDeviceToken(userId, token);
    return {
      success: true,
      message: 'Device token removed',
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    return this.notificationService.markAllAsRead(userId);
  }
}
