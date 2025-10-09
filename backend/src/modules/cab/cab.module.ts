import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cab } from './entities';
import { CabService } from './services';
import { CabController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Cab])],
  controllers: [CabController],
  providers: [CabService],
  exports: [CabService],
})
export class CabModule {}

