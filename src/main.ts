import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function Main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe)

  const config = new DocumentBuilder()
      .setTitle('DevEvent❤')
      .setDescription('The DevEvent API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8888);
}
Main();
