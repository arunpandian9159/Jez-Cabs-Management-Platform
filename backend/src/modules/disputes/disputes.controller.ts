import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { DisputeStatus } from '../../common/enums';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
    constructor(private readonly disputesService: DisputesService) { }

    @Post()
    async create(@Body() data: any, @Request() req: any) {
        return this.disputesService.create({
            ...data,
            raised_by: req.user.id,
        });
    }

    @Get()
    async findAll(@Request() req: any, @Query('status') status?: DisputeStatus) {
        const isAdmin = req.user.role === 'admin' || req.user.role === 'support';
        return this.disputesService.findAll(isAdmin ? undefined : req.user.id, status);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.disputesService.findOne(id);
    }

    @Patch(':id/resolve')
    async resolve(@Param('id') id: string, @Body() data: any) {
        return this.disputesService.resolve(id, data.resolution, data.refund_amount);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() data: any) {
        return this.disputesService.updateStatus(id, data.status);
    }
}
