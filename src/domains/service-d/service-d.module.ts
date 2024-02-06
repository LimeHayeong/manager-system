import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/util/file-logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceDController } from './service-d.controller';
import { ServiceDService } from './service-d.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceDService],
  controllers: [ServiceDController],
  exports: [ServiceDService]
})
export class ServiceDModule {}
