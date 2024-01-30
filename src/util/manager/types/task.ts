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

  export const enum TaskStatus {
    TERMINATED = 'terminated',
    PROGRESS = 'progess',
    WAITING = 'waiting',
  }

  export interface TaskState extends Task {
    taskType: TaskType;
    isAvailable: boolean;
    updatedAt: number;
    startAt: number;
    endAt: number;
  }

  export interface TaskStateNoLogs extends Omit<TaskState, 'logs'> {}

  export interface Task {
    domain: string;
    task: string;
    status: string;
    contextId: string;
    logs: Log[];
  }

  export interface WorkState {
    work: string;
    taskType: TaskType;
    status: TaskStatus;
    taskList: Task[];
    updatedAt: number;
    startAt: number;
    endAt: number;
  }

  export interface TaskIdentifier {
    domain: string;
    task: string;
    taskType: TaskType;
  }
}
