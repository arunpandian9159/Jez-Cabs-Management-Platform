import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityTrip } from './entities/community-trip.entity';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CommunityTrip])],
    controllers: [CommunityController],
    providers: [CommunityService],
    exports: [CommunityService],
})
export class CommunityModule { }
