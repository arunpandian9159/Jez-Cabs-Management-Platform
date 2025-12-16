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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@ApiTags('Community')
@Controller('community')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { }

  @Get('trips')
  @ApiOperation({ summary: 'Get all available community trips' })
  @ApiResponse({ status: 200, description: 'List of community trips returned' })
  async findAll() {
    return this.communityService.findAll();
  }

  @Get('trips/my')
  @ApiOperation({ summary: 'Get trips posted by the current user' })
  @ApiResponse({ status: 200, description: 'User\'s community trips returned' })
  async findMy(@Request() req: any) {
    return this.communityService.findByUser(req.user.id);
  }

  @Post('trips')
  @ApiOperation({ summary: 'Post a new community trip (offering or requesting)' })
  @ApiResponse({ status: 201, description: 'Community trip created' })
  @ApiResponse({ status: 400, description: 'Invalid trip data' })
  async create(@Body() data: any, @Request() req: any) {
    return this.communityService.create({
      ...data,
      poster_id: req.user.id,
    });
  }

  @Get('trips/:id')
  @ApiOperation({ summary: 'Get a specific community trip by ID' })
  @ApiParam({ name: 'id', description: 'Community trip UUID' })
  @ApiResponse({ status: 200, description: 'Community trip details returned' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string) {
    return this.communityService.findOne(id);
  }

  @Post('trips/:id/book')
  @ApiOperation({ summary: 'Book seats on a community trip' })
  @ApiParam({ name: 'id', description: 'Community trip UUID' })
  @ApiResponse({ status: 200, description: 'Seats booked successfully' })
  @ApiResponse({ status: 400, description: 'Not enough seats available' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async book(@Param('id') id: string, @Body() data: any) {
    return this.communityService.updateSeats(id, data.seats || 1);
  }

  @Patch('trips/:id/cancel')
  @ApiOperation({ summary: 'Cancel a community trip post' })
  @ApiParam({ name: 'id', description: 'Community trip UUID' })
  @ApiResponse({ status: 200, description: 'Trip cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async cancel(@Param('id') id: string) {
    return this.communityService.cancel(id);
  }
}
