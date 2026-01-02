import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { RecurringRide } from './entities/recurring-ride.entity';
import { TripsService } from './trips.service';
import { FareEstimationService } from './services/fare-estimation.service';
import { GeofenceService } from './services/geofence.service';
import { TripsController } from './trips.controller';
import { FareController } from './controllers/fare.controller';
import { MapsController } from './controllers/maps.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, RecurringRide]), UsersModule],
  controllers: [TripsController, FareController, MapsController],
  providers: [TripsService, FareEstimationService, GeofenceService],
  exports: [TripsService, FareEstimationService, GeofenceService],
})
export class TripsModule {}
