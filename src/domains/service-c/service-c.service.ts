import { ClsService } from 'nestjs-cls';
import { FileLoggerService } from 'src/util/file-logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/types/task';
import { TaskHelper } from 'src/util/task-helper';
import { delay } from 'src/util/delay';
import { genereateRandomNumber } from 'src/util/random';

const opts = {
    domain: 'ServiceC',
    task: 'processRun',
}

@Injectable()
export class ServiceCService {
    constructor(
        private readonly clsService: ClsService,
        private readonly fileLoggerService: FileLoggerService,
        private readonly managerService: ManagerService,
    ) {}

    public async processTrigger() {
        this.clsService.run(async() => {
            try {
                this.clsService.set('TaskHelper', new TaskHelper(this.managerService, this.fileLoggerService))
                this.taskHelper().build(opts.domain, opts.task, Task.TaskType.TRIGGER);
                await this.processRun();
            } catch (e) {
                console.error(e);
            }
        })
    }
    
    // 5초에서 40초 걸리는 작업을 가정.
    private async processRun() {
        this.taskHelper().start();
        
        await delay(genereateRandomNumber(5, 40));

        this.taskHelper().end();
    }

    private taskHelper(): TaskHelper {
        return this.clsService.get('TaskHelper') as TaskHelper;
    }
}
