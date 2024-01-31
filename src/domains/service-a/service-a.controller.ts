import { Controller, Get } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { ServiceAService } from './service-a.service';

@Controller('service-a')
export class ServiceAController {
  constructor(private readonly serviceAService: ServiceAService) {}

  @OnEvent('startTask:ServiceA:processRun:TRIGGER')
  async handleStartTask(){
    await this.serviceAService.processTrigger();
  }
}
