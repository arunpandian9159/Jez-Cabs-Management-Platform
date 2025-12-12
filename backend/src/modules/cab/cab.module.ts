import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cab } from './entities';
import { User } from '../iam/entities';
import { DriverProfile } from '../driver/entities/driver-profile.entity';
import { CabService, OwnerService } from './services';
import { CabController, OwnerController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Cab, User, DriverProfile])],
  controllers: [CabController, OwnerController],
  providers: [CabService, OwnerService],
  exports: [CabService, OwnerService],
})
export class CabModule { }
