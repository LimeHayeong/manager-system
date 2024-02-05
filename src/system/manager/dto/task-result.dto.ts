import { Task } from '../../../util/types/task';

export interface TaskResultDto {
    taskState: Task.TaskState;
    taskIndex: number;
}