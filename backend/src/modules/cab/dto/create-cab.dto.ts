import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { CabStatus, CabType } from '../../../common/enums';

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
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiProperty({ example: 'ABC-1234', description: 'Vehicle registration number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  registration_number: string;

  @ApiPropertyOptional({ enum: CabType, example: CabType.SEDAN, description: 'Type of cab' })
  @IsOptional()
  @IsEnum(CabType)
  cab_type?: CabType;

  @ApiPropertyOptional({ enum: CabStatus, example: CabStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(CabStatus)
  status?: CabStatus;

  @ApiPropertyOptional({ example: 'White', description: 'Vehicle color' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 4, description: 'Number of seats' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  seating_capacity?: number;

  @ApiPropertyOptional({ example: 'Petrol', description: 'Fuel type' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fuel_type?: string;

  @ApiPropertyOptional({ example: true, description: 'AC available' })
  @IsOptional()
  @IsBoolean()
  ac_available?: boolean;

  @ApiPropertyOptional({ description: 'Vehicle image URL' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Insurance expiry date' })
  @IsOptional()
  @IsDateString()
  insurance_expiry?: string;

  @ApiPropertyOptional({ example: '2026-06-30', description: 'Registration expiry date' })
  @IsOptional()
  @IsDateString()
  registration_expiry?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fitness certificate expiry' })
  @IsOptional()
  @IsDateString()
  fitness_expiry?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Permit expiry date' })
  @IsOptional()
  @IsDateString()
  permit_expiry?: string;

  @ApiPropertyOptional({ example: 50.00, description: 'Base fare' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  base_fare?: number;

  @ApiPropertyOptional({ example: 12.00, description: 'Per kilometer rate' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  per_km_rate?: number;

  @ApiPropertyOptional({ example: 2.00, description: 'Per minute rate' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  per_min_rate?: number;
}
