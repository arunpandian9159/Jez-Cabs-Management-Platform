import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from '../services';
import { CreateNotificationDto, UpdatePreferenceDto } from '../dto';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a notification (Owner and Manager only)' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body() createDto: CreateNotificationDto, @CurrentUser() currentUser: User) {
    return this.notificationService.create(createDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async findAll(@Query('userId') userId: string, @CurrentUser() currentUser: User) {
    return this.notificationService.findAll(currentUser, userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread notifications' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@Query('userId') userId: string, @CurrentUser() currentUser: User) {
    const count = await this.notificationService.getUnreadCount(currentUser, userId);
    return { unreadCount: count };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences for current user' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferences(@CurrentUser() currentUser: User) {
    return this.notificationService.getPreferences(currentUser);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences for current user' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(@Body() updateDto: UpdatePreferenceDto, @CurrentUser() currentUser: User) {
    return this.notificationService.updatePreferences(updateDto, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.notificationService.findOne(id, currentUser);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.notificationService.markAsRead(id, currentUser);
  }
}

