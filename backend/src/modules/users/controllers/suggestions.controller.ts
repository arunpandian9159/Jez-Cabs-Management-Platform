import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { SuggestionsService } from '../services/suggestions.service';

@ApiTags('Smart Suggestions')
@Controller('users/suggestions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get personalized suggestions for the user' })
  @ApiResponse({ status: 200, description: 'Personalized suggestions' })
  async getSuggestions(@Request() req: { user: { sub: string } }) {
    return this.suggestionsService.getSuggestions(req.user.sub);
  }
}
