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
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { RentalStatus } from '../../common/enums';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.rentalsService.create({
      ...data,
      customer_id: req.user.id,
    });
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.rentalsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.rentalsService.updateStatus(id, RentalStatus.CONFIRMED);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.rentalsService.updateStatus(id, RentalStatus.CANCELLED);
  }
}
