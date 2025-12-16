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
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { RentalStatus } from '../../common/enums';

@ApiTags('Rentals')
@Controller('rentals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new rental booking' })
  @ApiResponse({ status: 201, description: 'Rental booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rental data' })
  @ApiResponse({ status: 404, description: 'Vehicle not found or unavailable' })
  async create(@Body() data: any, @Request() req: any) {
    return this.rentalsService.create({
      ...data,
      customer_id: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals for the current user' })
  @ApiResponse({ status: 200, description: 'List of rentals returned' })
  async findAll(@Request() req: any) {
    return this.rentalsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rental by ID' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({ status: 200, description: 'Rental details returned' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a pending rental' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({ status: 200, description: 'Rental confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Rental cannot be confirmed' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async confirm(@Param('id') id: string) {
    return this.rentalsService.updateStatus(id, RentalStatus.CONFIRMED);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a rental' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({ status: 200, description: 'Rental cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Rental cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async cancel(@Param('id') id: string) {
    return this.rentalsService.updateStatus(id, RentalStatus.CANCELLED);
  }
}
