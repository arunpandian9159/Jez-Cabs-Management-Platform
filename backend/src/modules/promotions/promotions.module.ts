import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCode, Referral } from './entities';
// Service and controller will be added as implementation progresses

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, Referral])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PromotionsModule {}
