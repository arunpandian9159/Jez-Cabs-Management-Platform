import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChecklistService } from '../services';
import { CreateChecklistDto, UpdateChecklistDto, FilterChecklistDto, CreateTemplateDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole } from '../../../common/enums';

@ApiTags('Checklists')
@Controller('checklists')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new checklist' })
  @ApiResponse({ status: 201, description: 'Checklist created successfully' })
  @ApiResponse({ status: 404, description: 'Booking or cab not found' })
  async create(@Body() createChecklistDto: CreateChecklistDto, @CurrentUser() currentUser: User) {
    return this.checklistService.create(createChecklistDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all checklists with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Checklists retrieved successfully' })
  async findAll(@Query() filterDto: FilterChecklistDto, @CurrentUser() currentUser: User) {
    return this.checklistService.findAll(filterDto, currentUser);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get checklist statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.checklistService.getStatistics(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific checklist by ID' })
  @ApiResponse({ status: 200, description: 'Checklist retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Checklist not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.checklistService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update checklist details' })
  @ApiResponse({ status: 200, description: 'Checklist updated successfully' })
  @ApiResponse({ status: 400, description: 'Cannot update approved checklist' })
  @ApiResponse({ status: 404, description: 'Checklist not found' })
  async update(
    @Param('id') id: string,
    @Body() updateChecklistDto: UpdateChecklistDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.checklistService.update(id, updateChecklistDto, currentUser);
  }

  @Patch(':id/approve')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Approve a checklist (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Checklist approved successfully' })
  @ApiResponse({ status: 400, description: 'Cannot approve incomplete or already approved checklist' })
  @ApiResponse({ status: 404, description: 'Checklist not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async approve(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.checklistService.approve(id, currentUser);
  }

  @Patch(':id/reject')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Reject a checklist (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Checklist rejected successfully' })
  @ApiResponse({ status: 400, description: 'Cannot reject approved checklist' })
  @ApiResponse({ status: 404, description: 'Checklist not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.checklistService.reject(id, reason, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a checklist (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Checklist deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete approved checklist' })
  @ApiResponse({ status: 404, description: 'Checklist not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.checklistService.remove(id, currentUser);
  }

  // Template endpoints
  @Post('templates')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a checklist template (Owner and Manager only)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto, @CurrentUser() currentUser: User) {
    return this.checklistService.createTemplate(createTemplateDto, currentUser);
  }

  @Get('templates/all')
  @ApiOperation({ summary: 'Get all checklist templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAllTemplates(@CurrentUser() currentUser: User) {
    return this.checklistService.findAllTemplates(currentUser);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a specific template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOneTemplate(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.checklistService.findOneTemplate(id, currentUser);
  }

  @Delete('templates/:id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a template (Owner and Manager only)' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async removeTemplate(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.checklistService.removeTemplate(id, currentUser);
  }
}

