import { Controller, Get } from '@nestjs/common';

import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) {}

    // for test
    @Get('taskStates')
    public getTaskStates() {
        return this.managerService.getTaskStates();
    }

    // for test
    @Get('taskStatesNoLogs')
    public getTaskStatesNoLogs() {
        return this.managerService.getTaskStatesNoLogswithLength();
    }
}
