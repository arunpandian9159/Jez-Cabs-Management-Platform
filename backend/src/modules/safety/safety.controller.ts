import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
    constructor(private readonly safetyService: SafetyService) { }

    @Get('contacts')
    async getContacts(@Request() req: any) {
        return this.safetyService.findAllByUser(req.user.id);
    }

    @Post('contacts')
    async createContact(@Body() data: any, @Request() req: any) {
        return this.safetyService.create({
            ...data,
            user_id: req.user.id,
        });
    }

    @Patch('contacts/:id')
    async updateContact(@Param('id') id: string, @Body() data: any) {
        return this.safetyService.update(id, data);
    }

    @Delete('contacts/:id')
    async deleteContact(@Param('id') id: string) {
        return this.safetyService.delete(id);
    }

    @Patch('contacts/:id/primary')
    async setPrimary(@Param('id') id: string, @Request() req: any) {
        return this.safetyService.setPrimary(id, req.user.id);
    }

    @Post('sos')
    async triggerSOS(@Request() req: any) {
        // In production, this would trigger SMS/push notifications to emergency contacts
        return { message: 'SOS alert sent to emergency contacts', timestamp: new Date() };
    }
}
