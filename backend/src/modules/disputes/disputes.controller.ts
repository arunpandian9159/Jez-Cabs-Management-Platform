import {
  Controller,
  Get,
  Post,
  Patch,
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
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { DisputeStatus } from '../../common/enums';

@ApiTags('Disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) { }

  @Post()
  @ApiOperation({ summary: 'File a new dispute' })
  @ApiResponse({ status: 201, description: 'Dispute created with ticket number' })
  @ApiResponse({ status: 400, description: 'Invalid dispute data' })
  async create(@Body() data: any, @Request() req: any) {
    return this.disputesService.create({
      ...data,
      raised_by: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all disputes (filtered by user for non-admin)' })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'in_progress', 'resolved', 'closed'], description: 'Filter by dispute status' })
  @ApiResponse({ status: 200, description: 'List of disputes returned' })
  async findAll(@Request() req: any, @Query('status') status?: DisputeStatus) {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'support';
    return this.disputesService.findAll(
      isAdmin ? undefined : req.user.id,
      status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific dispute by ID' })
  @ApiParam({ name: 'id', description: 'Dispute UUID' })
  @ApiResponse({ status: 200, description: 'Dispute details returned' })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  async findOne(@Param('id') id: string) {
    return this.disputesService.findOne(id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve a dispute (Admin/Support only)' })
  @ApiParam({ name: 'id', description: 'Dispute UUID' })
  @ApiResponse({ status: 200, description: 'Dispute resolved successfully' })
  @ApiResponse({ status: 400, description: 'Dispute cannot be resolved' })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  async resolve(@Param('id') id: string, @Body() data: any) {
    return this.disputesService.resolve(
      id,
      data.resolution,
      data.refund_amount,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update dispute status' })
  @ApiParam({ name: 'id', description: 'Dispute UUID' })
  @ApiResponse({ status: 200, description: 'Dispute status updated' })
  @ApiResponse({ status: 404, description: 'Dispute not found' })
  async updateStatus(@Param('id') id: string, @Body() data: any) {
    return this.disputesService.updateStatus(id, data.status);
  }
}
