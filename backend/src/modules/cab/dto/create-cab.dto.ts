import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { CabStatus } from '../../../common/enums';

export class CreateCabDto {
  @ApiProperty({ example: 'Toyota', description: 'Vehicle manufacturer' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  make: string;

  @ApiProperty({ example: 'Camry', description: 'Vehicle model' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  model: string;

  @ApiProperty({ example: 2023, description: 'Manufacturing year' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ example: 'ABC-1234', description: 'Vehicle registration number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  registration_number: string;

  @ApiPropertyOptional({ example: '1HGBH41JXMN109186', description: 'Vehicle Identification Number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vin?: string;

  @ApiPropertyOptional({
    enum: CabStatus,
    example: CabStatus.AVAILABLE,
    description: 'Current vehicle status',
    default: CabStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(CabStatus)
  status?: CabStatus;

  @ApiPropertyOptional({ example: 'White', description: 'Vehicle color' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 5, description: 'Number of seats' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  seating_capacity?: number;

  @ApiPropertyOptional({ example: 'Petrol', description: 'Fuel type (Petrol, Diesel, Electric, Hybrid)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fuel_type?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Insurance expiry date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  insurance_expiry?: string;

  @ApiPropertyOptional({ example: 'ABC Insurance Co.', description: 'Insurance provider name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  insurance_provider?: string;

  @ApiPropertyOptional({ example: 'POL-123456', description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  insurance_policy_number?: string;

  @ApiPropertyOptional({ example: '2026-06-30', description: 'Registration expiry date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  registration_expiry?: string;

  @ApiPropertyOptional({ example: 'GPS-12345', description: 'GPS device identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gps_device_id?: string;

  @ApiPropertyOptional({ example: 150.00, description: 'Daily rental rate in currency' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  daily_rental_rate?: number;

  @ApiPropertyOptional({ example: 50000, description: 'Current odometer reading in kilometers' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_mileage?: number;

  @ApiPropertyOptional({ example: 'Recently serviced, excellent condition', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
