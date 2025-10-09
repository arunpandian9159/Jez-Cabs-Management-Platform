import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty({ example: 'Jez Cabs Ltd', description: 'Company name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  companyName: string;

  @ApiProperty({ example: '123 Main Street, City, Country', description: 'Company address', required: false })
  @IsOptional()
  @IsString()
  companyAddress?: string;

  @ApiProperty({ example: 'contact@jezcabs.com', description: 'Company contact email' })
  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ example: '+1234567890', description: 'Company contact phone', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  companyPhone?: string;

  @ApiProperty({ example: 'John', description: 'Owner first name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Owner last name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'owner@jezcabs.com', description: 'Owner email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass@123', 
    description: 'Password (min 8 characters, must contain uppercase, lowercase, number, and special character)' 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'Owner phone number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;
}

