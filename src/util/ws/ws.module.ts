import { ManagerModule } from '../manager/manager.module';
import { ManagerService } from '../manager/manager.service';
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  providers: [WsService, WsGateway],
  exports: [WsService, WsGateway]
})
export class WsModule {}
