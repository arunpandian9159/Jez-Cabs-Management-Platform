import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelematicsLog, TelematicsLogSchema } from './schemas';
import { Cab } from '../cab/entities';
import { TelematicsService } from './services';
import { TelematicsController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TelematicsLog.name, schema: TelematicsLogSchema },
    ]),
    TypeOrmModule.forFeature([Cab]),
  ],
  controllers: [TelematicsController],
  providers: [TelematicsService],
  exports: [TelematicsService],
})
export class TelematicsModule {}

