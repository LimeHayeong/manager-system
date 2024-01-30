import { Controller, Get } from '@nestjs/common';

import { FileLoggerService } from './logger.service';

@Controller('logger')
export class FileLoggerController {
    constructor(private readonly loggerService: FileLoggerService) {}

    @Get('buffer')
    public getBuffer() {
        return this.loggerService.getBuffer();
    }
}
