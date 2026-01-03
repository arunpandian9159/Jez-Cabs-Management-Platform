import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { PreferencesService } from '../services/preferences.service';
import { UpdatePreferencesDto, DriverActionDto } from '../dto/preferences.dto';

@ApiTags('User Preferences')
@Controller('users/preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user ride preferences' })
  @ApiResponse({ status: 200, description: 'User preferences' })
  async getPreferences(@Request() req: { user: { sub: string } }) {
    return this.preferencesService.getPreferences(req.user.sub);
  }

  @Put()
  @ApiOperation({ summary: 'Update user ride preferences' })
  @ApiResponse({ status: 200, description: 'Updated preferences' })
  async updatePreferences(
    @Request() req: { user: { sub: string } },
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(req.user.sub, dto);
  }

  @Post('drivers/favorite')
  @ApiOperation({ summary: 'Add a driver to favorites' })
  @ApiResponse({ status: 200, description: 'Driver added to favorites' })
  async addFavoriteDriver(
    @Request() req: { user: { sub: string } },
    @Body() dto: DriverActionDto,
  ) {
    return this.preferencesService.addFavoriteDriver(
      req.user.sub,
      dto.driverId,
    );
  }

  @Delete('drivers/favorite/:driverId')
  @ApiOperation({ summary: 'Remove a driver from favorites' })
  @ApiResponse({ status: 200, description: 'Driver removed from favorites' })
  async removeFavoriteDriver(
    @Request() req: { user: { sub: string } },
    @Param('driverId') driverId: string,
  ) {
    return this.preferencesService.removeFavoriteDriver(req.user.sub, driverId);
  }

  @Post('drivers/block')
  @ApiOperation({ summary: 'Block a driver' })
  @ApiResponse({ status: 200, description: 'Driver blocked' })
  async blockDriver(
    @Request() req: { user: { sub: string } },
    @Body() dto: DriverActionDto,
  ) {
    return this.preferencesService.blockDriver(req.user.sub, dto.driverId);
  }

  @Delete('drivers/block/:driverId')
  @ApiOperation({ summary: 'Unblock a driver' })
  @ApiResponse({ status: 200, description: 'Driver unblocked' })
  async unblockDriver(
    @Request() req: { user: { sub: string } },
    @Param('driverId') driverId: string,
  ) {
    return this.preferencesService.unblockDriver(req.user.sub, driverId);
  }
}
