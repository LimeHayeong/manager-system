import { Controller, Get, UseFilters } from '@nestjs/common';

import { FileLoggerService } from './logger.service';
import { HttpExceptionFilter } from '../../util/filter/http.exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('logger')
export class FileLoggerController {
    constructor(private readonly loggerService: FileLoggerService) {}

    // for test
    @Get('buffer')
    public getBuffer() {
        return this.loggerService.getBuffer();
    }
}
