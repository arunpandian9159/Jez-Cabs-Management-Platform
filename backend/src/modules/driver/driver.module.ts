import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfile } from './entities/driver-profile.entity';
import { DriverIncentive } from './entities/driver-incentive.entity';
import { DriverService } from './services';
import { IncentivesService } from './services/incentives.service';
import { DriverController } from './controllers';
import { IncentivesController } from './controllers/incentives.controller';
import { Verification } from '../admin/entities/verification.entity';
import { User } from '../iam/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DriverProfile,
      DriverIncentive,
      Verification,
      User,
    ]),
  ],
  controllers: [DriverController, IncentivesController],
  providers: [DriverService, IncentivesService],
  exports: [DriverService, IncentivesService],
})
export class DriverModule {}
