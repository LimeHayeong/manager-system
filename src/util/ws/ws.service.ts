import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WsService {
    constructor(
        private eventEmitter: EventEmitter2,
    ) {
        
    }

    public getInitial() {
        this.eventEmitter.emit('getInitialTaskStates');
    }
}
