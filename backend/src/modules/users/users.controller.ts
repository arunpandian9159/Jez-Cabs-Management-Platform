import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { UsersService } from './users.service';
import {
  CreateAddressDto,
  UpdateAddressDto,
  CreatePaymentMethodDto,
} from './dto';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ==================== Saved Addresses ====================

  @Get('addresses')
  @ApiOperation({ summary: 'Get all saved addresses for the current user' })
  @ApiResponse({ status: 200, description: 'Saved addresses retrieved' })
  async getSavedAddresses(@Request() req: any) {
    return this.usersService.getSavedAddresses(req.user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new saved address (Home, Work, etc.)' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid address data' })
  async createAddress(@Request() req: any, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(req.user.id, dto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update a saved address' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(req.user.id, id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete a saved address' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(@Request() req: any, @Param('id') id: string) {
    await this.usersService.deleteAddress(req.user.id, id);
    return { message: 'Address deleted successfully' };
  }

  // ==================== Recent Destinations ====================

  @Get('recent-destinations')
  @ApiOperation({ summary: 'Get recent destinations for the current user' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Recent destinations retrieved' })
  async getRecentDestinations(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.usersService.getRecentDestinations(req.user.id, parsedLimit);
  }

  // ==================== Payment Methods ====================

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get all payment methods for the current user' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved' })
  async getPaymentMethods(@Request() req: any) {
    return this.usersService.getPaymentMethods(req.user.id);
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Add a new payment method (Card, UPI, etc.)' })
  @ApiResponse({ status: 201, description: 'Payment method added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment method data' })
  async addPaymentMethod(
    @Request() req: any,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.usersService.addPaymentMethod(req.user.id, dto);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Remove a payment method' })
  @ApiParam({ name: 'id', description: 'Payment method UUID' })
  @ApiResponse({ status: 200, description: 'Payment method removed successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  async removePaymentMethod(@Request() req: any, @Param('id') id: string) {
    await this.usersService.removePaymentMethod(req.user.id, id);
    return { message: 'Payment method removed successfully' };
  }

  @Patch('payment-methods/:id/default')
  @ApiOperation({ summary: 'Set a payment method as default' })
  @ApiParam({ name: 'id', description: 'Payment method UUID' })
  @ApiResponse({ status: 200, description: 'Default payment method updated' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  async setDefaultPaymentMethod(@Request() req: any, @Param('id') id: string) {
    return this.usersService.setDefaultPaymentMethod(req.user.id, id);
  }

  // ==================== Wallet ====================

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet balance for the current user' })
  @ApiResponse({ status: 200, description: 'Wallet details retrieved' })
  async getWallet(@Request() req: any) {
    const wallet = await this.usersService.getWallet(req.user.id);
    return {
      balance: Number(wallet.balance),
      currency: wallet.currency,
      last_updated: wallet.updated_at,
    };
  }

  // ==================== Transactions ====================

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history for the current user' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of transactions to return (default: 20)' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  async getTransactions(@Request() req: any, @Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.usersService.getTransactions(req.user.id, parsedLimit);
  }

  // ==================== Payment Stats ====================

  @Get('payment-stats')
  @ApiOperation({ summary: 'Get payment statistics for the current user' })
  @ApiResponse({ status: 200, description: 'Payment statistics retrieved' })
  async getPaymentStats(@Request() req: any) {
    return this.usersService.getPaymentStats(req.user.id);
  }
}
