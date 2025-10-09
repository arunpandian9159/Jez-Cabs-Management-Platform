import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities';
import { Cab } from '../cab/entities';
import { Driver } from '../driver/entities';
import { BookingService } from './services';
import { BookingController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Cab, Driver])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

