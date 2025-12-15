import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
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

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @Post()
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
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.tripsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id/accept')
  async accept(
    @Param('id') id: string,
    @Body() acceptTripDto: AcceptTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.acceptTrip(id, req.user.id, acceptTripDto.cab_id);
  }

  @Patch(':id/start')
  async start(
    @Param('id') id: string,
    @Body() startTripDto: StartTripDto,
  ) {
    return this.tripsService.startTrip(id, startTripDto.otp);
  }

  @Patch(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body() completeTripDto: CompleteTripDto,
  ) {
    return this.tripsService.completeTrip(id, completeTripDto.actual_fare);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelTripDto: CancelTripDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tripsService.cancelTrip(id, req.user.id, cancelTripDto.reason);
  }

  @Post(':id/rate')
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
