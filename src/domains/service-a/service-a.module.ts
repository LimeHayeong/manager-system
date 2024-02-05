import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/system/file-logger/logger.module';
import { ManagerModule } from 'src/system/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceAController } from './service-a.controller';
import { ServiceAService } from './service-a.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceAService],
  controllers: [ServiceAController],
})
export class ServiceAModule {}
