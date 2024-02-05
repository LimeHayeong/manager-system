import { ClsService } from 'nestjs-cls';
import { FileLoggerService } from 'src/system/file-logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ManagerService } from 'src/system/manager/manager.service';
import { Task } from 'src/util/types/task';
import { TaskHelper } from 'src/util/task-helper';
import _ from 'lodash';
import { delay } from 'src/util/delay';
import { genereateRandomNumber } from 'src/util/random';

const opts = {
    domain: 'ServiceD',
    task: 'processRun',
}

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

    private async processRun() {
        // ... start는 await해야되는 작업인데 안했음.
        await this.taskHelper().start();

        // 10,000개의 항목을 생성 (예시)
        const chains = Array.from({ length: 10000 }, (_, i) => `Chain_${i + 1}`);

        // 단일 Promise.all은 부하가 심함.
        for (const chainChunk of _.chunk(chains, 50)) {
            // 이벤트 루프의 다음 틱에 예약..?
            // 아 이게 문제가 아니라 그냥 큰 파일 네트워크 전송 계속해서 생긴 문제였네...
            // await new Promise(resolve => setImmediate(resolve));

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

        // for (const chain of chains) {
        //     try {
        //         const chainInfo = await this.doSomethingD2(chain);
        //         if (chainInfo) {
        //             await this.doSomethingD(chainInfo);
        //         }
        //     } catch (e) {
        //         this.taskHelper().error(e);
        //     }
        // }

        await this.taskHelper().end();
    }

    private async doSomethingD(chainInfo: any) {
        try {
            await delay(genereateRandomNumber(0.01, 0.015))
            this.taskHelper().log(`[${chainInfo.chainName}] okay`);
        } catch (e) {
            this.taskHelper().error(e);
        }
    }

    private async doSomethingD2(chain: string) {
        try {
            const randomNumber = Math.random()
            if (randomNumber < 1 / 100) {
                // 1% 확률로 warn 발생
                await delay(genereateRandomNumber(0.02, 0.025))
                this.taskHelper().warn(`[${chain}] is not available`);
                return { chainName: chain, price: null };
            } else if(1 / 100 <= randomNumber && randomNumber <= 3 / 200) {
                // 0.5% 확률로 에러 발생
                await delay(genereateRandomNumber(0.05, 0.07))
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
