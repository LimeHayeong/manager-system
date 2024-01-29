import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule {}
