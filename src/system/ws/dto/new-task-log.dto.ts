import { Task } from "src/util/types/task";

export interface NewTaskLogRequestDTO extends Task.ITaskIdentity{
    startLogSeq: number
}