import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan, UserSubscription } from './entities';
// Service and controller will be added as implementation progresses

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, UserSubscription])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SubscriptionModule {}
