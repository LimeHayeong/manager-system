import { FileLoggerService } from './file-logger/logger.service';
import { ManagerService } from './manager/manager.service';
import { Task } from './types/task';
import { v4 as uuid } from 'uuid';

// TODO: ConsoleLog, FileLog, WsLog를 winston transports를 써서 동시에 잘 처리해보자...
export class TaskHelper {
  private taskState: Task.TaskState;
  private taskIndex: number;

  constructor(
    private readonly managerService: ManagerService,
    private readonly fileLoggerService: FileLoggerService,
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

  public build(domain: string, task: string, taskType: Task.TaskType, contextId?: string) {
    if(!contextId){
      contextId = uuid();
    }
    // task가 활성화 되었는지 확인
    if(!this.managerService.isTaskAvailable({domain, task, taskType})){
      throw new Error('Task is not available');
    }

    // task가 실행중이면
    if(this.managerService.isTaskRunning({domain, task, taskType})){
      throw new Error('Task is already running');
    }

    this.taskState.domain = domain;
    this.taskState.task = task;
    this.taskState.taskType = taskType;
    this.taskState.contextId = contextId;
  }

  public async start() {
    const result = this.managerService.startTask(
      {
        domain: this.taskState.domain,
        task: this.taskState.task,
        taskType: this.taskState.taskType
      }, this.taskState.contextId);
    if(result){
      // 상태가 제대로 있으면, 상태 반영 제대로 된 것.
      this.taskState = result.taskState;
      this.taskIndex = result.taskIndex;
      const newLog = this.makeLog(Task.LogLevel.INFO, Task.LogTiming.START, '', this.taskState.startAt)
      this.logTransfer(newLog)
    }else{
      // TODO: 문제가 있으면,

    }
  }

  public async log(msg: string) {
    const newLog = this.makeLog(Task.LogLevel.INFO, Task.LogTiming.PROCESS, msg, Date.now())
    this.logTransferNoConsole(newLog);
  }

  public async error(error: Error) {
    // Error to object.
    const data: Task.ErrorObject = {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
    const newLog = this.makeLog(Task.LogLevel.ERROR, Task.LogTiming.PROCESS, data, Date.now())
    this.logTransfer(newLog);
  }

  public async warn(data: any) {
    const newLog = this.makeLog(Task.LogLevel.WARN, Task.LogTiming.PROCESS, data, Date.now())
    this.logTransfer(newLog);
  }

  public async end() {
    const newState = this.managerService.endTask(this.taskIndex)
    if(newState){
      const newLog = this.makeLog(Task.LogLevel.INFO, Task.LogTiming.END, '', newState.endAt)
      this.logTransfer(newLog)
    }else{
      // TODO: 문제가 있으면,
      
    }
  }

  // 정보를 Log로 formatting하는 함수.
  private makeLog(level: Task.LogLevel, timing: Task.LogTiming, data: any, timestamp: number): Task.Log {
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

  // Log Transfer.
  // console, manager(ws), file에 각각 로그를 전달하는 함수.
  private async logTransfer(log: Task.Log){ 
    this.managerService.logTask(this.taskIndex, log)
    this.fileLoggerService.pushConsole(log);
    this.fileLoggerService.pushLog(log);
  }

  private async logTransferNoConsole(log: Task.Log){
    this.managerService.logTask(this.taskIndex, log)
    this.fileLoggerService.pushLog(log);
  }
}
