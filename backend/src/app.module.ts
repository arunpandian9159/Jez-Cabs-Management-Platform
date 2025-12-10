import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import mongodbConfig from './config/mongodb.config';
import jwtConfig from './config/jwt.config';
import supabaseConfig from './config/supabase.config';
import { IamModule } from './modules/iam/iam.module';
import { CabModule } from './modules/cab/cab.module';
import { DriverModule } from './modules/driver/driver.module';
import { BookingModule } from './modules/booking/booking.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TelematicsModule } from './modules/telematics/telematics.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SupabaseModule } from './common/supabase.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, mongodbConfig, jwtConfig, supabaseConfig],
      envFilePath: '.env',
    }),

    // Supabase Module (for Supabase client operations)
    SupabaseModule,

    // Supabase PostgreSQL Database (via TypeORM)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database')!,
    }),

    // MongoDB Database
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ uri: configService.get('mongodb.uri'), }),
    }),

    // Event Emitter for event-driven architecture
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // Feature Modules
    IamModule,
    CabModule,
    DriverModule,
    BookingModule,
    ChecklistModule,
    InvoiceModule,
    TelematicsModule,
    AnalyticsModule,
    NotificationModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
