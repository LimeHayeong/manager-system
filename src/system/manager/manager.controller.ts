import { Body, Controller, Get, Post, Req, Res, UseFilters } from '@nestjs/common';

import { ManagerService } from './manager.service';
import { Task } from '../../util/types/task';
import { ApiError, ApiResponse } from '../../util/types/response';
import { HttpExceptionFilter } from '../../util/filter/http.exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) {}


    @Post('/start')
    controlStartTask(@Req() req, @Res() res, @Body() data: Task.ITaskIdentity) {
        this.managerService.controlStartTask(data);
        const response: ApiResponse = {
            success: true,
            statusCode: 200,
            message: `${data.domain}:${data.task}:${data.taskType} 시작에 성공했습니다.`
        }
        res.status(response.statusCode).json(response)
    }

    @Post('/stop')
    controlStopTask(@Req() req, @Res() res, @Body() data: Task.ITaskIdentity) {
        this.managerService.controlStopTask(data);
        const response: ApiResponse = {
            success: true,
            statusCode: 200,
            message: `${data.domain}:${data.task}:${data.taskType} 종료에 성공했습니다.`
        }
        res.status(response.statusCode).json(response)
    }


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
