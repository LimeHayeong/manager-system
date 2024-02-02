import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceBService } from './service-b.service';

@Controller('service-b')
export class ServiceBController {
    constructor(private readonly serviceBService: ServiceBService) {}

    @OnEvent('startTask:ServiceB:processRun:TRIGGER')
    async handleStartTask(){
        this.serviceBService.processTrigger();
    }
}
