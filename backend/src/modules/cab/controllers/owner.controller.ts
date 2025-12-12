import {
    Controller,
    Get,
    UseGuards,
    Param,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
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
}
