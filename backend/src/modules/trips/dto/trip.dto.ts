import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';

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
