// @ts-ignore
export enum PriorityEnum {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  OTHER = 4,
}

export interface ISubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  categoryId: ICategory['id'];
  priority: PriorityEnum;
  dueDate?: string;              // ISO-строка (например: "2026-04-15T18:00:00.000Z")
  completed: boolean;
  subtasks: ISubTask[];            // массив текстовых подзадач
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

export interface ISelect<T = number> {
  id: T;
  name: string;
}

export interface ICategory extends ISelect {
  orderId: number;
}

export interface IPriority extends ISelect<PriorityEnum> {}