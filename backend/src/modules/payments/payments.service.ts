import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Payment } from './entities/payment.entity';
import { PaymentStatus, PaymentMethod } from '../../common/enums';
import {
  CreateOrderDto,
  VerifyPaymentDto,
  ProcessRefundDto,
  WalletTopupDto,
} from './dto';

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

interface RazorpayRefund {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: string;
}

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    // Initialize Razorpay client
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  /**
   * Create a Razorpay order for payment
   */
  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<{ order: RazorpayOrder; payment: Payment }> {
    if (!this.razorpay) {
      throw new InternalServerErrorException(
        'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      );
    }

    try {
      // Create Razorpay order
      const order = await this.razorpay.orders.create({
        amount: dto.amount,
        currency: dto.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          user_id: userId,
          trip_id: dto.trip_id || '',
          rental_id: dto.rental_id || '',
          description: dto.notes || '',
        },
      });

      // Create payment record in pending state
      const payment = this.paymentRepository.create({
        payer_id: userId,
        amount: dto.amount / 100, // Convert paise to rupees for storage
        payment_method: PaymentMethod.CARD, // Will be updated after verification
        status: PaymentStatus.PENDING,
        trip_id: dto.trip_id || null,
        rental_id: dto.rental_id || null,
        transaction_id: order.id,
        gateway_response: { order_id: order.id },
      });

      await this.paymentRepository.save(payment);

      return { order: order as RazorpayOrder, payment };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Verify Razorpay payment signature and complete payment
   */
  async verifyPayment(userId: string, dto: VerifyPaymentDto): Promise<Payment> {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      throw new InternalServerErrorException('Payment gateway not configured');
    }

    // Find the payment record
    const payment = await this.paymentRepository.findOne({
      where: { transaction_id: dto.razorpay_order_id, payer_id: userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpay_signature) {
      payment.status = PaymentStatus.FAILED;
      payment.gateway_response = {
        ...payment.gateway_response,
        error: 'Signature verification failed',
      };
      await this.paymentRepository.save(payment);
      throw new BadRequestException('Payment verification failed');
    }

    // Update payment as completed
    payment.status = PaymentStatus.COMPLETED;
    payment.paid_at = new Date();
    payment.gateway_response = {
      ...payment.gateway_response,
      payment_id: dto.razorpay_payment_id,
      verified_at: new Date().toISOString(),
    };

    await this.paymentRepository.save(payment);

    // Emit payment completed event
    this.eventEmitter.emit('payment.completed', {
      payment,
      userId,
    });

    return payment;
  }

  /**
   * Process a refund for a payment
   */
  async processRefund(userId: string, dto: ProcessRefundDto): Promise<Payment> {
    if (!this.razorpay) {
      throw new InternalServerErrorException('Payment gateway not configured');
    }

    const payment = await this.paymentRepository.findOne({
      where: { id: dto.payment_id, payer_id: userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const razorpayPaymentId = payment.gateway_response?.payment_id;
    if (!razorpayPaymentId) {
      throw new BadRequestException('No Razorpay payment ID found');
    }

    try {
      const refundAmount = dto.amount || payment.amount * 100; // Convert to paise

      const refund = await this.razorpay.payments.refund(razorpayPaymentId, {
        amount: refundAmount,
        notes: { reason: dto.reason },
      });

      payment.status = PaymentStatus.REFUNDED;
      payment.gateway_response = {
        ...payment.gateway_response,
        refund: refund as RazorpayRefund,
        refund_reason: dto.reason,
        refunded_at: new Date().toISOString(),
      };

      await this.paymentRepository.save(payment);

      // Emit refund event
      this.eventEmitter.emit('payment.refunded', {
        payment,
        userId,
        reason: dto.reason,
      });

      return payment;
    } catch (error) {
      throw new BadRequestException(
        `Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Create order for wallet top-up
   */
  async createWalletTopupOrder(
    userId: string,
    dto: WalletTopupDto,
  ): Promise<{ order: RazorpayOrder; payment: Payment }> {
    return this.createOrder(userId, {
      amount: dto.amount,
      notes: 'Wallet Top-up',
    });
  }

  /**
   * Get payment by ID
   */
  async findOne(id: string, userId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id, payer_id: userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  /**
   * Get payment history for a user
   */
  async findAll(
    userId: string,
    options: { status?: string; limit?: number; offset?: number } = {},
  ): Promise<Payment[]> {
    const { status, limit = 20, offset = 0 } = options;

    const whereClause: Record<string, unknown> = { payer_id: userId };
    if (status) {
      whereClause.status = status;
    }

    return this.paymentRepository.find({
      where: whereClause,
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get payments for a specific trip
   */
  async findByTrip(tripId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { trip_id: tripId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Get payment statistics for a user
   */
  async getStats(userId: string): Promise<{
    totalPaid: number;
    totalRefunded: number;
    pendingPayments: number;
  }> {
    const payments = await this.paymentRepository.find({
      where: { payer_id: userId },
    });

    return {
      totalPaid: payments
        .filter((p) => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0),
      totalRefunded: payments
        .filter((p) => p.status === PaymentStatus.REFUNDED)
        .reduce((sum, p) => sum + Number(p.amount), 0),
      pendingPayments: payments.filter(
        (p) => p.status === PaymentStatus.PENDING,
      ).length,
    };
  }
}
