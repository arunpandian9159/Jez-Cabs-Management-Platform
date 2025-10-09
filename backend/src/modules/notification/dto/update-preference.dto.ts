import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferenceDto {
  @ApiPropertyOptional({ example: true, description: 'Enable/disable email notifications' })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Enable/disable SMS notifications' })
  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable push notifications' })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable in-app notifications' })
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable booking notifications' })
  @IsBoolean()
  @IsOptional()
  bookingNotifications?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable invoice notifications' })
  @IsBoolean()
  @IsOptional()
  invoiceNotifications?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable maintenance notifications' })
  @IsBoolean()
  @IsOptional()
  maintenanceNotifications?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable expiry alerts' })
  @IsBoolean()
  @IsOptional()
  expiryAlerts?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable/disable driver notifications' })
  @IsBoolean()
  @IsOptional()
  driverNotifications?: boolean;
}

