import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'src/util/logger/logger.module';
import { ManagerModule } from 'src/util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ServiceAController } from './service-a.controller';
import { ServiceAService } from './service-a.service';

@Module({
  imports: [ClsModule, LoggerModule, ManagerModule],
  providers: [ServiceAService],
  controllers: [ServiceAController],
})
export class ServiceAModule {}
