import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';

@Injectable()
export class ManagerService {
    private taskStates: Task.TaskState[] = [];

    constructor() {
        // taskStates initialization
        // >> task 미리 알고 있으면 해당 task들 기본 작업.
    }

    public getTaskStates() {
        return this.taskStates;
    }

    // initial 당시 해당 task가 활성화 되어있는지 확인
    // return: true(available), false
    public isTaskAvailable(taskId: Task.TaskIdentifier): boolean {
        this.findTask(taskId)
        return true;
    }

    public startTask(taskId: Task.TaskIdentifier, contextId: string): Task.TaskState {
        const taskIdx = this.findTask(taskId);
        if(taskIdx){
            const existingTask = this.taskStates[taskIdx];
            return {
                domain: existingTask.domain,
                task: existingTask.task,
                taskType: existingTask.taskType,
                status: Task.TaskStatus.PROGRESS,
                contextId: contextId,
                isAvailable: existingTask.isAvailable,
                updatedAt: Date.now(),
                startAt: Date.now(),
                endAt: null,
                logs: existingTask.logs,
            }
        }
        return undefined;
    }
    
    public updateTask() {}
    public endTask() {}

    // initial 당시 (domain, task, taskType) 쌍으로 task 찾아주는 helper function
    // return: index
    private findTask(taskId: Task.TaskIdentifier): number {
        const idx = this.taskStates.findIndex(taskState =>
            taskState.domain === taskId.domain
            && taskState.task === taskId.task
            && taskState.taskType === taskId.taskType)
        if(idx !== -1) {
            return idx
        }else
        return undefined
    }

    // contextId로 task 찾아주는 helper function
    // return: index
    private findTaskwithId(contextId: string): number {
        const idx = this.taskStates.findIndex(taskState => taskState.contextId === contextId)
        if(idx !== -1){
            return idx
        }
        return undefined
    }
}
