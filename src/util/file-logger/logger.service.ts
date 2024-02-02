import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';

const tempBufferSize = 500;
const fileInterval = 5000;
const consoleInterval = 1000;
const tempfilename = 'log.json'

// 아 맞다 setInterval이 실제로 의도한 것처럼 동작 안한다고 했지.... 다른 task 오래 걸리면... 음...
@Injectable()
export class FileLoggerService {
  private buffer: Task.Log[] = [];
  private consoleBuffer: Task.Log[] = [];
  private maxBufferSize: number;
  private fileInterval: number;
  private consoleInterval: number;

  constructor() {
    // this.maxBufferSize = tempBufferSize;
    this.fileInterval = fileInterval;
    this.consoleInterval = consoleInterval;

    // interval마다 flush
    setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.fileInterval);

    setInterval(() => {
      if (this.consoleBuffer.length > 0) {
        this.consoleFlush();
      }
    }, this.consoleInterval)
  }

  // TaskLog buffer에 push.
  public async pushLog(log: Task.Log) {
    try {
      this.buffer.push(log);
      if(this.buffer.length >= this.maxBufferSize){
          this.flush();
      }
    } catch (e) {
    
    }
  }

  // Buffer 비우면서 파일 저장.
  public flush() {
    try {
        console.log('flushing log buffer: ' + this.buffer.length);

        const data = this.buffer.map(log => JSON.stringify(log)).join('\n')

        fs.appendFileSync(tempfilename, data + '\n');

        this.buffer = [];
    } catch (e) {
        console.error('Error during flushing logs: ', e)
    } 
  }

  public async pushConsole(log: Task.Log) {
    try {
      this.consoleBuffer.push(log);
    } catch (e) {
      
    }
  }

  public consoleFlush() {
    try {
      console.log('[System] flushing console buffer: ' + this.consoleBuffer.length);

      // 검사구문 없으면 더 빠를텐데.
      this.consoleBuffer.map(log => {
        if(typeof log.data !== 'string' && 'message' in log.data){
          console.log(`[${log.domain}:${log.task}][${log.level}][${log.logTiming}] ` + log.data.message)
        }else{
          console.log(`[${log.domain}:${log.task}][${log.level}][${log.logTiming}] ` + log.data)
        }
      });

      this.consoleBuffer = [];
    } catch(e) {
      
    }
  }

  // for test
  public getBuffer() {
    const buffer = this.buffer;
    const size = this.buffer.length;
    return {
      buffersize: size,
      buffer,
    }
  }
}
