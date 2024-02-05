import { ClsModule } from 'nestjs-cls';
import { FileLoggerModule } from 'src/system/file-logger/logger.module';
import { ManagerModule } from 'src/system/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceDController } from './service-d.controller';
import { ServiceDService } from './service-d.service';

@Module({
  imports: [ClsModule, FileLoggerModule, ManagerModule],
  providers: [ServiceDService],
  controllers: [ServiceDController],
})
export class ServiceDModule {}
