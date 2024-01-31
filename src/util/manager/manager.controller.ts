import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import { ManagerService } from './manager.service';
import { Task } from '../types/task';
import { ApiError, ApiResponse } from '../types/response';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) {}


    @Post('/start')
    controlStartTask(@Req() req, @Res() res, @Body() data: Task.ITaskIdentity) {
        console.log('controlStartTask')
        const success = this.managerService.controlStartTask(data);
        let response: ApiResponse | ApiError;
        if(success){
            response = {
                success: true,
                statusCode: 200,
                message: `${data.domain}:${data.task}:${data.taskType} 시작에 성공했습니다.`
            }
        }else{
            response = {
                success: false,
                statusCode: 400,
                message: `${data.domain}:${data.task}:${data.taskType} 이미 실행중입니다.`,
            }
        }
        res.status(response.statusCode).json(response)
    }

    @Post('/stop')
    controlStopTask(@Req() req, @Res() res, @Body() data: Task.ITaskIdentity) {
        console.log('controlStopTask')
        const success = this.managerService.controlStopTask(data);
        let response: ApiResponse | ApiError;
        if(success){
            response = {
                success: true,
                statusCode: 200,
                message: `${data.domain}:${data.task}:${data.taskType} 종료에 성공했습니다. 이번 동작까지만 실행합니다.`
            }
        }else{
            response = {
                success: false,
                statusCode: 400,
                message: `${data.domain}:${data.task}:${data.taskType}가 이미 종료되었습니다.(terminated)`
            }
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
