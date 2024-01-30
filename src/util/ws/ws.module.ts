import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  providers: [WsService, WsGateway],
  exports: [WsService, WsGateway]
})
export class WsModule {}
