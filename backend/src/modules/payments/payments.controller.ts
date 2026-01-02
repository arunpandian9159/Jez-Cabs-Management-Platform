import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import {
  CreateOrderDto,
  VerifyPaymentDto,
  ProcessRefundDto,
  WalletTopupDto,
  PaymentHistoryQueryDto,
} from './dto';

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order for payment' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async createOrder(@Request() req: AuthRequest, @Body() dto: CreateOrderDto) {
    const result = await this.paymentsService.createOrder(req.user.sub, dto);
    return {
      success: true,
      data: {
        order_id: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        payment_id: result.payment.id,
      },
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  @ApiResponse({ status: 400, description: 'Payment verification failed' })
  async verifyPayment(
    @Request() req: AuthRequest,
    @Body() dto: VerifyPaymentDto,
  ) {
    const payment = await this.paymentsService.verifyPayment(req.user.sub, dto);
    return {
      success: true,
      data: payment,
      message: 'Payment verified successfully',
    };
  }

  @Post('refund')
  @ApiOperation({ summary: 'Process a refund for a payment' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  @ApiResponse({ status: 400, description: 'Refund failed' })
  async processRefund(
    @Request() req: AuthRequest,
    @Body() dto: ProcessRefundDto,
  ) {
    const payment = await this.paymentsService.processRefund(req.user.sub, dto);
    return {
      success: true,
      data: payment,
      message: 'Refund processed successfully',
    };
  }

  @Post('wallet/topup')
  @ApiOperation({ summary: 'Create order for wallet top-up' })
  @ApiResponse({ status: 201, description: 'Top-up order created' })
  async createWalletTopup(
    @Request() req: AuthRequest,
    @Body() dto: WalletTopupDto,
  ) {
    const result = await this.paymentsService.createWalletTopupOrder(
      req.user.sub,
      dto,
    );
    return {
      success: true,
      data: {
        order_id: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        payment_id: result.payment.id,
      },
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  @ApiResponse({ status: 200, description: 'Payment history retrieved' })
  async getHistory(
    @Request() req: AuthRequest,
    @Query() query: PaymentHistoryQueryDto,
  ) {
    const payments = await this.paymentsService.findAll(req.user.sub, query);
    return {
      success: true,
      data: payments,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payment statistics' })
  @ApiResponse({ status: 200, description: 'Payment stats retrieved' })
  async getStats(@Request() req: AuthRequest) {
    const stats = await this.paymentsService.getStats(req.user.sub);
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id, req.user.sub);
    return {
      success: true,
      data: payment,
    };
  }
}
