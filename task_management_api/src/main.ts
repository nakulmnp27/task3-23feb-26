import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));


const config = new DocumentBuilder()
    .setTitle('Contone API')
    .setDescription('API docs for Contone resource')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token as: Bearer <token>',
      },
      'access-token',
    )
    .build();    

  const document = SwaggerModule.createDocument(app, config);

const swaggerUiOptions = {
    swaggerOptions: {
      url: '/docs-json',
      authAction: {
        'access-token': {
          name: 'Authorization',
          schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          value: 'Bearer <JWT>',
        },
      },
    },
    customSiteTitle: 'Contone API Docs — UI: /docs | JSON: /docs-json',
    customCss:
      '.topbar { display: flex; align-items: center; gap: 12px } .topbar a { color: #fff }',
  };

  SwaggerModule.setup('docs', app, document, swaggerUiOptions);

  await app.listen(process.env.PORT ?? 3000);

  const baseUrl = await app.getUrl()
  const displayBaseUrl = baseUrl
    .replace(/\[::1\]/g, 'localhost')
    .replace(/::1/g, 'localhost')

  console.log(`Health Check: ${displayBaseUrl}/health`)
  console.log(`Health Check (DB): ${displayBaseUrl}/health/db`)
  console.log(`Swagger UI: ${displayBaseUrl}/docs`)
  console.log(`Swagger JSON: ${displayBaseUrl}/docs-json`)
  }
bootstrap();
