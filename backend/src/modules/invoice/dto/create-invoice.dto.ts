import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { InvoiceStatus } from '../../../common/enums';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'uuid', description: 'Booking ID' })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: 1000.00, description: 'Invoice amount' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 100.00, description: 'Tax amount' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  taxAmount?: number;

  @ApiPropertyOptional({ example: 50.00, description: 'Discount amount' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discountAmount?: number;

  @ApiPropertyOptional({
    enum: InvoiceStatus,
    example: InvoiceStatus.DRAFT,
    description: 'Invoice status',
    default: InvoiceStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({ example: 'Payment terms: Net 30', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

