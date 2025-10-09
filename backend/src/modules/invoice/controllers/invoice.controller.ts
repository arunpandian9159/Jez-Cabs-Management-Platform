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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceService } from '../services';
import { CreateInvoiceDto, UpdateInvoiceDto, FilterInvoiceDto } from '../dto';
import { CurrentUser, Roles } from '../../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../iam/guards';
import { User } from '../../iam/entities';
import { UserRole, InvoiceStatus } from '../../../common/enums';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() currentUser: User) {
    return this.invoiceService.create(createInvoiceDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async findAll(@Query() filterDto: FilterInvoiceDto, @CurrentUser() currentUser: User) {
    return this.invoiceService.findAll(filterDto, currentUser);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get invoice statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@CurrentUser() currentUser: User) {
    return this.invoiceService.getStatistics(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.invoiceService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.invoiceService.update(id, updateInvoiceDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.invoiceService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.invoiceService.remove(id, currentUser);
  }
}

