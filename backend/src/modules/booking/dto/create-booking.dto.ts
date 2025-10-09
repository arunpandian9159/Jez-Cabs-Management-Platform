import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsEmail,
  IsOptional,
  MaxLength,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { BookingStatus } from '../../../common/enums';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid', description: 'Cab ID to be booked' })
  @IsNotEmpty()
  @IsUUID()
  cabId: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Driver ID (optional, can be assigned later)' })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiProperty({ example: 'Acme Corporation', description: 'Client company name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  clientName: string;

  @ApiProperty({ example: 'John Smith', description: 'Client contact person name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  clientContactPerson: string;

  @ApiProperty({ example: 'john.smith@acme.com', description: 'Client email address' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  clientEmail: string;

  @ApiProperty({ example: '+1234567890', description: 'Client contact number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  clientPhone: string;

  @ApiProperty({ example: '2025-10-15T09:00:00Z', description: 'Booking start date and time (ISO 8601)' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-10-20T18:00:00Z', description: 'Booking end date and time (ISO 8601)' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: '123 Pickup St, City', description: 'Pickup location' })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional({ example: '456 Dropoff Ave, City', description: 'Drop-off location' })
  @IsOptional()
  @IsString()
  dropoffLocation?: string;

  @ApiProperty({ example: 750.00, description: 'Total booking amount' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiPropertyOptional({ example: 75.00, description: 'Advance payment amount' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  advanceAmount?: number;

  @ApiPropertyOptional({ example: 'Corporate event transportation', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    description: 'Initial booking status',
    default: BookingStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

