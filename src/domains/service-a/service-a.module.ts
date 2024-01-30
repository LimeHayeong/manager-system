import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/util/file-logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceAController } from './service-a.controller';
import { ServiceAService } from './service-a.service';
import { WsModule } from 'src/util/ws/ws.module';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule, WsModule],
  providers: [ServiceAService],
  controllers: [ServiceAController],
})
export class ServiceAModule {}
