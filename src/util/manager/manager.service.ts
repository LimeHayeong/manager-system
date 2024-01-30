import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';

// Q. 같은 domain, task인데 다른 실행방법을 가지면 다르게 Log를 저장해야하나?? >> 생각해봐야함.
const newTasks: Task.TaskStatewithLogs[] = [
    {
        domain: 'ServiceA',
        task: 'processRun',
        taskType: Task.TaskType.TRIGGER,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: [],
    },
    {
        domain: 'ServiceA',
        task: 'processRun',
        taskType: Task.TaskType.CRON,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    }
]

const maxLogsNumber = 3;

@Injectable()
export class ManagerService {
    private taskStates: Task.TaskStatewithLogs[] = [];
    private maxRecentLogs;

    // Q2. TaskState를 식별자로 찾는 로직이 있는데, 해당 과정이 효율적일까.
    // A. index로 바꿨음.
    // >> 두 번째 문제 배열의 순서가 바뀌면 문제가 생김
    // >> 작업이 정의되어 있으니까 initialization 과정이 필요할 듯. (작업을 중도 퇴출 시키지 않는 한)
    // TODO.

    constructor(
        private eventEmitter: EventEmitter2,
    ) {
        // taskStates initialization
        // >> task 미리 알고 있으면 해당 task들 기본 작업.
        this.intialization();
    }

    // 사전 정의된 task들 넣어주는 작업. >> initialization.
    private intialization() {
        // TODO: initalization의 경우 과거 Logs는 로그 파일 뒤져서 줘야함.
        this.taskStates = [];
        this.maxRecentLogs = maxLogsNumber
        newTasks.forEach(newTask => this.taskStates.push(newTask));
        console.log('manager service initialized');
    }

    // for test
    public getTaskStates() {
        return this.taskStatesLogswithLength()
    }

    // for test
    public getTaskStatesNoLogswithLength() {
        return this.taskStatesNoLogswithLength()
    }

    // initial 당시 해당 task가 활성화 되어있는지 확인
    // return: true(available), false
    public isTaskAvailable(taskIdentifier: Task.ITaskIdentity): boolean {
        // console.log(taskIdentifier)
        const taskIndex = this.findTask(taskIdentifier)
        if(taskIndex !== -1){
            // console.log(taskIdentifier.domain + ':' + taskIdentifier.task + ' is available')
            return this.taskStates[taskIndex].isAvailable
        }
        console.log(taskIdentifier.domain + ':' + taskIdentifier.task + ' is not available')
        return false;
    }

    // Task 시작, task identifier로 해당 taskIdx 찾아서 상태 update.
    // Log는 별도로 찍힘.
    public async startTask(taskId: Task.ITaskIdentity, contextId: string): Promise<{
        taskState: Task.TaskState,
        taskIndex: number
    }> {
        const taskIdx = this.findTask(taskId);
        if(taskIdx !== -1){
            // 실행 context에 관한 건 intialization시 초기화 됨.
            const existingTask = this.taskStates[taskIdx];
            existingTask.status = Task.TaskStatus.PROGRESS;
            existingTask.contextId = contextId;
            existingTask.startAt = Date.now();
            existingTask.updatedAt = Date.now();
            existingTask.endAt = null;
            const { recentLogs, ...remains } = existingTask;
            // wsGateway에 전달
            const eventData = this.taskStatesNoLogs();
            this.eventEmitter.emit(
                'taskStateUpdate',
                eventData,
            )
            return {
                taskState: remains,
                taskIndex: taskIdx,
            }
        }
        return undefined;
    }

    // Task 종료, contextId로 taskIdx 찾아서 상태 update.
    // Log는 별도로 찍힘.
    public async endTask(taskIndex: number): Promise<Task.TaskState> {
        // TODO?: Index 유효성 검사?
        const existingTask = this.taskStates[taskIndex];
        existingTask.status = Task.TaskStatus.TERMINATED;
        existingTask.updatedAt = Date.now();
        existingTask.endAt = Date.now();
        const { recentLogs, ...remain } = existingTask;
        // wsGateway에 전달
        const eventData = this.taskStatesNoLogs();
        this.eventEmitter.emit(
            'taskStateUpdate',
            eventData,
        )
        return remain;
    }
    
    // 들어오는 Log, 해당 taskIndex logs에 push.
    public async logTask(taskIndex: number, log: Task.Log) {
        // TODO?: Index 유효성 검사?
        const taskState = this.taskStates[taskIndex];

        //최근 Log 3개만 유지
        // 로그 시작시 새 로그 배열 추가
        if (log.logTiming === Task.Timing.START) {
            // recentLogs 배열 길이 확인 및 오래된 로그 제거
            if (taskState.recentLogs.length >= this.maxRecentLogs) {
                taskState.recentLogs.shift();
            }
            // 새 로그 배열 추가
            taskState.recentLogs.push([]);
        }

        // 로그 추가 (가장 최근 로그 배열에 로그 추가)
        const currentLogArray = taskState.recentLogs[taskState.recentLogs.length - 1];
        currentLogArray.push(log);

        //taskState 업데이트
        if(log.logTiming !== Task.Timing.START && log.logTiming !== Task.Timing.END){
            // 시작과 끝이 아닌 경우,
            taskState.updatedAt = log.timestamp;
        }
        const logIdx = this.taskStates[taskIndex].recentLogs.length - 1
        this.taskStates[taskIndex].recentLogs[logIdx].push(log);

        // wsGateway
        const eventData = this.taskStates;
        this.eventEmitter.emit(
            'taskLog',
            eventData,
        )
    }

    public updateTask() {
        
    }

    // initial 당시 (domain, task, taskType) 쌍으로 task 찾아주는 helper function
    // return: index
    private findTask(taskId: Task.ITaskIdentity): number {
        const idx = this.taskStates.findIndex(taskState =>
            taskState.domain === taskId.domain
            && taskState.task === taskId.task
            && taskState.taskType === taskId.taskType)
        if(idx !== -1) {
            // console.log(idx)
            // console.log('task found: ' + taskId.domain + ':' + taskId.task + ':' + taskId.taskType)
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

    private taskStatesNoLogs() {
        return this.taskStates.map(taskState => {
            const { recentLogs, ...remain } = taskState;
            return remain;
        })
    }

    private taskStatesNoLogswithLength() {
        return this.taskStates.map(taskState => {
            const { recentLogs, ...remain } = taskState;
            const recentLogsLength = recentLogs.length;
            return {
                ...remain,
                recentLogsLength,
            }
        })
    }

    private taskStatesLogswithLength() {
        return this.taskStates.map(taskState => {
            const { recentLogs, ...remain } = taskState;
            const recentLogsLength = recentLogs.length;
            return {
                ...remain,
                recentLogsLength,
                recentLogs,
            }
        })
    }
    
    @OnEvent('getInitialTaskStates')
    handleGetInitialTaskStates() {
        const data = this.taskStatesNoLogs();
        this.eventEmitter.emit(
            'initailTaskStatesResponse',
            data
        )
    }
}
