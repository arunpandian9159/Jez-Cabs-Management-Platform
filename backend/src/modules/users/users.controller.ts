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
import { UsersService } from './users.service';
import { CreateAddressDto, UpdateAddressDto, CreatePaymentMethodDto } from './dto';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // ==================== Saved Addresses ====================

    @Get('addresses')
    async getSavedAddresses(@Request() req: any) {
        return this.usersService.getSavedAddresses(req.user.id);
    }

    @Post('addresses')
    async createAddress(@Request() req: any, @Body() dto: CreateAddressDto) {
        return this.usersService.createAddress(req.user.id, dto);
    }

    @Patch('addresses/:id')
    async updateAddress(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.usersService.updateAddress(req.user.id, id, dto);
    }

    @Delete('addresses/:id')
    async deleteAddress(@Request() req: any, @Param('id') id: string) {
        await this.usersService.deleteAddress(req.user.id, id);
        return { message: 'Address deleted successfully' };
    }

    // ==================== Recent Destinations ====================

    @Get('recent-destinations')
    async getRecentDestinations(
        @Request() req: any,
        @Query('limit') limit?: string,
    ) {
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        return this.usersService.getRecentDestinations(req.user.id, parsedLimit);
    }

    // ==================== Payment Methods ====================

    @Get('payment-methods')
    async getPaymentMethods(@Request() req: any) {
        return this.usersService.getPaymentMethods(req.user.id);
    }

    @Post('payment-methods')
    async addPaymentMethod(@Request() req: any, @Body() dto: CreatePaymentMethodDto) {
        return this.usersService.addPaymentMethod(req.user.id, dto);
    }

    @Delete('payment-methods/:id')
    async removePaymentMethod(@Request() req: any, @Param('id') id: string) {
        await this.usersService.removePaymentMethod(req.user.id, id);
        return { message: 'Payment method removed successfully' };
    }

    @Patch('payment-methods/:id/default')
    async setDefaultPaymentMethod(@Request() req: any, @Param('id') id: string) {
        return this.usersService.setDefaultPaymentMethod(req.user.id, id);
    }

    // ==================== Wallet ====================

    @Get('wallet')
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
    async getTransactions(
        @Request() req: any,
        @Query('limit') limit?: string,
    ) {
        const parsedLimit = limit ? parseInt(limit, 10) : 20;
        return this.usersService.getTransactions(req.user.id, parsedLimit);
    }
}
