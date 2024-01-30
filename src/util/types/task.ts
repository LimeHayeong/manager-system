export namespace Task {
  export enum TaskType {
    CRON = 'cron',
    TRIGGER = 'trigger',
    WORK = 'work',
  }

  export enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
  }

  export enum Timing {
    START = 'start',
    PROCESS = 'process',
    END = 'end',
  }

  export const enum TaskStatus {
    TERMINATED = 'terminated',
    PROGRESS = 'progress',
    WAITING = 'waiting',
  }

  export interface Log {
    domain: string;
    task: string;
    taskType?: TaskType;
    contextId: { [key: string]: string };
    level: LogLevel;
    logTiming: Timing;
    data: string | Error | object;
    timestamp: number; // toISOString
  }

  export interface WorkState {
    // 구별자
    work: string;
    taskType: TaskType;
    // 실행 context
    status: TaskStatus;
    updatedAt: number;
    startAt: number;
    endAt: number;
    // Todo: 고민이 필요함.
    // taskList, log 구분해야되나 ??
    // taskList: Task[];
  }

  // Task 구별자와 실행 context, 최근 log가 담김 >> Manager service 용.
  export interface TaskStatewithLogs extends TaskState, ITaskLogContext {}
  // Task 구별자와 실행 context가 담김.
  export interface TaskState extends ITaskIdentity, ITaskExecutionStatus {}

  // Task 구별자.
  // domain: Service domain
  // task: task명
  // taskType: taskType(실행 종류)
  export interface ITaskIdentity {
    domain: string;
    task: string;
    taskType: TaskType;
  }

  // Task 실행 context
  // contextId: 실행하는 context id >> 향후 string 대신 더 복잡한 contextId가 주어질 수 있음.
  // status: 현재 task 상태
  // isAvaiable: 현재 task가 실행 가능한지 여부
  // updatedAt: 마지막으로 업데이트된 시간
  // startAt: task 시작 시간(현재 실행 중이거나 마지막 실행 기준)
  // endAt: task 종료 시간(현재 실행 중이거나 마지막 실행 기준)
  export interface ITaskExecutionStatus {
    contextId: string;
    status: TaskStatus;
    isAvailable: boolean;
    updatedAt: number;
    startAt: number;
    endAt: number;
  }

  // Task 실행시, log에 관한 Context
  export interface ITaskLogContext {
    recentLogs: Log[][];
  }
}