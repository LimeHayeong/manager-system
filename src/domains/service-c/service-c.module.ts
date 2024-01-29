import { Module } from '@nestjs/common';
import { ServiceCService } from './service-c.service';

@Module({
  providers: [ServiceCService],
})
export class ServiceCModule {}
