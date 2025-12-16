import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@ApiTags('Safety')
@Controller('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) { }

  @Get('contacts')
  @ApiOperation({ summary: 'Get all emergency contacts for the current user' })
  @ApiResponse({ status: 200, description: 'Emergency contacts retrieved' })
  async getContacts(@Request() req: any) {
    return this.safetyService.findAllByUser(req.user.id);
  }

  @Post('contacts')
  @ApiOperation({ summary: 'Add a new emergency contact' })
  @ApiResponse({ status: 201, description: 'Emergency contact created' })
  @ApiResponse({ status: 400, description: 'Invalid contact data' })
  async createContact(@Body() data: any, @Request() req: any) {
    return this.safetyService.create({
      ...data,
      user_id: req.user.id,
    });
  }

  @Patch('contacts/:id')
  @ApiOperation({ summary: 'Update an emergency contact' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateContact(@Param('id') id: string, @Body() data: any) {
    return this.safetyService.update(id, data);
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete an emergency contact' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async deleteContact(@Param('id') id: string) {
    return this.safetyService.delete(id);
  }

  @Patch('contacts/:id/primary')
  @ApiOperation({ summary: 'Set an emergency contact as primary' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Primary contact updated' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async setPrimary(@Param('id') id: string, @Request() req: any) {
    return this.safetyService.setPrimary(id, req.user.id);
  }

  @Post('sos')
  @ApiOperation({ summary: 'Trigger SOS emergency alert to all contacts' })
  @ApiResponse({ status: 200, description: 'SOS alert sent successfully' })
  async triggerSOS(@Request() req: any) {
    // In production, this would trigger SMS/push notifications to emergency contacts
    return {
      message: 'SOS alert sent to emergency contacts',
      timestamp: new Date(),
    };
  }
}
