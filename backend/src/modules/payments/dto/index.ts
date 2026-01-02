import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Amount in paise (e.g., 10000 for ₹100)' })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code (default: INR)' })
  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @ApiPropertyOptional({ description: 'Associated trip ID' })
  @IsOptional()
  @IsUUID()
  trip_id?: string;

  @ApiPropertyOptional({ description: 'Associated rental ID' })
  @IsOptional()
  @IsUUID()
  rental_id?: string;

  @ApiPropertyOptional({ description: 'Payment notes/description' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Razorpay order ID' })
  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @ApiProperty({ description: 'Razorpay payment ID' })
  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({ description: 'Razorpay signature for verification' })
  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;
}

export class ProcessRefundDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsNotEmpty()
  @IsUUID()
  payment_id: string;

  @ApiPropertyOptional({
    description: 'Refund amount in paise (full refund if not specified)',
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  amount?: number;

  @ApiProperty({ description: 'Reason for refund' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class WalletTopupDto {
  @ApiProperty({ description: 'Top-up amount in paise' })
  @IsNumber()
  @Min(100)
  amount: number;
}

export enum PaymentPurpose {
  TRIP = 'trip',
  RENTAL = 'rental',
  WALLET_TOPUP = 'wallet_topup',
}

export class PaymentHistoryQueryDto {
  @ApiPropertyOptional({ description: 'Filter by payment status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Limit number of results' })
  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Offset for pagination' })
  @IsOptional()
  @IsNumber()
  offset?: number = 0;
}
