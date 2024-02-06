import { Injectable } from '@nestjs/common';
import { ServiceAService } from './domains/service-a/service-a.service';
import { ServiceBService } from './domains/service-b/service-b.service';
import { ServiceCService } from './domains/service-c/service-c.service';
import { ServiceDService } from './domains/service-d/service-d.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AppService {
  constructor(
    private readonly serviceAService: ServiceAService,
    private readonly serviceBService: ServiceBService,
    private readonly serviceCService: ServiceCService,
    private readonly serviceDService: ServiceDService,
  ) {}

  // TODO: WORK 만들기
  public async triggerWorkA() {
    // const WorkHelper = new WorkHelper(this.managerService, this.fileLoggerService);



    await this.serviceAService.processTrigger();
    await this.serviceBService.processTrigger();
    await this.serviceCService.processTrigger();
    await this.serviceDService.processTrigger();
  }
}
