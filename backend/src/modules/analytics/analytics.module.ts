import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cab } from '../cab/entities';
import { Driver } from '../driver/entities';
import { Booking } from '../booking/entities';
import { Invoice } from '../invoice/entities';
import { AnalyticsService } from './services';
import { AnalyticsController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Cab, Driver, Booking, Invoice])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

