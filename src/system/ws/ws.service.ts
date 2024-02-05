import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Task } from '../../util/types/task';

@Injectable()
export class WsService {
    constructor(
        private eventEmitter: EventEmitter2,
    ) {
        
    }

    public getInitial() {
        this.eventEmitter.emit('getInitialTaskStates');
    }

    public async reloadTaskLog(data: Task.ITaskIdentity) {
        this.eventEmitter.emit('reloadTaskLog', data);
    }

    public async newTaskLog(data: Task.ITaskIdentity) {
        this.eventEmitter.emit('newTaskLog', data);
    }
}
