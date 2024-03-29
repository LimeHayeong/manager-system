import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/util/file-logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceCHelper } from './service-c.helper';
import { ServiceCService } from './service-c.service';
import { ServiceCController } from './service-c.controller';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceCService, ServiceCHelper],
  controllers: [ServiceCController],
})
export class ServiceCModule {}
