import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../../common/enums';

export class FilterBookingDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    description: 'Filter by booking status',
    example: BookingStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Filter by cab ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  cabId?: string;

  @ApiPropertyOptional({ description: 'Filter by driver ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({ description: 'Search by client name, email, or phone', example: 'Acme' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by start date (from)', example: '2025-10-01' })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by start date (to)', example: '2025-10-31' })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (from)', example: '2025-10-01' })
  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (to)', example: '2025-10-31' })
  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

