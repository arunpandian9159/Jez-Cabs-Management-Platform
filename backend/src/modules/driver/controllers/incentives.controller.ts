import {
  Controller,
  Get,
  Post,
  Param,
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
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { IncentivesService } from '../services/incentives.service';

interface AuthRequest extends Request {
  user: {
    sub: string;
    id: string;
    role: string;
  };
}

@ApiTags('Driver Incentives')
@Controller('driver/incentives')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncentivesController {
  constructor(private readonly incentivesService: IncentivesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all incentives for the current driver' })
  @ApiResponse({ status: 200, description: 'Incentives retrieved' })
  async getAllIncentives(@Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.incentivesService.getAllIncentives(driverId),
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active incentives for the current driver' })
  @ApiResponse({ status: 200, description: 'Active incentives retrieved' })
  async getActiveIncentives(@Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.incentivesService.getActiveIncentives(driverId),
    };
  }

  @Get('claimable')
  @ApiOperation({ summary: 'Get claimable incentives' })
  @ApiResponse({ status: 200, description: 'Claimable incentives retrieved' })
  async getClaimableIncentives(@Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.incentivesService.getClaimableIncentives(driverId),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get incentive statistics' })
  @ApiResponse({ status: 200, description: 'Incentive stats retrieved' })
  async getStats(@Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.incentivesService.getStats(driverId),
    };
  }

  @Post(':id/claim')
  @ApiOperation({ summary: 'Claim a completed incentive' })
  @ApiParam({ name: 'id', description: 'Incentive UUID' })
  @ApiResponse({ status: 200, description: 'Incentive claimed successfully' })
  @ApiResponse({ status: 400, description: 'Incentive cannot be claimed' })
  async claimIncentive(@Param('id') id: string, @Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    const incentive = await this.incentivesService.claimIncentive(id, driverId);
    return {
      success: true,
      message: `Successfully claimed ₹${incentive.bonus_amount} bonus!`,
      data: incentive,
    };
  }

  @Post('initialize-weekly')
  @ApiOperation({ summary: 'Initialize weekly incentives for driver' })
  @ApiResponse({ status: 201, description: 'Weekly incentives created' })
  async initializeWeeklyIncentives(@Request() req: AuthRequest) {
    const driverId = req.user.sub || req.user.id;
    const incentives =
      await this.incentivesService.createWeeklyIncentives(driverId);
    return {
      success: true,
      message: 'Weekly incentives initialized',
      data: incentives,
    };
  }
}
