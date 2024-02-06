import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/util/file-logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceAController } from './service-a.controller';
import { ServiceAService } from './service-a.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceAService],
  controllers: [ServiceAController],
  exports: [ServiceAService]
})
export class ServiceAModule {}
