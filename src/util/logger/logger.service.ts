import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';

@Injectable()
export class LoggerService {
  private buffer: Task.Log[] = [];
  private maxBufferSize: number;
  private interval: number;

  constructor() {
    this.maxBufferSize = 500;
    this.interval = 5000;

    setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.interval);
  }

  public pushLog(log: Task.Log) {
    this.buffer.push(log);
    if (this.buffer.length === this.maxBufferSize) {
      this.flush();
    }
  }

  public flush() {
    console.log('flushing log buffer: ' + this.buffer.length);
    // writing to log files.

    this.buffer = [];
  }

  public simplef() {}
}
