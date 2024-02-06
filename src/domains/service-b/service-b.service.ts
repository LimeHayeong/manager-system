import { ClsService } from 'nestjs-cls';
import { Cron } from '@nestjs/schedule';
import { FileLoggerService } from 'src/util/file-logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/types/task';
import { TaskHelper } from 'src/util/task-helper';
import { delay } from 'src/util/delay';
import { genereateRandomNumber } from 'src/util/random';

const opts = {
    domain: 'ServiceB',
    task: 'processRun',
}
const chains = ['Chain_33',
'Chain_25',
'Chain_23',
'Cosmos',
'NEO',
'Chain_59',
'Solana',
'Chain_10',
'Chain_43',
'Chain_1',
'Chain_42',
'Chain_35',
'Chain_69',
'Chain_19',
'Chain_52',
'Chain_39',
'Chain_36',
'Chain_56',
'Chain_37',
'Chain_63',
'Chain_71',
'NEM',
'Chain_62',
'Dash',
'Chain_49',
'Litecoin',
'Chain_24',
'Chain_13',
'Chain_50',
'Chain_57']

// chain.market.service mocking
@Injectable()
export class ServiceBService {
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

    // 3분마다 실행
    @Cron('0 */3 * * * *')
    public async processRT() {
        this.clsService.run(async() => {
            try {
                this.clsService.set('TaskHelper', new TaskHelper(this.managerService, this.fileLoggerService))
                this.taskHelper().build(opts.domain, opts.task, Task.TaskType.CRON);
                await this.processRun();
            } catch (e) {
                console.error(e);
            }
        })
    }

    private async processRun() {
        await this.taskHelper().start();

        await Promise.all(chains.map(async (chain) => {
            const chainMarketData = await this.doSomethingB(chain);
            return chainMarketData
        }))

        await this.taskHelper().end();
    }

    private async doSomethingB(chain: string) {
        await delay(genereateRandomNumber(3, 5));
        if (Math.random() < 1 / 20) {
            this.taskHelper().warn(`[MARKET] ${chain} is not available`)
            return { chainName: chain, price: null };
        } else {
            return { chainName: chain, price: Math.floor(Math.random() * 100) + 1 };
        }
    }

    private taskHelper(): TaskHelper {
        return this.clsService.get('TaskHelper') as TaskHelper;
    }
}
