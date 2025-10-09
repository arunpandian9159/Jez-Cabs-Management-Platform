import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../../../common/enums';

export class FilterInvoiceDto {
  @ApiPropertyOptional({
    enum: InvoiceStatus,
    description: 'Filter by invoice status',
    example: InvoiceStatus.SENT,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({ description: 'Filter by booking ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;
}

