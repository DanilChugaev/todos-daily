import { PriorityEnum, type ITask } from '../types.ts';

export type SortOption = 'priority' | 'dueDate' | 'createdAt';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'priority', label: 'По приоритету' },
  { value: 'dueDate', label: 'По сроку' },
  { value: 'createdAt', label: 'По дате создания' },
];

export function getTodayDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function getDueDateLabel(dueDate?: string): { label: string; status: 'today' | 'tomorrow' | 'overdue' | 'upcoming' } | null {
  if (!dueDate) return null;

  const today = getTodayDate();
  const tomorrow = new Date(`${today}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  if (dueDate < today) return { label: 'Просрочено', status: 'overdue' };
  if (dueDate === today) return { label: 'Сегодня', status: 'today' };
  if (dueDate === tomorrowDate) return { label: 'Завтра', status: 'tomorrow' };

  return {
    label: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(`${dueDate}T00:00:00`)),
    status: 'upcoming',
  };
}

export function sortTasks(tasks: ITask[], sortBy: SortOption): ITask[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return a.priority - b.priority || b.createdAt.localeCompare(a.createdAt);
    }

    if (sortBy === 'dueDate') {
      return (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') || a.priority - b.priority;
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function matchesSearch(task: ITask, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru');
  if (!normalizedQuery) return true;

  return [task.title, task.description ?? '', ...task.subtasks.map((subtask) => subtask.title)]
    .some((value) => value.toLocaleLowerCase('ru').includes(normalizedQuery));
}

export function getCompletedSubtasksCount(task: ITask): number {
  return task.subtasks.filter((subtask) => subtask.completed).length;
}

export const DEFAULT_PRIORITY = PriorityEnum.OTHER;
