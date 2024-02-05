import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/system/file-logger/logger.module';
import { ManagerModule } from 'src/system/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceBController } from './service-b.controller';
import { ServiceBService } from './service-b.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceBService],
  controllers: [ServiceBController],
})
export class ServiceBModule {}
