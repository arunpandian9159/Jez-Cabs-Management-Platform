import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { NotificationType, NotificationPriority } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID (optional)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ 
    enum: NotificationType, 
    example: NotificationType.EMAIL, 
    description: 'Type of notification' 
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ 
    enum: NotificationPriority, 
    example: NotificationPriority.MEDIUM, 
    description: 'Priority level',
    default: NotificationPriority.MEDIUM
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiProperty({ example: 'Booking Confirmation', description: 'Notification subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Your booking has been confirmed for vehicle ABC-1234', description: 'Notification message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'user@example.com', description: 'Recipient (email, phone, or user ID)' })
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @ApiPropertyOptional({ 
    example: { bookingId: '123', cabId: '456' }, 
    description: 'Additional metadata' 
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

