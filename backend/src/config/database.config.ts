import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    // Support Supabase DATABASE_URL connection string
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      // Parse Supabase connection URL
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        logging: process.env.DATABASE_LOGGING === 'true',
        migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          // Supabase pooler configuration
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
          max: 20,
        },
      };
    }

    // Fallback to individual environment variables (legacy support)
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'jezcabs',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      logging: process.env.DATABASE_LOGGING === 'true',
      migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
      migrationsRun: false,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  },
);

