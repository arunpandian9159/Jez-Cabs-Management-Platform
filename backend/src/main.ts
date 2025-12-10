import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const expressApp = express();
let cachedApp: INestApplication<any> | null = null;

async function createApp(): Promise<INestApplication<any>> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] }
  );
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS - Allow all origins for Vercel deployment
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  if (configService.get('SWAGGER_ENABLED', 'true') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE', 'Jez Cabs Management Platform API'))
      .setDescription(
        configService.get(
          'SWAGGER_DESCRIPTION',
          'Comprehensive API for multi-tenant cab rental management',
        ),
      )
      .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'User authentication and authorization endpoints')
      .addTag('Companies', 'Company management endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Cabs', 'Vehicle fleet management endpoints')
      .addTag('Drivers', 'Driver management endpoints')
      .addTag('Bookings', 'Booking and rental management endpoints')
      .addTag('Checklists', 'Maintenance checklist endpoints')
      .addTag('Invoices', 'Invoice and payment endpoints')
      .addTag('Telematics', 'GPS tracking and telematics endpoints')
      .addTag('Analytics', 'Analytics and reporting endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = configService.get('SWAGGER_PATH', 'api/docs');
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.init();
  cachedApp = app;
  return app;
}

// For local development
async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  const apiPrefix = configService.get('API_PREFIX', 'api');

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
}

// Check if running on Vercel (serverless) or locally
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  bootstrap();
}

// Export handler for Vercel Serverless
module.exports = async (req: any, res: any) => {
  try {
    await createApp();
    expressApp(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Also export as default for ESM compatibility
export default module.exports;
