import { Module } from '@nestjs/common';
import { WsService } from './ws.service';

@Module({
  providers: [WsService],
})
export class WsModule {}
