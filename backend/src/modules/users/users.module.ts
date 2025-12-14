import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SavedAddress,
  RecentDestination,
  PaymentMethod,
  Wallet,
  Transaction,
} from './entities';
import { Payment } from '../payments/entities/payment.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

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
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
