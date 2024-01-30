import { Injectable } from '@nestjs/common';
import { Task } from './types/task';

@Injectable()
export class ManagerService {
    private taskStates: Task.TaskState[] = [];
    // Q1. taskState의 각 Logs는 최신 3개 정도만 반영해야함.
    // 

    // Q2. TaskState를 식별자로 찾는 로직이 있는데, 해당 과정이 효율적일까.
    // A. index로 바꿨음.
    // >> 두 번째 문제 배열의 순서가 바뀌면 문제가 생김
    // >> 작업이 정의되어 있으니까 initialization 과정이 필요할 듯. (작업을 중도 퇴출 시키지 않는 한)

    constructor() {
        // taskStates initialization
        // >> task 미리 알고 있으면 해당 task들 기본 작업.
        this.intialization();
    }

    private intialization() {
        this.taskStates = [];
        // 사전 정의된 task들 넣어주는 작업.
        const newTask: Task.TaskState = {
            domain: 'ServiceA',
            task: 'processRT',
            taskType: Task.TaskType.CRON,
            status: Task.TaskStatus.TERMINATED,
            contextId: null,
            isAvailable: true,
            updatedAt: null,
            startAt: null,
            endAt: null,
            logs: [],
        }
        this.taskStates.push(newTask);
        console.log('manager service initialized');
    }

    public getTaskStates() {
        return this.taskStates;
    }

    // initial 당시 해당 task가 활성화 되어있는지 확인
    // return: true(available), false
    public isTaskAvailable(taskIdentifier: Task.TaskIdentifier): boolean {
        console.log(taskIdentifier)
        const taskIndex = this.findTask(taskIdentifier)
        if(taskIndex !== -1){
            console.log(taskIdentifier.domain + ':' + taskIdentifier.task + ' is available')
            return this.taskStates[taskIndex].isAvailable
        }
        console.log(taskIdentifier.domain + ':' + taskIdentifier.task + ' is not available')
        return false;
    }

    // Task 시작, task identifier로 해당 taskIdx 찾아서 상태 update.
    // Log는 별도로 찍힘.
    public async startTask(taskId: Task.TaskIdentifier, contextId: string): Promise<{
        taskState: Task.TaskStateNoLogs,
        taskIndex: number
    }> {
        const taskIdx = this.findTask(taskId);
        if(taskIdx !== -1){
            const existingTask = this.taskStates[taskIdx];
            existingTask.status = Task.TaskStatus.PROGRESS;
            existingTask.contextId = contextId;
            existingTask.startAt = Date.now();
            existingTask.updatedAt = Date.now();
            return {
                taskState: existingTask,
                taskIndex: taskIdx,
            }
        }
        return undefined;
    }

    // Task 종료, contextId로 taskIdx 찾아서 상태 update.
    // Log는 별도로 찍힘.
    public async endTask(taskIndex: number): Promise<Task.TaskStateNoLogs> {
        // Index 유효성 검사?
        const existingTask = this.taskStates[taskIndex];
        return {
            domain: existingTask.domain,
            task: existingTask.task,
            taskType: existingTask.taskType,
            status: Task.TaskStatus.TERMINATED,
            contextId: existingTask.contextId,
            isAvailable: existingTask.isAvailable,
            updatedAt: Date.now(),
            startAt: existingTask.startAt,
            endAt: Date.now()
        }
    }
    
    // 들어오는 Log, 해당 taskIndex logs에 push.
    public async logTask(taskIndex: number, log: Task.Log) {
        // Index 유효성 검사?
        if(log.logTiming !== Task.Timing.START, log.logTiming !== Task.Timing.END){
            // 시작과 끝이 아닌 경우,
            this.taskStates[taskIndex].updatedAt = log.timestamp;
        }
        this.taskStates[taskIndex].logs.push(log);

        // gateway 전송
    }

    public updateTask() {
        
    }

    // initial 당시 (domain, task, taskType) 쌍으로 task 찾아주는 helper function
    // return: index
    private findTask(taskId: Task.TaskIdentifier): number {
        const idx = this.taskStates.findIndex(taskState =>
            taskState.domain === taskId.domain
            && taskState.task === taskId.task
            && taskState.taskType === taskId.taskType)
        if(idx !== -1) {
            console.log(idx)
            console.log('task found: ' + taskId.domain + ':' + taskId.task + ':' + taskId.taskType)
            return idx
        }else{
            return undefined
        }
    }

    // contextId로 task 찾아주는 helper function
    // return: index
    private findTaskwithId(contextId: string): number {
        const idx = this.taskStates.findIndex(taskState => taskState.contextId === contextId)
        return idx
    }
}
