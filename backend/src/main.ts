import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: configService.get('CORS_CREDENTIALS', true),
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

    console.log(`📚 Swagger documentation available at: http://localhost:${configService.get('PORT', 3000)}/${swaggerPath}`);
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
