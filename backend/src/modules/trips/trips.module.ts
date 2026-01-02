import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { RecurringRide } from './entities/recurring-ride.entity';
import { TripsService } from './trips.service';
import { FareEstimationService } from './services/fare-estimation.service';
import { TripsController } from './trips.controller';
import { FareController } from './controllers/fare.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, RecurringRide]), UsersModule],
  controllers: [TripsController, FareController],
  providers: [TripsService, FareEstimationService],
  exports: [TripsService, FareEstimationService],
})
export class TripsModule {}
