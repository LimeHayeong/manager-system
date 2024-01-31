import { Module } from '@nestjs/common';
import { ServiceDService } from './service-d.service';

@Module({
  providers: [ServiceDService],
})
export class ServiceDModule {}
