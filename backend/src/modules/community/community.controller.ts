import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Get('trips')
    async findAll() {
        return this.communityService.findAll();
    }

    @Get('trips/my')
    async findMy(@Request() req: any) {
        return this.communityService.findByUser(req.user.id);
    }

    @Post('trips')
    async create(@Body() data: any, @Request() req: any) {
        return this.communityService.create({
            ...data,
            poster_id: req.user.id,
        });
    }

    @Get('trips/:id')
    async findOne(@Param('id') id: string) {
        return this.communityService.findOne(id);
    }

    @Post('trips/:id/book')
    async book(@Param('id') id: string, @Body() data: any) {
        return this.communityService.updateSeats(id, data.seats || 1);
    }

    @Patch('trips/:id/cancel')
    async cancel(@Param('id') id: string) {
        return this.communityService.cancel(id);
    }
}
