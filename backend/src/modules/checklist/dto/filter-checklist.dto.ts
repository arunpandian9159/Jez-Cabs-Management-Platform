import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterChecklistDto {
  @ApiPropertyOptional({ description: 'Filter by booking ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiPropertyOptional({ description: 'Filter by cab ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  cabId?: string;

  @ApiPropertyOptional({ description: 'Filter by template name', example: 'Pre-Rental Inspection' })
  @IsOptional()
  @IsString()
  templateName?: string;

  @ApiPropertyOptional({ description: 'Filter by completion status', example: true })
  @IsOptional()
  @Type(() => Boolean)
  isComplete?: boolean;

  @ApiPropertyOptional({ description: 'Filter by approval status', example: true })
  @IsOptional()
  @Type(() => Boolean)
  isApproved?: boolean;

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

