import {
  Controller,
  Get,
  Post,
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
  ApiQuery,
} from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { LoyaltyService } from '../services/loyalty.service';

class RedeemPointsDto {
  @IsNumber()
  @Min(1)
  points: number;
}

interface AuthRequest extends Request {
  user: {
    sub: string;
    id: string;
    role: string;
  };
}

@ApiTags('Customer Loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get loyalty profile with tier info and progress' })
  @ApiResponse({ status: 200, description: 'Loyalty profile retrieved' })
  async getProfile(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.loyaltyService.getProfile(userId),
    };
  }

  @Get('benefits')
  @ApiOperation({ summary: 'Get current tier benefits' })
  @ApiResponse({ status: 200, description: 'Benefits retrieved' })
  async getBenefits(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.loyaltyService.getTierBenefits(userId),
    };
  }

  @Get('discount')
  @ApiOperation({ summary: 'Get current discount percentage' })
  @ApiResponse({ status: 200, description: 'Discount percentage retrieved' })
  async getDiscount(@Request() req: AuthRequest) {
    const userId = req.user.sub || req.user.id;
    const discount = await this.loyaltyService.getDiscountPercentage(userId);
    return {
      success: true,
      data: { discountPercentage: discount },
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get points history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Points history retrieved' })
  async getHistory(
    @Request() req: AuthRequest,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.sub || req.user.id;
    return {
      success: true,
      data: await this.loyaltyService.getPointsHistory(
        userId,
        limit ? parseInt(limit, 10) : 20,
      ),
    };
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem loyalty points' })
  @ApiResponse({ status: 200, description: 'Points redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points' })
  async redeemPoints(
    @Request() req: AuthRequest,
    @Body() dto: RedeemPointsDto,
  ) {
    const userId = req.user.sub || req.user.id;
    const loyalty = await this.loyaltyService.redeemPoints(
      userId,
      dto.points,
      'Points redeemed for discount',
    );
    return {
      success: true,
      message: `Successfully redeemed ${dto.points} points`,
      data: {
        availablePoints: loyalty.availablePoints,
        tier: loyalty.tier,
      },
    };
  }
}
