import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
  IsDateString,
  IsBoolean,
  IsEnum,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

/**
 * DTO for creating a new trip request
 */
export class CreateTripDto {
  @IsString()
  pickup_address: string;

  @IsNumber()
  pickup_lat: number;

  @IsNumber()
  pickup_lng: number;

  @IsString()
  dropoff_address: string;

  @IsNumber()
  dropoff_lat: number;

  @IsNumber()
  dropoff_lng: number;

  @IsOptional()
  @IsNumber()
  estimated_fare?: number;

  @IsOptional()
  @IsNumber()
  distance_km?: number;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;
}

/**
 * DTO for accepting a trip (driver)
 */
export class AcceptTripDto {
  @IsUUID()
  cab_id: string;
}

/**
 * DTO for starting a trip with OTP verification
 */
export class StartTripDto {
  @IsString()
  otp: string;
}

/**
 * DTO for completing a trip
 */
export class CompleteTripDto {
  @IsNumber()
  actual_fare: number;
}

/**
 * DTO for cancelling a trip
 */
export class CancelTripDto {
  @IsString()
  reason: string;
}

/**
 * DTO for rating a trip
 */
export class RateTripDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

/**
 * Recurrence type for scheduled rides
 */
export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKDAYS = 'weekdays',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

/**
 * DTO for scheduling a future trip
 */
export class ScheduleTripDto {
  @IsString()
  pickup_address: string;

  @IsNumber()
  pickup_lat: number;

  @IsNumber()
  pickup_lng: number;

  @IsString()
  dropoff_address: string;

  @IsNumber()
  dropoff_lat: number;

  @IsNumber()
  dropoff_lng: number;

  @IsDateString()
  scheduled_at: string;

  @IsOptional()
  @IsString()
  cab_type?: string;

  @IsOptional()
  @IsNumber()
  estimated_fare?: number;

  @IsOptional()
  @IsBoolean()
  lock_fare?: boolean;

  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence?: RecurrenceType;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recurrence_days?: number[]; // 0-6 for days of week (Sunday = 0)

  @IsOptional()
  @IsDateString()
  recurrence_end_date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO for updating a scheduled trip
 */
export class UpdateScheduledTripDto {
  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  @IsString()
  pickup_address?: string;

  @IsOptional()
  @IsNumber()
  pickup_lat?: number;

  @IsOptional()
  @IsNumber()
  pickup_lng?: number;

  @IsOptional()
  @IsString()
  dropoff_address?: string;

  @IsOptional()
  @IsNumber()
  dropoff_lat?: number;

  @IsOptional()
  @IsNumber()
  dropoff_lng?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
