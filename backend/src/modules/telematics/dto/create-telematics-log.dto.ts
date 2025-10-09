import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @ApiProperty({ example: 40.7128, description: 'Latitude coordinate' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export enum TelematicsEventType {
  NORMAL = 'NORMAL',
  SPEEDING = 'SPEEDING',
  HARSH_BRAKE = 'HARSH_BRAKE',
  HARSH_ACCELERATION = 'HARSH_ACCELERATION',
  GEOFENCE_ENTRY = 'GEOFENCE_ENTRY',
  GEOFENCE_EXIT = 'GEOFENCE_EXIT',
  IDLE = 'IDLE',
}

export class CreateTelematicsLogDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Cab ID' })
  @IsString()
  @IsNotEmpty()
  cabId: string;

  @ApiProperty({ example: 'GPS-12345', description: 'GPS device identifier' })
  @IsString()
  @IsNotEmpty()
  gpsDeviceId: string;

  @ApiProperty({ example: '2025-10-09T10:30:00Z', description: 'Timestamp of the GPS reading' })
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @ApiProperty({ type: LocationDto, description: 'GPS location coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ example: 65.5, description: 'Speed in km/h', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  speed?: number;

  @ApiPropertyOptional({ example: 180, description: 'Heading/direction in degrees (0-360)', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  heading?: number;

  @ApiPropertyOptional({ example: 150.5, description: 'Altitude in meters', default: 0 })
  @IsNumber()
  @IsOptional()
  altitude?: number;

  @ApiPropertyOptional({ 
    enum: TelematicsEventType, 
    example: TelematicsEventType.NORMAL, 
    description: 'Type of event detected',
    default: TelematicsEventType.NORMAL
  })
  @IsEnum(TelematicsEventType)
  @IsOptional()
  eventType?: TelematicsEventType;

  @ApiPropertyOptional({ 
    example: { fuelLevel: 75, engineTemp: 90 }, 
    description: 'Additional metadata' 
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Associated booking ID' })
  @IsString()
  @IsOptional()
  bookingId?: string;
}

