import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CabStatus, CabType } from '../../../common/enums';

export class FilterCabDto {
  @ApiPropertyOptional({
    enum: CabStatus,
    description: 'Filter by vehicle status',
    example: CabStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(CabStatus)
  status?: CabStatus;

  @ApiPropertyOptional({
    enum: CabType,
    description: 'Filter by cab type',
  })
  @IsOptional()
  @IsEnum(CabType)
  cab_type?: CabType;

  @ApiPropertyOptional({
    description: 'Filter by vehicle make',
    example: 'Toyota',
  })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({
    description: 'Filter by vehicle model',
    example: 'Camry',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Search by registration number',
    example: 'ABC',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 50,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'created_at' })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsOptional()
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
