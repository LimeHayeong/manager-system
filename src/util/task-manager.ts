import { LoggerService } from './logger/logger.service';
import { ManagerService } from './manager/manager.service';
import { Task } from './types/task';

export class TaskManager {
  private domain: string;
  private task: string;
  private taskType: Task.TaskType;
  private startAt: number;
  private contextId: { [key: string]: string };

  constructor(
    private readonly managerService: ManagerService,
    private readonly loggerService: LoggerService,
  ) {}

  public build(domain: string, task: string, taskType?: Task.TaskType, contextId?: string) {
    this.domain = domain;
    this.task = task;
    this.taskType = taskType || undefined;
    this.contextId = { task: contextId } || {};
  }

  public start() {
    this.startAt = Date.now();
    console.log(`[${this.domain}:${this.task}][START]`);
    const newLog = this.makeLog(Task.LogLevel.INFO, Task.Timing.START, '', this.startAt)
    // manager 상태 반영
    this.managerService.startTask();
    this.loggerService.pushLog(newLog);
  }
  public log(msg: string) {
    console.log(`[${this.domain}:${this.task}][PROCESS] ` + msg);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public error(error: Error) {
    console.log(`[${this.domain}:${this.task}][ERROR] ` + error);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public warn(msg: string, data: any) {
    console.log(`[${this.domain}:${this.task}][PROCESS][WARN] ` + msg);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public async end() {
    const end = Date.now();
    console.log(`[${this.domain}:${this.task}][END]`);
    // manager 상태 반영
    // logger queue 전송
  }

  private makeLog(level: Task.LogLevel, timing: Task.Timing, data: any, timestamp: number): Task.Log {
    return {
        domain: this.domain,
        task: this.task,
        taskType: this.taskType,
        contextId: this.contextId,
        level: level,
        logTiming: timing,
        data: data,
        timestamp: timestamp
    }
  }
}
