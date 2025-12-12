import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cab } from './entities';
import { User } from '../iam/entities';
import { DriverProfile } from '../driver/entities/driver-profile.entity';
import { CabOwnerProfile } from '../iam/entities/cab-owner-profile.entity';
import { Trip } from '../trips/entities/trip.entity';
import { CabService, OwnerService } from './services';
import { CabController, OwnerController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Cab, User, DriverProfile, CabOwnerProfile, Trip])],
  controllers: [CabController, OwnerController],
  providers: [CabService, OwnerService],
  exports: [CabService, OwnerService],
})
export class CabModule { }
