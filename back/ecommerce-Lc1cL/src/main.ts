import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const PORT = process.env.PORT || 3005;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist:true , transform: true })); 

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle('ecommercem4')
  .setDescription('Api construida con Nest para ser empleada como una plataforma de e-commerce del modulo 4 de Henry')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
  const document= SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT || 3005);
  console.log(`Server listening on port ${PORT}`)
}

bootstrap();