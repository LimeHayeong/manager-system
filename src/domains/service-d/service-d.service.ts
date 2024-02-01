import { ClsService } from 'nestjs-cls';
import { FileLoggerService } from 'src/util/file-logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/types/task';
import { TaskHelper } from 'src/util/task-helper';
import _ from 'lodash';
import { delay } from 'src/util/delay';
import { genereateRandomNumber } from 'src/util/random';

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


// 뭔가 부하가 많이 일어나는 과정
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

    // 10000개하니까 나가리됨. 3566개쯤에서.
    // 2000개 recentLogs 에러남.
    private async processRun() {
        // ... start는 await해야되는 작업인데 안했음.
        await this.taskHelper().start();

        // 10,000개의 항목을 생성 (예시)
        const chains = Array.from({ length: 5000 }, (_, i) => `Chain_${i + 1}`);

        for (const chainChunk of _.chunk(chains, 50)) {
            const chunkResults = await Promise.all(
              chainChunk.map(async (chain: string) => {
                try {
                  const chainInfo = await this.doSomethingD2(chain);
                  if (chainInfo) {
                    await this.doSomethingD(chainInfo);
                  }
                  return chainInfo;
                } catch (e) {
                  this.taskHelper().error(e);
                  return null;
                }
              }),
            );
        }

        await this.taskHelper().end();
    }

    private async doSomethingD(chainInfo: any) {
        try {
            this.taskHelper().log(`[${chainInfo.chainName}] okay`);
        } catch (e) {
            this.taskHelper().error(e);
        }
    }

    private async doSomethingD2(chain: string) {
        try {
            const randomNumber = Math.random()
            if (randomNumber < 1 / 10) {
                // 10% 확률로 warn 발생
                this.taskHelper().warn(`[${chain}] is not available`);
                return { chainName: chain, price: null };
            } else if(1 / 10 <= randomNumber && randomNumber <= 3 / 20) {
                // 5% 확률로 에러 발생
                throw new Error(`[${chain}] error occured`);
            }{
                return { chainName: chain, price: Math.floor(Math.random() * 100) + 1 };
            }
        } catch(e) {
            this.taskHelper().error(e)
        }

    }

    private taskHelper(): TaskHelper {
        return this.clsService.get('TaskHelper') as TaskHelper;
    }
}
