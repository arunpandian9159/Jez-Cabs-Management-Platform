import {
    Controller,
    Get,
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
import {
    AdminService,
    VerificationStats,
    VerificationFilters,
    UserWithStats,
    UserStats,
    DashboardStats,
} from './admin.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Verification } from './entities/verification.entity';
import { VerificationStatus, UserRole } from '../../common/enums';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPPORT)
@ApiBearerAuth('JWT-auth')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // ==================== Dashboard Stats ====================

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get platform-wide dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard stats returned' })
    @ApiResponse({ status: 403, description: 'Admin access required' })
    async getDashboardStats(): Promise<DashboardStats> {
        return this.adminService.getDashboardStats();
    }

    // ==================== User Management ====================

    @Get('users')
    @ApiOperation({ summary: 'Get all users with optional filtering' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by user status' })
    @ApiQuery({ name: 'role', required: false, description: 'Filter by user role' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of results' })
    @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset' })
    @ApiResponse({ status: 200, description: 'List of users returned' })
    async getUsers(
        @Query('status') status?: string,
        @Query('role') role?: string,
        @Query('search') search?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<UserWithStats[]> {
        const filters: any = {};
        if (status) filters.status = status;
        if (role) filters.role = role;
        if (search) filters.search = search;
        if (limit) filters.limit = parseInt(limit, 10);
        if (offset) filters.offset = parseInt(offset, 10);

        return this.adminService.getAllUsers(filters);
    }

    @Get('users/stats')
    @ApiOperation({ summary: 'Get user statistics by role and status' })
    @ApiResponse({ status: 200, description: 'User statistics returned' })
    async getUserStats(): Promise<UserStats> {
        return this.adminService.getUserStats();
    }

    // ==================== Verifications ====================

    @Get('verifications')
    @ApiOperation({ summary: 'Get verification requests with filtering' })
    @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'], description: 'Filter by verification status' })
    @ApiQuery({ name: 'type', required: false, enum: ['driver', 'cab_owner'], description: 'Filter by user type' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by name or document' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of results' })
    @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset' })
    @ApiResponse({ status: 200, description: 'List of verifications returned' })
    async getVerifications(
        @Query('status') status?: VerificationStatus,
        @Query('type') type?: 'driver' | 'cab_owner',
        @Query('search') search?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<Verification[]> {
        const filters: VerificationFilters = {};
        if (status) filters.status = status;
        if (type) filters.type = type;
        if (search) filters.search = search;
        if (limit) filters.limit = parseInt(limit, 10);
        if (offset) filters.offset = parseInt(offset, 10);

        return this.adminService.getVerifications(filters);
    }

    @Get('verifications/stats')
    @ApiOperation({ summary: 'Get verification statistics' })
    @ApiResponse({ status: 200, description: 'Verification statistics returned' })
    async getVerificationStats(): Promise<VerificationStats> {
        return this.adminService.getVerificationStats();
    }

    @Get('verifications/:id')
    @ApiOperation({ summary: 'Get a specific verification request' })
    @ApiParam({ name: 'id', description: 'Verification UUID' })
    @ApiResponse({ status: 200, description: 'Verification details returned' })
    @ApiResponse({ status: 404, description: 'Verification not found' })
    async getVerification(@Param('id') id: string): Promise<Verification> {
        return this.adminService.getVerification(id);
    }

    @Patch('verifications/:id/approve')
    @ApiOperation({ summary: 'Approve a verification request' })
    @ApiParam({ name: 'id', description: 'Verification UUID' })
    @ApiResponse({ status: 200, description: 'Verification approved' })
    @ApiResponse({ status: 404, description: 'Verification not found' })
    async approveVerification(
        @Param('id') id: string,
        @Body() body: { notes?: string },
        @Request() req: any,
    ): Promise<Verification> {
        return this.adminService.approveVerification(id, req.user.id, body.notes);
    }

    @Patch('verifications/:id/reject')
    @ApiOperation({ summary: 'Reject a verification request' })
    @ApiParam({ name: 'id', description: 'Verification UUID' })
    @ApiResponse({ status: 200, description: 'Verification rejected' })
    @ApiResponse({ status: 404, description: 'Verification not found' })
    async rejectVerification(
        @Param('id') id: string,
        @Body() body: { reason: string },
        @Request() req: any,
    ): Promise<Verification> {
        return this.adminService.rejectVerification(id, req.user.id, body.reason);
    }
}
