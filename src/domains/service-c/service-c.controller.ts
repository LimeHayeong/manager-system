import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceCHelper } from './service-c.helper';
import { ServiceCService } from './service-c.service';

@Controller('service-c')
export class ServiceCController {
    constructor(private readonly serviceCService: ServiceCService,
        private readonly serviceCHelper: ServiceCHelper) {}

    @OnEvent('startTask:ServiceC:processRun:TRIGGER')
    async handleStartTask(){
        await this.serviceCService.processTrigger();
    }

    @OnEvent('startTask:ServiceC:processHelper:TRIGGER')
    async handleStartHelperTask(){
        await this.serviceCHelper.processTrigger();
    }
}
