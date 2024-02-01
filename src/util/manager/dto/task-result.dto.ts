import { Task } from '../../types/task';

export interface TaskResultDto {
    taskState: Task.TaskState;
    taskIndex: number;
}