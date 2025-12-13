import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { SafetyService } from './safety.service';
import { SafetyController } from './safety.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyContact])],
  controllers: [SafetyController],
  providers: [SafetyService],
  exports: [SafetyService],
})
export class SafetyModule {}
