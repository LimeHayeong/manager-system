import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/util/file-logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceBService } from './service-b.service';
import { ServiceBController } from './service-b.controller';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceBService],
  controllers: [ServiceBController],
})
export class ServiceBModule {}
