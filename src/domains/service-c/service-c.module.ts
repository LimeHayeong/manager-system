import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/system/file-logger/logger.module';
import { ManagerModule } from 'src/system/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceCController } from './service-c.controller';
import { ServiceCHelper } from './service-c.helper';
import { ServiceCService } from './service-c.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceCService, ServiceCHelper],
  controllers: [ServiceCController],
})
export class ServiceCModule {}
