import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    UseGuards,
    Param,
    Query,
    Body,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { OwnerService } from '../services/owner.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums';

@ApiTags('Owner')
@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class OwnerController {
    constructor(private readonly ownerService: OwnerService) { }

    // ============= DRIVERS =============

    @Get('drivers')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get all drivers assigned to owner\'s cabs' })
    @ApiResponse({ status: 200, description: 'Drivers retrieved successfully' })
    async getDrivers(@CurrentUser() currentUser: User) {
        return this.ownerService.getDrivers(currentUser.id);
    }

    @Get('drivers/:id')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get a specific driver by ID' })
    @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Driver not found' })
    async getDriver(@Param('id') id: string, @CurrentUser() currentUser: User) {
        return this.ownerService.getDriver(id, currentUser.id);
    }

    @Patch('drivers/:id/assign-vehicle')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Assign a vehicle to a driver' })
    @ApiResponse({ status: 200, description: 'Vehicle assigned successfully' })
    async assignVehicle(
        @Param('id') driverId: string,
        @Body('vehicleId') vehicleId: string,
        @CurrentUser() currentUser: User
    ) {
        return this.ownerService.assignVehicle(driverId, vehicleId, currentUser.id);
    }

    @Delete('drivers/:id')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Remove a driver from owner\'s fleet' })
    @ApiResponse({ status: 200, description: 'Driver removed successfully' })
    async removeDriver(@Param('id') driverId: string, @CurrentUser() currentUser: User) {
        return this.ownerService.removeDriver(driverId, currentUser.id);
    }

    // ============= EARNINGS =============

    @Get('earnings/summary')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get earnings summary' })
    @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
    @ApiResponse({ status: 200, description: 'Earnings summary retrieved successfully' })
    async getEarningsSummary(
        @CurrentUser() currentUser: User,
        @Query('period') period?: 'week' | 'month' | 'quarter' | 'year'
    ) {
        return this.ownerService.getEarningsSummary(currentUser.id, period);
    }

    @Get('earnings/by-cab')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get earnings breakdown by cab' })
    @ApiResponse({ status: 200, description: 'Earnings by cab retrieved successfully' })
    async getEarningsByCab(@CurrentUser() currentUser: User) {
        return this.ownerService.getEarningsByCab(currentUser.id);
    }

    @Get('earnings/monthly')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get monthly earnings data' })
    @ApiQuery({ name: 'months', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Monthly earnings retrieved successfully' })
    async getMonthlyEarnings(
        @CurrentUser() currentUser: User,
        @Query('months') months?: number
    ) {
        return this.ownerService.getMonthlyEarnings(currentUser.id, months);
    }

    @Get('transactions')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get owner transactions' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
    async getTransactions(
        @CurrentUser() currentUser: User,
        @Query('limit') limit?: number
    ) {
        return this.ownerService.getTransactions(currentUser.id, limit);
    }

    // ============= CONTRACTS =============

    @Get('contracts')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get all contracts' })
    @ApiQuery({ name: 'type', required: false, enum: ['driver', 'platform', 'insurance'] })
    @ApiQuery({ name: 'status', required: false, enum: ['active', 'expiring', 'expired', 'pending'] })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Contracts retrieved successfully' })
    async getContracts(
        @CurrentUser() currentUser: User,
        @Query('type') type?: 'driver' | 'platform' | 'insurance',
        @Query('status') status?: 'active' | 'expiring' | 'expired' | 'pending',
        @Query('search') search?: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number
    ) {
        return this.ownerService.getContracts(currentUser.id, { type, status, search, limit, offset });
    }

    @Get('contracts/:id')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get a specific contract' })
    @ApiResponse({ status: 200, description: 'Contract retrieved successfully' })
    async getContract(@Param('id') id: string, @CurrentUser() currentUser: User) {
        return this.ownerService.getContract(id, currentUser.id);
    }

    @Post('contracts')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Create a new contract' })
    @ApiResponse({ status: 201, description: 'Contract created successfully' })
    async createContract(@Body() data: any, @CurrentUser() currentUser: User) {
        return this.ownerService.createContract(currentUser.id, data);
    }

    @Patch('contracts/:id')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Update a contract' })
    @ApiResponse({ status: 200, description: 'Contract updated successfully' })
    async updateContract(
        @Param('id') id: string,
        @Body() data: any,
        @CurrentUser() currentUser: User
    ) {
        return this.ownerService.updateContract(id, currentUser.id, data);
    }

    @Patch('contracts/:id/renew')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Renew a contract' })
    @ApiResponse({ status: 200, description: 'Contract renewed successfully' })
    async renewContract(
        @Param('id') id: string,
        @Body('endDate') endDate: string,
        @CurrentUser() currentUser: User
    ) {
        return this.ownerService.renewContract(id, currentUser.id, endDate);
    }

    @Patch('contracts/:id/terminate')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Terminate a contract' })
    @ApiResponse({ status: 200, description: 'Contract terminated successfully' })
    async terminateContract(
        @Param('id') id: string,
        @Body('reason') reason: string,
        @CurrentUser() currentUser: User
    ) {
        return this.ownerService.terminateContract(id, currentUser.id, reason);
    }

    // ============= SETTINGS =============

    @Get('business')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get business info' })
    @ApiResponse({ status: 200, description: 'Business info retrieved successfully' })
    async getBusinessInfo(@CurrentUser() currentUser: User) {
        return this.ownerService.getBusinessInfo(currentUser.id);
    }

    @Patch('business')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Update business info' })
    @ApiResponse({ status: 200, description: 'Business info updated successfully' })
    async updateBusinessInfo(@Body() data: any, @CurrentUser() currentUser: User) {
        return this.ownerService.updateBusinessInfo(currentUser.id, data);
    }

    @Get('settings')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Get owner settings' })
    @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
    async getSettings(@CurrentUser() currentUser: User) {
        return this.ownerService.getSettings(currentUser.id);
    }

    @Patch('settings')
    @Roles(UserRole.CAB_OWNER)
    @ApiOperation({ summary: 'Update owner settings' })
    @ApiResponse({ status: 200, description: 'Settings updated successfully' })
    async updateSettings(@Body() data: any, @CurrentUser() currentUser: User) {
        return this.ownerService.updateSettings(currentUser.id, data);
    }
}
