import { Injectable } from '@nestjs/common';
import { ManagerService } from '../manager/manager.service';

@Injectable()
export class WsService {
    constructor(
        private readonly managerService: ManagerService,
    ) {
        
    }

    public getInitial() {
        
    }
}
