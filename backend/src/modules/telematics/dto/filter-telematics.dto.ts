import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TelematicsEventType } from './create-telematics-log.dto';

export class FilterTelematicsDto {
  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Filter by cab ID' })
  @IsOptional()
  @IsString()
  cabId?: string;

  @ApiPropertyOptional({ example: 'GPS-12345', description: 'Filter by GPS device ID' })
  @IsOptional()
  @IsString()
  gpsDeviceId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Filter by booking ID' })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiPropertyOptional({ 
    enum: TelematicsEventType, 
    example: TelematicsEventType.SPEEDING, 
    description: 'Filter by event type' 
  })
  @IsOptional()
  @IsEnum(TelematicsEventType)
  eventType?: TelematicsEventType;

  @ApiPropertyOptional({ example: '2025-10-01T00:00:00Z', description: 'Filter logs from this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ example: '2025-10-31T23:59:59Z', description: 'Filter logs until this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 50, description: 'Number of items per page', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ example: 'timestamp', description: 'Sort by field', default: 'timestamp' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'timestamp';

  @ApiPropertyOptional({ example: 'DESC', description: 'Sort order', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

