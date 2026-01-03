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
import {
  RidePreferences,
  RidePreferencesSchema,
} from './schemas/ride-preferences.schema';
import { UsersService } from './users.service';
import { LoyaltyService } from './services/loyalty.service';
import { PreferencesService } from './services/preferences.service';
import { UsersController } from './users.controller';
import { LoyaltyController } from './controllers/loyalty.controller';
import { PreferencesController } from './controllers/preferences.controller';

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
      { name: RidePreferences.name, schema: RidePreferencesSchema },
    ]),
  ],
  controllers: [UsersController, LoyaltyController, PreferencesController],
  providers: [UsersService, LoyaltyService, PreferencesService],
  exports: [UsersService, LoyaltyService, PreferencesService],
})
export class UsersModule {}
