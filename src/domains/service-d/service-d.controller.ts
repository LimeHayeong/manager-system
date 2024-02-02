import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDService } from './service-d.service';

@Controller('service-d')
export class ServiceDController {
    constructor(private readonly serviceDService: ServiceDService) {}

    @OnEvent('startTask:ServiceD:processRun:TRIGGER')
    async handleStartTask(){
        this.serviceDService.processTrigger();
    }
}
