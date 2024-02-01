import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Injectable } from '@nestjs/common';
import { Task } from '../types/task';
import { TaskResultDto } from './dto/task-result.dto'

// Q. 같은 domain, task인데 다른 실행방법을 가지면 다르게 Log를 저장해야하나?? >> 생각해봐야함.
// A. 일단은 다르게 저장, 왜? 실행 context가 다름.
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
        status: Task.TaskStatus.WAITING,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
    {
        domain: 'ServiceB',
        task: 'processRun',
        taskType: Task.TaskType.TRIGGER,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
    {
        domain: 'ServiceB',
        task: 'processRun',
        taskType: Task.TaskType.CRON,
        status: Task.TaskStatus.WAITING,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
    {
        domain: 'ServiceC',
        task: 'processRun',
        taskType: Task.TaskType.TRIGGER,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
    // {
    //     domain: 'ServiceC',
    //     task: 'processRun',
    //     taskType: Task.TaskType.CRON,
    //     status: Task.TaskStatus.TERMINATED,
    //     contextId: null,
    //     isAvailable: true,
    //     updatedAt: null,
    //     startAt: null,
    //     endAt: null,
    //     recentLogs: []
    // },
    {
        domain: 'ServiceC',
        task: 'processHelper',
        taskType: Task.TaskType.TRIGGER,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
    {
        domain: 'ServiceD',
        task: 'processRun',
        taskType: Task.TaskType.TRIGGER,
        status: Task.TaskStatus.TERMINATED,
        contextId: null,
        isAvailable: true,
        updatedAt: null,
        startAt: null,
        endAt: null,
        recentLogs: []
    },
]

const maxLogsNumber = 3;

@Injectable()
export class ManagerService {
    private taskStates: Task.TaskStatewithLogs[] = [];
    private maxRecentLogs;

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

    // HTTP call을 받아 Task 시작.
    public controlStartTask(taskIdentifier: Task.ITaskIdentity): boolean {
        const taskIdx = this.findTask(taskIdentifier)
        if(this.taskStates[taskIdx].status === Task.TaskStatus.PROGRESS){
            // task가 실행중이면 false
            return false;
        }
        
        // task 활성화
        this.taskStates[taskIdx].isAvailable = true;

        // task가 trigger면 trigger.
        if(this.taskStates[taskIdx].taskType === Task.TaskType.TRIGGER){
            this.eventEmitter.emit(`startTask:${taskIdentifier.domain}:${taskIdentifier.task}:${taskIdentifier.taskType}`);
        }

        return true
    }

    // HTTP call을 받아 Task 종료.
    public controlStopTask(taskIdentifier: Task.ITaskIdentity): boolean {
        const taskIdx = this.findTask(taskIdentifier)
        if(this.taskStates[taskIdx].status === Task.TaskStatus.TERMINATED){
            // task가 종료되었으면 false
            return false;
        }

        // 이번까지만 실행됨.
        this.taskStates[taskIdx].isAvailable = false;
        
        // CRON이 waiting 중일 때는 terminated로 바꿔줌.
        if(this.taskStates[taskIdx].taskType === Task.TaskType.CRON && this.taskStates[taskIdx].status === Task.TaskStatus.WAITING) {
            this.taskStates[taskIdx].status = Task.TaskStatus.TERMINATED;
        }

        return true
    }

    // task build시, 해당 task가 활성화 되어있는지 확인
    // return: true(available), false
    public isTaskAvailable(taskIdentifier: Task.ITaskIdentity): boolean {
        const taskIndex = this.findTask(taskIdentifier)
        if(taskIndex === -1){
            // task가 없으면, false
            return false;
        }
        return this.taskStates[taskIndex].isAvailable;
    }

    // task build시, 해당 task가 실행중인지 확인
    // return: true(on Running), false
    public isTaskRunning(taskIdentifier: Task.ITaskIdentity): boolean {
        // task가 실행중이면 false
        const taskIndex = this.findTask(taskIdentifier)
        if(this.taskStates[taskIndex].status === Task.TaskStatus.PROGRESS){
            return true;
        }
        return false;
    }

    // Task 시작, task identifier로 해당 taskIdx 찾아서 상태 update.
    // Log는 별도로 찍힘.
    public startTask(taskId: Task.ITaskIdentity, contextId: string): TaskResultDto{
        const taskIdx = this.findTask(taskId);
        if(taskIdx !== -1){
            // 실행 context에 관한 건 intialization시 초기화 됨.
            const dateNow = Date.now();
            const existingTask = this.taskStates[taskIdx];
            existingTask.status = Task.TaskStatus.PROGRESS;
            existingTask.contextId = contextId;
            existingTask.startAt = dateNow
            existingTask.updatedAt = dateNow
            existingTask.endAt = null;

            // 기존에 이 초기화 관련 작업을 Log 찍는 타이밍에 동시에 수행해서 병렬 수행시 문제가 됐었다.
            // 최근 Log 3개만 유지
            // 로그 시작시 새 로그 배열 추가
            // recentLogs 배열 길이 확인 및 오래된 로그 제거
            if (existingTask.recentLogs.length >= this.maxRecentLogs) {
                existingTask.recentLogs.shift();
            }
            // 새 로그 배열 추가
            existingTask.recentLogs.push([]);


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
    public endTask(taskIndex: number): Task.TaskState {
        // TODO?: Index 유효성 검사?

        const dateNow = Date.now();
        const existingTask = this.taskStates[taskIndex];
        if(existingTask.taskType === Task.TaskType.CRON){
            // CRON은 waiting
            existingTask.status = Task.TaskStatus.WAITING;
        }else {
            // TRIGGER는 terminated
            existingTask.status = Task.TaskStatus.TERMINATED;
        }
        existingTask.updatedAt = dateNow
        existingTask.endAt = dateNow
        
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
        // console.log(taskIndex);
        const taskState = this.taskStates[taskIndex];

        // 로그 추가 (가장 최근 로그 배열에 로그 추가)
        const currentLogArray = taskState.recentLogs[taskState.recentLogs.length - 1];
        currentLogArray.push(log)

        // taskState 업데이트
        if(log.logTiming !== Task.LogTiming.START && log.logTiming !== Task.LogTiming.END){
            // 시작과 끝이 아닌 경우,
            taskState.updatedAt = log.timestamp;
        }
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

    // deprecated > array index단위로 바꿈.
    // contextId로 task 찾아주는 helper function
    // return: index
    private findTaskwithId(contextId: string): number {
        const idx = this.taskStates.findIndex(taskState => taskState.contextId === contextId)
        return idx
    }

    // taskStates에서 recentLogs 제외하고 return
    private taskStatesNoLogs() {
        return this.taskStates.map(taskState => {
            const { recentLogs, ...remain } = taskState;
            return remain;
        })
    }

    // taskStates에서 recentLogs 제외하고 Log수 추가해서 return
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

    // taskStates에서 Log수 추가해서 return
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
    
    // 내부 event
    @OnEvent('getInitialTaskStates')
    handleGetInitialTaskStates() {
        const data = this.taskStatesNoLogs();
        this.eventEmitter.emit(
            'initailTaskStatesResponse',
            data
        )
    }
}
