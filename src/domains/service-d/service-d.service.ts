import { ClsService } from 'nestjs-cls';
import { FileLoggerService } from 'src/util/file-logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/types/task';
import { TaskHelper } from 'src/util/task-helper';
import { delay } from 'src/util/delay';

const opts = {
    domain: 'ServiceD',
    task: 'processRun',
}
const chains = [
    "Bitcoin",
    "Ethereum",
    "Ripple",
    "Litecoin",
    "Cardano",
    "Polkadot",
    "Solana",
    "Chainlink",
    "Tezos",
    "Binance Smart Chain"
]


// 엄청 오래 걸리는 작업을 가정?
@Injectable()
export class ServiceDService {
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

    // TODO?: 뭔가 진행률 표시에 도움될만한 오브젝트를 넣어주자.
    private async processRun() {
        this.taskHelper().start();

        for (const chain of chains) {
            await this.doSomethingLong(chain);
        }
        
        this.taskHelper().end();
    }

    // 1개당 1분 걸림.
    private async doSomethingLong(chain: string) {;
        await delay(60);
        this.taskHelper().log(`[${chain}] process done`);
    }

    private taskHelper(): TaskHelper {
        return this.clsService.get('TaskHelper') as TaskHelper;
    }
}
