import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SavedAddress,
  RecentDestination,
  PaymentMethod,
  Wallet,
  Transaction,
} from './entities';
import { Payment } from '../payments/entities/payment.entity';
import {
  CustomerLoyalty,
  CustomerLoyaltySchema,
} from './schemas/customer-loyalty.schema';
import { UsersService } from './users.service';
import { LoyaltyService } from './services/loyalty.service';
import { UsersController } from './users.controller';
import { LoyaltyController } from './controllers/loyalty.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavedAddress,
      RecentDestination,
      PaymentMethod,
      Wallet,
      Transaction,
      Payment,
    ]),
    MongooseModule.forFeature([
      { name: CustomerLoyalty.name, schema: CustomerLoyaltySchema },
    ]),
  ],
  controllers: [UsersController, LoyaltyController],
  providers: [UsersService, LoyaltyService],
  exports: [UsersService, LoyaltyService],
})
export class UsersModule {}
