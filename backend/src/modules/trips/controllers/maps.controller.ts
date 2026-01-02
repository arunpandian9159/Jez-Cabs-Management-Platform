import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { GeofenceService, Coordinates } from '../services/geofence.service';

class UpdateDriverLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  vehicleType: string;
}

@ApiTags('Maps & Geofencing')
@Controller('maps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MapsController {
  constructor(private readonly geofenceService: GeofenceService) {}

  @Get('geofences')
  @ApiOperation({
    summary: 'Get all active geofences (airports, stations, etc.)',
  })
  @ApiResponse({ status: 200, description: 'Geofences retrieved' })
  async getAllGeofences() {
    return {
      success: true,
      data: this.geofenceService.getAllGeofences(),
    };
  }

  @Get('geofences/nearby')
  @ApiOperation({ summary: 'Get geofences near a location' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Radius in km',
  })
  @ApiResponse({ status: 200, description: 'Nearby geofences retrieved' })
  async getNearbyGeofences(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    const location: Coordinates = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    return {
      success: true,
      data: this.geofenceService.getNearbyGeofences(
        location,
        radius ? parseFloat(radius) : 5,
      ),
    };
  }

  @Get('geofences/check')
  @ApiOperation({ summary: 'Check if location is within a geofence' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Geofence check result' })
  async checkGeofence(@Query('lat') lat: string, @Query('lng') lng: string) {
    const location: Coordinates = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const geofence = this.geofenceService.getGeofenceForLocation(location);

    return {
      success: true,
      data: {
        isInsideGeofence: !!geofence,
        geofence,
        pickupPoints: geofence
          ? this.geofenceService.getPickupPoints(geofence.id)
          : [],
        surgeMultiplier: this.geofenceService.getSurgeFromGeofence(location),
      },
    };
  }

  @Get('drivers/nearby')
  @ApiOperation({ summary: 'Get nearby available drivers' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'vehicleType', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Nearby drivers retrieved' })
  async getNearbyDrivers(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('vehicleType') vehicleType?: string,
  ) {
    const location: Coordinates = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const drivers = this.geofenceService.getNearbyDrivers(
      location,
      radius ? parseFloat(radius) : 3,
      vehicleType,
    );

    return {
      success: true,
      data: {
        count: drivers.length,
        drivers: drivers.map((d) => ({
          location: d.location,
          vehicleType: d.vehicleType,
        })),
      },
    };
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Get driver availability heat map data' })
  @ApiQuery({ name: 'north', required: true, type: Number })
  @ApiQuery({ name: 'south', required: true, type: Number })
  @ApiQuery({ name: 'east', required: true, type: Number })
  @ApiQuery({ name: 'west', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Heat map data retrieved' })
  async getHeatMap(
    @Query('north') north: string,
    @Query('south') south: string,
    @Query('east') east: string,
    @Query('west') west: string,
  ) {
    const bounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    };

    return {
      success: true,
      data: this.geofenceService.generateHeatMapData(bounds),
    };
  }

  @Get('density')
  @ApiOperation({ summary: 'Get driver density for an area' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Driver density retrieved' })
  async getDriverDensity(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    const location: Coordinates = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    return {
      success: true,
      data: this.geofenceService.getDriverDensity(
        location,
        radius ? parseFloat(radius) : 2,
      ),
    };
  }

  @Post('drivers/location')
  @ApiOperation({ summary: 'Update driver location (for drivers only)' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  async updateDriverLocation(
    @Body() dto: UpdateDriverLocationDto,
    @Query('driverId') driverId: string,
    @Query('isAvailable') isAvailable: string,
  ) {
    this.geofenceService.updateDriverLocation(
      driverId,
      { lat: dto.lat, lng: dto.lng },
      dto.vehicleType,
      isAvailable === 'true',
    );

    return {
      success: true,
      message: 'Location updated',
    };
  }
}
