import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayGateway } from './gateway.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GatewayGateway],
})
export class AppModule {}
