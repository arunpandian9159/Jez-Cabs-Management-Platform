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

  // CORS - Support multiple origins for development and production
  const corsOrigins = configService.get('CORS_ORIGIN', 'http://localhost:5173');
  const origins = corsOrigins.split(',').map((origin: string) => origin.trim());

  app.enableCors({
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: configService.get('CORS_CREDENTIALS', 'true') === 'true',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
      .setTitle(
        configService.get('SWAGGER_TITLE', 'Jez Cabs Management Platform API'),
      )
      .setDescription(
        `## Jez Cabs Management Platform API

A comprehensive REST API for multi-tenant cab rental and ride-hailing management.

### Features
- **Authentication**: JWT-based auth with role-based access control
- **Trip Management**: Complete trip lifecycle from booking to completion
- **Fleet Management**: Vehicle CRUD, status updates, driver assignments
- **Driver Operations**: Onboarding, document verification, earnings
- **Owner Portal**: Fleet oversight, contracts, analytics
- **Admin Dashboard**: User management, verifications, reports
- **Safety**: Emergency contacts, SOS alerts
- **Community**: Ride-sharing and trip exchange

### Authentication
All protected endpoints require a JWT token in the Authorization header:
\`Authorization: Bearer <your_jwt_token>\`

### Rate Limiting
- Registration: 3 requests/minute
- Login: 5 requests/minute
- General API: 10 requests/minute

### User Roles
- \`customer\`: Book rides, manage profile
- \`driver\`: Accept trips, manage earnings
- \`cab_owner\`: Manage fleet and drivers
- \`admin\`: Full platform access
- \`support\`: Handle disputes and queries
`,
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
      .addTag(
        'Authentication',
        'User authentication and authorization endpoints',
      )
      .addTag('Users', 'User profile, addresses, wallet, and payment methods')
      .addTag('Cabs', 'Vehicle fleet management endpoints')
      .addTag('Drivers', 'Driver profile, onboarding, and operations')
      .addTag('Owner', 'Cab owner portal - fleet, drivers, contracts, earnings')
      .addTag('Trips', 'Trip booking, tracking, and lifecycle management')
      .addTag('Rentals', 'Vehicle rental booking and management')
      .addTag('Disputes', 'Dispute filing and resolution')
      .addTag('Safety', 'Emergency contacts and SOS features')
      .addTag('Community', 'Community ride-sharing and trip exchange')
      .addTag('Admin', 'Administrative dashboard and verification')
      .addTag('Notifications', 'Push notifications and alerts')
      .addTag('Health', 'API health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = configService.get('SWAGGER_PATH', 'api/docs');
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(
      `📚 Swagger documentation available at: http://localhost:${configService.get('PORT', 3000)}/${swaggerPath}`,
    );
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
}

bootstrap();
