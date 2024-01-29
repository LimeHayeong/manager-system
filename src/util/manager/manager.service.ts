import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';

@Injectable()
export class ManagerService {
  private taskStates: Task.TaskState[] = [];

  constructor() {
    // taskStates initialization
    // >> task 미리 알고 있으면 해당 task들 기본 작업.
  }

  public getStates() {
    return this.taskStates;
  }
  public setState(domain: string, task: string, status: Task.TaskStatus) {}

  public simplef() {}

  private findTaskState(domain: string, task: string) {
    const idx = this.taskStates.findIndex(
      (taskState) => taskState.domain === domain && taskState.task === task,
    );
    if (idx !== -1) {
      return idx;
    } else {
      return undefined;
    }
  }
}
