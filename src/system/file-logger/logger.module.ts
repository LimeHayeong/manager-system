import { FileLoggerController } from './logger.controller';
import { FileLoggerService } from './logger.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [FileLoggerService],
  controllers: [FileLoggerController],
  exports: [FileLoggerService],
})
export class FileLoggerModule {}
