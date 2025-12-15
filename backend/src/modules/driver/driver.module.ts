import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfile } from './entities/driver-profile.entity';
import { DriverService } from './services';
import { DriverController } from './controllers';
import { Verification } from '../admin/entities/verification.entity';
import { User } from '../iam/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfile, Verification, User])],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule { }
