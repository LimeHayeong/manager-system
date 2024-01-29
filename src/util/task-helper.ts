import { LoggerService } from './logger/logger.service';
import { ManagerService } from './manager/manager.service';
import { Task } from './types/task';

export class TaskHelper {
  private taskState: Task.TaskState;

  constructor(
    private readonly managerService: ManagerService,
    private readonly loggerService: LoggerService,
  ) {}

  public build(domain: string, task: string, taskType?: Task.TaskType, contextId?: string) {
    if(this.managerService.isTaskAvailable({domain, task, taskType})){
      // true면...
      this.taskState.domain = domain;
      this.taskState.task = task;
      this.taskState.taskType = taskType;
      this.taskState.contextId = contextId;
    }else{
      // TODO: false면...
    }
  }

  // Managerservice에서 시작에 이상 없으면, Console에 찍고 Logger에 push
  public async start() {
    const newState = this.managerService.startTask(
      {
        domain: this.taskState.domain,
        task: this.taskState.task,
        taskType: this.taskState.taskType
      }, this.taskState.contextId);
    if(newState){
      // 상태가 제대로 있으면,
      this.taskState = newState;
      console.log(`[${this.taskState.domain}:${this.taskState.task}][START]`);
      const newLog = await this.makeLog(Task.LogLevel.INFO, Task.Timing.START, '', this.taskState.startAt)
      this.loggerService.pushLog(newLog);
    }else{
      // TODO: 문제가 있으면,
    }
  }

  public log(msg: string) {
    console.log(`[${this.taskState.domain}:${this.taskState.task}][PROCESS] ` + msg);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public error(error: Error) {
    console.log(`[${this.taskState.domain}:${this.taskState.task}][ERROR] ` + error);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public warn(msg: string, data: any) {
    console.log(`[${this.taskState.domain}:${this.taskState.task}][PROCESS][WARN] ` + msg);
    // manager 상태 필요시 반영
    // logger queue 전송
  }
  public async end() {
    const end = Date.now();
    console.log(`[${this.taskState.domain}:${this.taskState.task}][END]`);
    // manager 상태 반영
    // logger queue 전송
  }

  private async makeLog(level: Task.LogLevel, timing: Task.Timing, data: any, timestamp: number): Promise<Task.Log> {
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
