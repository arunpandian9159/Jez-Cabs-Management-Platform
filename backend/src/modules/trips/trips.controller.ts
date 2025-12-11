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

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
    constructor(private readonly tripsService: TripsService) { }

    @Post()
    async create(@Body() data: any, @Request() req: any) {
        return this.tripsService.create({
            ...data,
            customer_id: req.user.id,
        });
    }

    @Get()
    async findAll(@Request() req: any) {
        return this.tripsService.findAll(req.user.id, req.user.role);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tripsService.findOne(id);
    }

    @Patch(':id/accept')
    async accept(@Param('id') id: string, @Body() data: any, @Request() req: any) {
        return this.tripsService.acceptTrip(id, req.user.id, data.cab_id);
    }

    @Patch(':id/start')
    async start(@Param('id') id: string, @Body() data: any) {
        return this.tripsService.startTrip(id, data.otp);
    }

    @Patch(':id/complete')
    async complete(@Param('id') id: string, @Body() data: any) {
        return this.tripsService.completeTrip(id, data.actual_fare);
    }

    @Patch(':id/cancel')
    async cancel(@Param('id') id: string, @Body() data: any, @Request() req: any) {
        return this.tripsService.cancelTrip(id, req.user.id, data.reason);
    }

    @Post(':id/rate')
    async rate(@Param('id') id: string, @Body() data: any, @Request() req: any) {
        const isCustomer = req.user.role === 'customer';
        return this.tripsService.rateTrip(id, data.rating, data.feedback, isCustomer);
    }
}
