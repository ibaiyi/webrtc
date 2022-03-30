import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import express from 'express';

async function bootstrap() {
  const fs = require('fs')
  const httpsOptions = {
    key: fs.readFileSync('./public/turn_server_pkey.pem'),
    cert: fs.readFileSync('./public/turn_server_cert.pem'),
  };
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, { httpsOptions}
  );

  const logger: Logger = new Logger(bootstrap.name);



  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');


  const config = new DocumentBuilder()
    .setTitle('DCC Gateway')
    .setDescription('DCC网关，包含HTTP和Websocket')
    .setVersion('1.0')
    .addTag('gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const server:any = await app.listen(3000);

  logger.debug(`Application is running on: ${await app.getUrl()}`);






}
bootstrap();