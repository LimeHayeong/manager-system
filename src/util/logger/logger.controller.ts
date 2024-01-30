import { Controller, Get } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) {}

    @Get('buffer')
    public getBuffer() {
        return this.loggerService.getBuffer();
    }
}
