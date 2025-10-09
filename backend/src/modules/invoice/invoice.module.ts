import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities';
import { Booking } from '../booking/entities';
import { InvoiceService } from './services';
import { InvoiceController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Booking])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}

