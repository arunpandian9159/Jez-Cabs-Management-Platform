import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  MaxLength,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({ example: 'John', description: 'Driver first name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Driver last name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Driver email address' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Driver contact number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  contactNumber: string;

  @ApiProperty({ example: 'DL-1234567890', description: 'Driver license number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  licenseNumber: string;

  @ApiProperty({ example: '2026-12-31', description: 'License expiry date (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  licenseExpiry: string;

  @ApiPropertyOptional({ example: 'Class A', description: 'License type/class' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseType?: string;

  @ApiPropertyOptional({ example: '1990-01-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: '123 Main St, City, State, ZIP', description: 'Residential address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+0987654321', description: 'Emergency contact number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  emergencyContactNumber?: string;

  @ApiPropertyOptional({ example: 'Spouse', description: 'Emergency contact relationship' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  emergencyContactRelationship?: string;

  @ApiPropertyOptional({ example: '2024-01-15', description: 'Date of joining (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateOfJoining?: string;

  @ApiPropertyOptional({ example: 'Experienced driver, excellent record', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

