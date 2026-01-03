import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, CompanyEmployee } from './entities';
// Service and controller will be added as implementation progresses

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyEmployee])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CorporateModule {}
