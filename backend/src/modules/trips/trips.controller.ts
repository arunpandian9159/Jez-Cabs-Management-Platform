import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
  ScheduleTripDto,
  UpdateScheduledTripDto,
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
  constructor(private readonly tripsService: TripsService) {}

  // ============ Basic Trip Endpoints ============

  @Post()
  @ApiOperation({ summary: 'Create a new trip booking' })
  @ApiResponse({
    status: 201,
    description: 'Trip created successfully with OTP',
  })
  @ApiResponse({ status: 400, description: 'Invalid trip data' })
  async create(
    @Body() createTripDto: CreateTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.create({
      ...createTripDto,
      customer_id: req.user.id,
      scheduled_at: createTripDto.scheduled_at
        ? new Date(createTripDto.scheduled_at)
        : undefined,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips for the current user' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by trip status',
  })
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
  async start(@Param('id') id: string, @Body() startTripDto: StartTripDto) {
    return this.tripsService.startTrip(id, startTripDto.otp);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a trip and calculate final fare' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip completed successfully' })
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

  // ============ Scheduled Rides Endpoints ============

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule a future trip (up to 7 days in advance)' })
  @ApiResponse({ status: 201, description: 'Trip scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid scheduling data' })
  async scheduleTrip(
    @Body() scheduleTripDto: ScheduleTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.scheduleTrip(req.user.id, scheduleTripDto);
  }

  @Get('scheduled/list')
  @ApiOperation({ summary: 'Get all scheduled trips for the current user' })
  @ApiResponse({ status: 200, description: 'List of scheduled trips returned' })
  async getScheduledTrips(@Request() req: AuthenticatedRequest) {
    return this.tripsService.getScheduledTrips(req.user.id);
  }

  @Patch('scheduled/:id')
  @ApiOperation({ summary: 'Update a scheduled trip' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Scheduled trip updated' })
  async updateScheduledTrip(
    @Param('id') id: string,
    @Body() updateDto: UpdateScheduledTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.updateScheduledTrip(id, req.user.id, updateDto);
  }

  @Delete('scheduled/:id')
  @ApiOperation({ summary: 'Cancel a scheduled trip' })
  @ApiParam({ name: 'id', description: 'Trip UUID' })
  @ApiResponse({ status: 200, description: 'Scheduled trip cancelled' })
  async cancelScheduledTrip(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.cancelScheduledTrip(id, req.user.id);
  }

  // ============ Recurring Rides Endpoints ============

  @Get('recurring/list')
  @ApiOperation({ summary: 'Get all recurring rides for the current user' })
  @ApiResponse({ status: 200, description: 'List of recurring rides returned' })
  async getRecurringRides(@Request() req: AuthenticatedRequest) {
    return this.tripsService.getRecurringRides(req.user.id);
  }

  @Patch('recurring/:id/pause')
  @ApiOperation({ summary: 'Pause a recurring ride' })
  @ApiParam({ name: 'id', description: 'Recurring ride UUID' })
  @ApiResponse({ status: 200, description: 'Recurring ride paused' })
  async pauseRecurringRide(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.pauseRecurringRide(id, req.user.id);
  }

  @Patch('recurring/:id/resume')
  @ApiOperation({ summary: 'Resume a paused recurring ride' })
  @ApiParam({ name: 'id', description: 'Recurring ride UUID' })
  @ApiResponse({ status: 200, description: 'Recurring ride resumed' })
  async resumeRecurringRide(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.resumeRecurringRide(id, req.user.id);
  }

  @Delete('recurring/:id')
  @ApiOperation({ summary: 'Cancel a recurring ride' })
  @ApiParam({ name: 'id', description: 'Recurring ride UUID' })
  @ApiResponse({ status: 200, description: 'Recurring ride cancelled' })
  async cancelRecurringRide(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.cancelRecurringRide(id, req.user.id);
  }
}
