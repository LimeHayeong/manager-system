import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { Task } from '../manager/types/task';

const tempBufferSize = 500;
const tempInterval = 5000;
const tempfilename = 'log.json'

@Injectable()
export class LoggerService {
  private buffer: Task.Log[] = [];
  private maxBufferSize: number;
  private interval: number;

  constructor() {
    this.maxBufferSize = tempBufferSize;
    this.interval = tempInterval;

    // interval마다 flush
    setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.interval);
  }

  public async pushLog(log: Task.Log) {
    try {
        this.buffer.push(log);
        // buffer가 꽉 찼으면 flush
        if (this.buffer.length === this.maxBufferSize) {
            this.flush();
        }
    } catch (e) {

    }
  }

  public async flush() {
    try {
        console.log('flushing log buffer: ' + this.buffer.length);
        // 실제 Log 저장하는 로직을 넣으면 됨.

        // console.log(__dirname)
        // const filepath = path.join(__dirname, tempfilename);

        const data = this.buffer.map(log => JSON.stringify(log)).join('\n')

        fs.appendFileSync(tempfilename, data + '\n');

        this.buffer = [];
    } catch (e) {
        console.error('Error during flushing logs: ', e)
    } 
  }

  // for test
  public getBuffer() {
    return this.buffer;
  }
}
