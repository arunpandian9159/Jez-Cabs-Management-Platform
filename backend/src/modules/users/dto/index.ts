import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MaxLength(50)
  label: string;

  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class CreatePaymentMethodDto {
  @IsString()
  type: 'card' | 'upi' | 'wallet' | 'netbanking';

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  upi_id?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
