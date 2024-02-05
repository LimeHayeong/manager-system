import { FileLoggerService } from "./file-logger/logger.service";
import { ManagerService } from "./manager/manager.service";
import { Task } from "./types/task";
import { v4 as uuid } from 'uuid';

export class WorkHelper {
    private workState: Task.WorkState;
    private workIndex: number;

    constructor(
        private readonly managerService: ManagerService,
        private readonly fileLoggerService: FileLoggerService,
    ) {
        this.workState = {
            work: '',
            workType: null,
            contextId: null,
            status: null,
            updatedAt: null,
            startAt: null,
            endAt: null,
            taskList: [],
        }
    }

    public build(work: string, workType: Task.TaskType, contextId?: string) {
        if (!contextId) {
            contextId = uuid();
        }

        if(this.managerService.isWorkRunning(work)){
            throw new Error('Work is already running');
        }

        this.workState.work = work;
        this.workState.workType = workType;
        this.workState.contextId = contextId;
    }

    public async start() {}
    public async end() {}
    public async error() {}

    private makeLog() {}
    private logTransfer() {}
    private logTransferNoConsole() {}
}