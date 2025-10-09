import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist, ChecklistSchema } from './schemas/checklist.schema';
import { ChecklistTemplate, ChecklistTemplateSchema } from './schemas/checklist-template.schema';
import { Cab } from '../cab/entities';
import { Booking } from '../booking/entities';
import { ChecklistService } from './services';
import { ChecklistController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checklist.name, schema: ChecklistSchema },
      { name: ChecklistTemplate.name, schema: ChecklistTemplateSchema },
    ]),
    TypeOrmModule.forFeature([Cab, Booking]),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}

