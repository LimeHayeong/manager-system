import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileLoggerModule } from './util/file-logger/logger.module';
import { ManagerModule } from './util/manager/manager.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServiceAModule } from './domains/service-a/service-a.module';
import { ServiceBModule } from './domains/service-b/service-b.module';
import { ServiceCModule } from './domains/service-c/service-c.module';
import { ServiceDModule } from './domains/service-d/service-d.module';
import { WsModule } from './util/ws/ws.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ServiceAModule, ServiceBModule, ServiceCModule, ServiceDModule, WsModule, ManagerModule, FileLoggerModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
