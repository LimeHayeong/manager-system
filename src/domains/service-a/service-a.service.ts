import * as _ from 'lodash';
import * as path from 'path';

import { ClsService } from 'nestjs-cls';
import { Cron } from '@nestjs/schedule'
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/util/logger/logger.service';
import { ManagerService } from 'src/util/manager/manager.service';
import { Task } from 'src/util/manager/types/task';
import { TaskHelper } from 'src/util/task-helper';
import { delay } from 'src/util/delay';
import { promises as fs } from 'fs';
import { genereateRandomNumber as grn } from 'src/util/random';

const chains = ['Chain_10', 'Chain_52', 'Chain_2', 'Chain_48', 'Tezos', 'Monero', 'Chain_12', 'Tron', 'BinanceCoin', 'Chain_35', 'Chain_57', 'Chain_29', 'Chain_15', 'Chain_69', 'Chain_27', 'Chain_26', 'Litecoin', 'NEO', 'Chain_7', 'Chain_41', 'Aave', 'Chain_11', 'NEM', 'Chain_60', 'Chain_33', 'Chain_46', 'Chain_20', 'Chain_37', 'Chain_62', 'Solana', 'Chain_22', 'Chainlink', 'Chain_66', 'Chain_54', 'Chain_73', 'Chain_42', 'Chain_61', 'Chain_17', 'Cosmos', 'Uniswap', 'Stellar', 'Chain_50', 'Chain_16', 'Chain_3', 'Chain_31', 'Chain_64', 'Ripple', 'Chain_74', 'Chain_32', 'VeChain', 'Chain_44', 'Chain_25', 'Chain_40', 'Chain_56', 'Zcash', 'Chain_72', 'Chain_13', 'IOTA', 'Chain_71', 'Chain_24', 'Chain_8', 'Chain_65', 'Chain_76', 'Chain_59', 'Dash', 'Chain_58', 'Chain_39', 'Chain_55', 'Bitcoin', 'Chain_5', 'Chain_1', 'Chain_28', 'Ethereum', 'Dogecoin', 'Chain_63', 'Chain_36', 'Polkadot', 'Chain_19', 'Chain_47', 'Chain_23', 'Chain_6', 'Chain_43', 'Chain_0', 'Chain_30', 'Chain_67', 'Chain_70', 'Chain_9', 'Chain_14', 'Chain_68', 'Chain_75', 'Chain_21', 'Chain_38', 'Chain_34', 'Chain_51', 'Chain_4', 'Cardano', 'Chain_45', 'Chain_18', 'Chain_53', 'Chain_49'];


const tempfilename = 'abc.txt';

@Injectable()
export class ServiceAService {
  constructor(
    private readonly clsService: ClsService,
    private readonly managerService: ManagerService,
    private readonly loggerService: LoggerService,
  ) {}

  public async loadBeforeInfo() {}

  // TODO: 아예 프로그램 실행 context를 모아놓는 class를 만들자. 그리고 나서 manager에도 반영.
  public async processTrigger() {
    const opts = {
      domain: 'ServiceA',
      task: 'processRun',
      taskType: Task.TaskType.TRIGGER,
    }
    this.clsService.run(async() => {
      try {
        this.clsService.set('TaskHelper', new TaskHelper(this.managerService, this.loggerService))
        this.taskHelper().build(opts.domain, opts.task, opts.taskType);
        await this.processRun();
      } catch (e) {
        // build level error

      }
    })
  }

  @Cron('0 * * * * *')
  public async processRT() {
    const opts = {
      domain: 'ServiceA',
      task: 'processRun',
      taskType: Task.TaskType.CRON,
    }
    this.clsService.run(async() => {
      try {
        this.clsService.set('TaskHelper', new TaskHelper(this.managerService, this.loggerService))
        this.taskHelper().build(opts.domain, opts.task, opts.taskType);
        await this.processRun();
      } catch (e) {
        // build level error

      }
    })
  }

  public async processRun() {
      await this.taskHelper().start();

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
                this.taskHelper().error(e);
              }
            }

            return chainInfo;
          }),
        );
        promiseInfo.push(...chunkInfos);
      }

      this.taskHelper().log('all finished');

      await this.taskHelper().end();
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
      await delay(grn(1, 2));
      this.taskHelper().log(`[${chainInfo.chainName}] okay`);
    } catch (e) {
      this.taskHelper().error(e);
    }
  }

  private async doSomething2(chain: string) {
    // const rn = Math.random();
    await delay(grn(1, 2));
    if (Math.random() < 1 / 10) {
      // console.log(rn)
      return { chainName: chain, price: null };
    } else {
      return { chainName: chain, price: Math.floor(Math.random() * 100) + 1 };
    }
  }

  private taskHelper(): TaskHelper{
    return this.clsService.get('TaskHelper') as TaskHelper
  }
}
