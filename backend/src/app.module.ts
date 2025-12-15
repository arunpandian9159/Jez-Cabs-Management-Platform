// Admin module added for verification management - v2
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import mongodbConfig from './config/mongodb.config';
import jwtConfig from './config/jwt.config';
import supabaseConfig from './config/supabase.config';
import { IamModule } from './modules/iam/iam.module';
import { UsersModule } from './modules/users/users.module';
import { CabModule } from './modules/cab/cab.module';
import { DriverModule } from './modules/driver/driver.module';
import { TripsModule } from './modules/trips/trips.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { SafetyModule } from './modules/safety/safety.module';
import { CommunityModule } from './modules/community/community.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
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
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
    }),

    // MongoDB Database
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongodb.uri'),
      }),
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

    // Rate Limiting (Throttler)
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 60 seconds
      limit: 10,   // 10 requests per minute default
    }]),

    // Feature Modules
    IamModule,
    UsersModule,
    CabModule,
    DriverModule,
    TripsModule,
    RentalsModule,
    DisputesModule,
    SafetyModule,
    CommunityModule,
    NotificationModule,
    AdminModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
