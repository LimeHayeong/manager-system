import { Module } from '@nestjs/common';
import { ServiceBService } from './service-b.service';

@Module({
  providers: [ServiceBService],
})
export class ServiceBModule {}
