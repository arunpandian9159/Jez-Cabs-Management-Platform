import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import {
  FareEstimationService,
  Coordinates,
} from '../services/fare-estimation.service';
import { LoyaltyService } from '../../users/services/loyalty.service';

@ApiTags('Fare Estimation')
@Controller('fare')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FareController {
  constructor(
    private readonly fareService: FareEstimationService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  @Get('estimate')
  @ApiOperation({ summary: 'Get fare estimate for a trip' })
  @ApiQuery({ name: 'pickup_lat', required: true, type: Number })
  @ApiQuery({ name: 'pickup_lng', required: true, type: Number })
  @ApiQuery({ name: 'dropoff_lat', required: true, type: Number })
  @ApiQuery({ name: 'dropoff_lng', required: true, type: Number })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Fare estimates retrieved' })
  async getFareEstimate(
    @Query('pickup_lat') pickupLat: string,
    @Query('pickup_lng') pickupLng: string,
    @Query('dropoff_lat') dropoffLat: string,
    @Query('dropoff_lng') dropoffLng: string,
    @Query('user_id') userId?: string,
  ) {
    const pickup: Coordinates = {
      lat: parseFloat(pickupLat),
      lng: parseFloat(pickupLng),
    };
    const dropoff: Coordinates = {
      lat: parseFloat(dropoffLat),
      lng: parseFloat(dropoffLng),
    };

    // Get user's discount percentage if userId provided
    let discountPercentage = 0;
    if (userId) {
      discountPercentage =
        await this.loyaltyService.getDiscountPercentage(userId);
    }

    // Get surge multiplier for pickup location
    const surgeMultiplier = this.fareService.getSurgeMultiplier(pickup);

    // Get toll charges estimate
    const tollCharges = await this.fareService.getTollCharges(pickup, dropoff);

    // Get route options with fares
    const routes = await this.fareService.getRouteOptions(
      pickup,
      dropoff,
      'sedan',
      discountPercentage,
    );

    // Get all vehicle type fares for the recommended route
    const recommendedRoute = routes.find((r) => r.isRecommended) || routes[0];
    const vehicleFares = this.fareService.getAllVehicleFares(
      recommendedRoute.distance_km,
      recommendedRoute.duration_minutes,
      surgeMultiplier,
      discountPercentage,
      tollCharges,
    );

    return {
      success: true,
      data: {
        routes,
        vehicleFares,
        surgeMultiplier,
        discountPercentage,
        tollCharges,
        estimatedDistance: recommendedRoute.distance_km,
        estimatedDuration: recommendedRoute.duration_minutes,
      },
    };
  }

  @Get('vehicle-types')
  @ApiOperation({ summary: 'Get available vehicle types and rates' })
  @ApiResponse({ status: 200, description: 'Vehicle types retrieved' })
  async getVehicleTypes() {
    return {
      success: true,
      data: this.fareService.getVehicleTypes(),
    };
  }

  @Get('surge')
  @ApiOperation({ summary: 'Get current surge multiplier for a location' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Surge multiplier retrieved' })
  async getSurge(@Query('lat') lat: string, @Query('lng') lng: string) {
    const location: Coordinates = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    return {
      success: true,
      data: {
        surgeMultiplier: this.fareService.getSurgeMultiplier(location),
        isPeakHour: this.fareService.getSurgeMultiplier(location) > 1,
      },
    };
  }
}
