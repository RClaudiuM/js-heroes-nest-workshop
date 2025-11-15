import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function configureSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JS Heroes API')
    .setDescription('This is a nice description of the API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    // .addBearerAuth(
    //   {
    //     type: 'apiKey',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     in: 'header',
    //   },
    //   'mat',
    // )
    .addSecurityRequirements('token')
    // .addSecurityRequirements('mat')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
