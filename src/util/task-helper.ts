import { LoggerService } from './logger/logger.service';
import { ManagerService } from './manager/manager.service';
import { Task } from './manager/types/task';
import { v4 as uuid } from 'uuid';

export class TaskHelper {
  private taskState: Task.TaskStateNoLogs;
  private taskIndex: number;

  constructor(
    private readonly managerService: ManagerService,
    private readonly loggerService: LoggerService,
  ) {
    this.taskState = {
      domain: '',
      task: '',
      taskType: null,
      status: null,
      contextId: null,
      isAvailable: true,
      updatedAt: null,
      startAt: null,
      endAt: null,
    }
  }
  // 이럴 거면 모듈로 정의하는게 ..?

  public build(domain: string, task: string, taskType: Task.TaskType, contextId?: string) {
    if(!contextId){
      contextId = uuid();
    }
    if(this.managerService.isTaskAvailable({domain, task, taskType})){
      // true면...
      this.taskState.domain = domain;
      this.taskState.task = task;
      this.taskState.taskType = taskType;
      this.taskState.contextId = contextId;
    }else{
      // TODO: false면...
      console.log('task build fail')
    }
  }

  // Managerservice에서 시작에 이상 없으면, Console에 찍고 Logger에 push
  public async start() {
    const result = await this.managerService.startTask(
      {
        domain: this.taskState.domain,
        task: this.taskState.task,
        taskType: this.taskState.taskType
      }, this.taskState.contextId);
    if(result){
      // 상태가 제대로 있으면,
      this.taskState = result.taskState;
      this.taskIndex = result.taskIndex;
      console.log(`[${this.taskState.domain}:${this.taskState.task}][START]`);
      const newLog = this.makeLog(Task.LogLevel.INFO, Task.Timing.START, '[START]', this.taskState.startAt)
      this.managerService.logTask(this.taskIndex, newLog);
      this.loggerService.pushLog(newLog);
    }else{
      // TODO: 문제가 있으면,

    }
  }

  public log(msg: string) {
    const newLog = this.makeLog(Task.LogLevel.INFO, Task.Timing.PROCESS, msg, Date.now())
    this.managerService.logTask(this.taskIndex, newLog)
    console.log(`[${this.taskState.domain}:${this.taskState.task}][PROCESS] ` + msg);
    this.loggerService.pushLog(newLog);
  }

  public error(error: Error) {
    const newLog = this.makeLog(Task.LogLevel.ERROR, Task.Timing.PROCESS, error, Date.now())
    // error 관련 log는 구분해야할까?
    this.managerService.logTask(this.taskIndex, newLog)
    console.log(`[${this.taskState.domain}:${this.taskState.task}][ERROR] ` + error);
    this.loggerService.pushLog(newLog)
  }

  public warn(data: any) {
    const newLog = this.makeLog(Task.LogLevel.WARN, Task.Timing.PROCESS, data, Date.now())
    this.managerService.logTask(this.taskIndex, newLog)
    console.log(`[${this.taskState.domain}:${this.taskState.task}][PROCESS][WARN] ` + data);
    this.loggerService.pushLog(newLog)
  }

  public async end() {
    // manager 상태 반영
    // logger queue 전송
    const newState = await this.managerService.endTask(this.taskIndex)
    if(newState){
      const newLog = this.makeLog(Task.LogLevel.INFO, Task.Timing.END, '[END]', this.taskState.endAt)
      console.log(`[${this.taskState.domain}:${this.taskState.task}][END]`)
      this.managerService.logTask(this.taskIndex, newLog)
      this.loggerService.pushLog(newLog)
    }else{
      // TODO: 문제가 있으면,

    }
  }

  private makeLog(level: Task.LogLevel, timing: Task.Timing, data: any, timestamp: number): Task.Log {
    if(data instanceof Error){
      data = {
        name: data.name,
        message: data.message,
        stack: data.stack
      }
    }
    return {
        domain: this.taskState.domain,
        task: this.taskState.task,
        taskType: this.taskState.taskType,
        contextId: {task: this.taskState.contextId},
        level: level,
        logTiming: timing,
        data: data,
        timestamp: timestamp
    }
  }
}
