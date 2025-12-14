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
    AdminService,
    VerificationStats,
    VerificationFilters,
} from './admin.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Verification } from './entities/verification.entity';
import { VerificationStatus, UserRole } from '../../common/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPPORT)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('verifications')
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
    async getVerificationStats(): Promise<VerificationStats> {
        return this.adminService.getVerificationStats();
    }

    @Get('verifications/:id')
    async getVerification(@Param('id') id: string): Promise<Verification> {
        return this.adminService.getVerification(id);
    }

    @Patch('verifications/:id/approve')
    async approveVerification(
        @Param('id') id: string,
        @Body() body: { notes?: string },
        @Request() req: any,
    ): Promise<Verification> {
        return this.adminService.approveVerification(id, req.user.id, body.notes);
    }

    @Patch('verifications/:id/reject')
    async rejectVerification(
        @Param('id') id: string,
        @Body() body: { reason: string },
        @Request() req: any,
    ): Promise<Verification> {
        return this.adminService.rejectVerification(id, req.user.id, body.reason);
    }
}
