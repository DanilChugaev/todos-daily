export type TTaskPriority = 'high' | 'medium' | 'low' | 'other';
export type TTaskCategory = string;

export interface ITask {
  id?: string;
  name?: string;
  done?: boolean;
  parentId?: number;
  description?: string;
  dateCreated?: Date;
  dateChanged?: Date;
  dueDate?: Date;
  priority?: TTaskPriority;
  category?: TTaskCategory;
  subTasks?: ITask[];
}