export const PriorityEnum = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  OTHER: 4,
} as const;

export type PriorityEnum = typeof PriorityEnum[keyof typeof PriorityEnum];

export const TaskStatus = {
  NEW: 'new',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

export interface ITask {
  id: number;
  title: string;
  description?: string;
  categoryId: ICategory['id'];
  priority: PriorityEnum;
  dueDate?: string;              // ISO-строка (например: "2026-04-15T18:00:00.000Z")
  status: TaskStatus;
  subtasks: ISubtask[];            // массив текстовых подзадач
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
export interface ITaskStatus extends ISelect<TaskStatus> {}
