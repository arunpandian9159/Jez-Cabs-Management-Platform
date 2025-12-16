import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import {
  CreateTripDto,
  AcceptTripDto,
  StartTripDto,
  CompleteTripDto,
  CancelTripDto,
  RateTripDto,
} from './dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    role: string;
  };
}

@ApiTags('Trips')
@Controller('trips')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new trip booking' })
  @ApiResponse({ status: 201, description: 'Trip created successfully with OTP' })
  @ApiResponse({ status: 400, description: 'Invalid trip data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createTripDto: CreateTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.create({
      ...createTripDto,
      customer_id: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips for the current user' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by trip status' })
  @ApiResponse({ status: 200, description: 'List of trips returned' })
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: string,
  ) {
    return this.tripsService.findAll(req.user.id, req.user.role, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip details returned' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accept a pending trip (Driver only)' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip accepted successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be accepted' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async accept(
    @Param('id') id: string,
    @Body() acceptTripDto: AcceptTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.acceptTrip(id, req.user.id, acceptTripDto.cab_id);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start a trip with OTP verification' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip started successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or trip cannot be started' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async start(
    @Param('id') id: string,
    @Body() startTripDto: StartTripDto,
  ) {
    return this.tripsService.startTrip(id, startTripDto.otp);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a trip and calculate final fare' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip completed successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be completed' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async complete(
    @Param('id') id: string,
    @Body() completeTripDto: CompleteTripDto,
  ) {
    return this.tripsService.completeTrip(id, completeTripDto.actual_fare);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a trip' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async cancel(
    @Param('id') id: string,
    @Body() cancelTripDto: CancelTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.cancelTrip(id, req.user.id, cancelTripDto.reason);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate a completed trip' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Rating submitted successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be rated' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async rate(
    @Param('id') id: string,
    @Body() rateTripDto: RateTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const isCustomer = req.user.role === 'customer';
    return this.tripsService.rateTrip(
      id,
      rateTripDto.rating,
      rateTripDto.feedback ?? '',
      isCustomer,
    );
  }
}
