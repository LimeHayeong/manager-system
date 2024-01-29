import * as _ from 'lodash';
import * as path from 'path';

import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/util/logger/logger.service';
import { ManagerService } from 'src/util/manager/manager.service';
import { TaskManager } from 'src/util/task-manager';
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
        'taskManager',
        new TaskManager(this.managerService, this.loggerService),
      );
      this.clsService.get('taskManager').build().start();

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
                this.clsService.get('taskManager').error(e);
              }
            }

            return chainInfo;
          }),
        );
        promiseInfo.push(...chunkInfos);
      }

      this.clsService.get('taskManager').log('all finished');

      await this.clsService.get('taskManager').end();
    });
  }

  private async doSomething(chainInfo: any) {
    try {
      if (chainInfo.price == null)
        throw new Error(`no data for ${chainInfo.chainName}`);

      const tempfilePath = path.join(__dirname, tempfilename);
      const data = JSON.stringify(chainInfo);
      // console.log(tempfilePath);
      await fs.writeFile(tempfilePath, data);
      //console.log(this);
      await delay(grn(1, 4));
      this.clsService.get('taskManager').log(`[${chainInfo.chainName}] okay`);
    } catch (e) {
      this.clsService.get('taskManager').error(e);
    }
  }

  private async doSomething2(chain: string) {
    const rn = Math.random();
    await delay(grn(1, 4));
    if (Math.random() < 1 / 10) {
      // console.log(rn)
      return { chainName: chain, price: null };
    } else {
      return { chainName: chain, price: Math.floor(Math.random() * 100) + 1 };
    }
  }
}
