import * as _ from 'lodash';
import * as path from 'path';

import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/util/logger/logger.service';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/manager/types/task';
import { TaskHelper } from 'src/util/task-helper';
import { delay } from 'src/util/delay';
import { promises as fs } from 'fs';
import { genereateRandomNumber as grn } from 'src/util/random';
import { v4 as uuid } from 'uuid';

const chains = [
  'VeChain',
  'Cardano',
  'Stellar',
  'Litecoin',
  'Bitcoin',
  'Ripple',
  'Ripple',
  'Zcash',
  'Ripple',
  'Stellar',
  'Bitcoin',
  'Cosmos',
  'Ripple',
  'Dash',
  'Tron',
  'Tezos',
  'VeChain',
  'Ripple',
  'Stellar',
  'Cardano',
  'Ripple',
  'Stellar',
  'VeChain',
  'Zcash',
  'Dash',
  'NEO',
  'Cosmos',
  'Polkadot',
  'Monero',
  'Litecoin',
  'Tron',
  'Zcash',
  'Ethereum',
  'VeChain',
  'Monero',
  'Cosmos',
  'Chainlink',
  'BinanceCoin',
  'Litecoin',
  'Zcash',
  'Stellar',
  'IOTA',
  'VeChain',
  'Monero',
  'Litecoin',
  'NEM',
  'Ripple',
  'Chainlink',
  'Zcash',
  'Tron',
  'Cardano',
  'Cosmos',
  'Zcash',
  'Ethereum',
  'Bitcoin',
  'Zcash',
  'Stellar',
  'Ethereum',
  'Cosmos',
  'IOTA',
  'Cardano',
  'Tron',
  'NEO',
  'Litecoin',
  'Zcash',
  'Ripple',
  'NEM',
  'Ripple',
  'Ethereum',
  'NEM',
  'Chainlink',
  'Dash',
  'Polkadot',
  'Monero',
  'Cardano',
  'Cardano',
  'NEO',
  'Ethereum',
  'Ripple',
  'Cardano',
  'Dash',
  'Tron',
  'Bitcoin',
  'Stellar',
  'IOTA',
  'NEM',
  'Zcash',
  'Polkadot',
  'Dash',
  'Chainlink',
  'Zcash',
  'Stellar',
  'Chainlink',
  'Monero',
  'Tron',
  'Chainlink',
  'Monero',
  'Tron',
  'Dash',
  'BinanceCoin',
];

const tempfilename = 'abc.txt';

@Injectable()
export class ServiceAService {
  constructor(
    private readonly clsService: ClsService,
    private readonly managerService: ManagerService,
    private readonly loggerService: LoggerService,
  ) {}

  public async loadBeforeInfo() {}

  public async processRT() {
    this.clsService.run(async () => {
      this.clsService.set(
        'TaskHelper',
        new TaskHelper(this.managerService, this.loggerService),
      );
      this.clsService.get('TaskHelper').build('ServiceA', 'processRT', Task.TaskType.CRON);
      await this.clsService.get('TaskHelper').start();

      //console.log(this);

      const promiseInfo = [];
      for (const chainChunk of _.chunk(chains, 20)) {
        const chunkInfos = await Promise.all(
          chainChunk.map(async (chain) => {
            const chainInfo = await this.doSomething2(chain);

            if (chainInfo) {
              try {
                await this.doSomething(chainInfo);
              } catch (e) {
                this.clsService.get('TaskHelper').error(e);
              }
            }

            return chainInfo;
          }),
        );
        promiseInfo.push(...chunkInfos);
      }

      this.clsService.get('TaskHelper').log('all finished');

      await this.clsService.get('TaskHelper').end();
    });
  }

  private async doSomething(chainInfo: any) {
    try {
      if (chainInfo.price == null){
        throw new Error(`[${chainInfo.chainName}] no data`);
      }

      const tempfilePath = path.join(__dirname, tempfilename);
      const data = JSON.stringify(chainInfo);
      // console.log(tempfilePath);
      await fs.writeFile(tempfilePath, data);
      //console.log(this);
      await delay(grn(1, 4));
      this.clsService.get('TaskHelper').log(`[${chainInfo.chainName}] okay`);
    } catch (e) {
      this.clsService.get('TaskHelper').error(e);
    }
  }

  private async doSomething2(chain: string) {
    // const rn = Math.random();
    await delay(grn(1, 4));
    if (Math.random() < 1 / 10) {
      // console.log(rn)
      return { chainName: chain, price: null };
    } else {
      return { chainName: chain, price: Math.floor(Math.random() * 100) + 1 };
    }
  }
}
