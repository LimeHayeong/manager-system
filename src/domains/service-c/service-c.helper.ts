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
    task: 'processHelper',
}

// 대충 trigger만 있는 helper service.
@Injectable()
export class ServiceCHelper {
    constructor(
        private readonly clsService: ClsService,
        private readonly fileLoggerService: FileLoggerService,
        private readonly managerService: ManagerService,
    ) {}

    public async processTriger() {
        this.clsService.run(async() => {
            try {
                this.clsService.set('TaskHelper', new TaskHelper(this.managerService, this.fileLoggerService))
                this.taskHelper().build(opts.domain, opts.task, Task.TaskType.TRIGGER);
                await this.processHelper();
            } catch (e) {
                console.error(e);
            }
        })
    }
    
    private async processHelper() {
        this.taskHelper().start();
        await this.helpSomething();
        this.taskHelper().end();
    }

    // 무언가가 40초에서 80초까지 걸리고, 중간중간 진행율을 보여줌.
    private async helpSomething() {
        await delay(genereateRandomNumber(10, 20));
        this.taskHelper().log('25% done')
        await delay(genereateRandomNumber(10, 20));
        this.taskHelper().log('50% done')
        await delay(genereateRandomNumber(10, 20));
        this.taskHelper().log('75% done')
        await delay(genereateRandomNumber(10, 20));
    }

    private taskHelper(): TaskHelper {
        return this.clsService.get('TaskHelper') as TaskHelper;
    }
}
