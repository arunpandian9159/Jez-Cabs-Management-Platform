import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class DriverOnboardingDto {
    // Personal Info
    @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)' })
    @IsNotEmpty()
    @IsDateString()
    date_of_birth: string;

    @ApiProperty({ description: 'Driver address' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ description: 'City' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ description: 'State' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiProperty({ description: 'Pincode' })
    @IsNotEmpty()
    @IsString()
    pincode: string;

    @ApiProperty({ description: 'Emergency contact name' })
    @IsNotEmpty()
    @IsString()
    emergency_contact: string;

    @ApiProperty({ description: 'Emergency contact phone' })
    @IsNotEmpty()
    @IsString()
    emergency_phone: string;

    // License Info
    @ApiProperty({ description: 'Driving license number' })
    @IsNotEmpty()
    @IsString()
    license_number: string;

    @ApiProperty({ description: 'License type (LMV, HMV, etc.)' })
    @IsNotEmpty()
    @IsString()
    license_type: string;

    @ApiProperty({ description: 'License expiry date (YYYY-MM-DD)' })
    @IsNotEmpty()
    @IsDateString()
    license_expiry: string;

    @ApiProperty({ description: 'Years of driving experience' })
    @IsNotEmpty()
    @IsString()
    years_of_experience: string;

    // Vehicle Info
    @ApiProperty({ description: 'Does the driver own a cab' })
    @IsNotEmpty()
    @IsString()
    owns_cab: string;

    @ApiPropertyOptional({ description: 'Vehicle make' })
    @IsOptional()
    @IsString()
    vehicle_make?: string;

    @ApiPropertyOptional({ description: 'Vehicle model' })
    @IsOptional()
    @IsString()
    vehicle_model?: string;

    @ApiPropertyOptional({ description: 'Vehicle year' })
    @IsOptional()
    @IsString()
    vehicle_year?: string;

    @ApiPropertyOptional({ description: 'Vehicle color' })
    @IsOptional()
    @IsString()
    vehicle_color?: string;

    @ApiPropertyOptional({ description: 'Vehicle registration number' })
    @IsOptional()
    @IsString()
    registration_number?: string;

    @ApiPropertyOptional({ description: 'Vehicle insurance expiry date' })
    @IsOptional()
    @IsString()
    insurance_expiry?: string;
}
