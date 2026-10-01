import { db } from '../db/db.ts';
import { PriorityEnum, TaskStatus, type ICategory, type ITask } from '../../types.ts';
import { appVersion } from '../../appVersion.ts';
import { BACKUP_FORMAT, BACKUP_VERSION, type BackupFile, type BackupSummary, type ImportMode, type ImportResult } from './types.ts';

const TASK_STATUSES = new Set(Object.values(TaskStatus));
const PRIORITIES = new Set(Object.values(PriorityEnum));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isValidDueDate(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function validateTask(value: unknown): value is ITask {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'number' || typeof value.title !== 'string' || typeof value.categoryId !== 'number') return false;
  if (!PRIORITIES.has(value.priority as PriorityEnum) || !TASK_STATUSES.has(value.status as ITask['status'])) return false;
  if (!Array.isArray(value.subtasks) || !isValidDate(value.createdAt) || !isValidDate(value.updatedAt) || !isValidDueDate(value.dueDate)) return false;

  return value.subtasks.every((subtask) => isRecord(subtask)
    && typeof subtask.id === 'string'
    && typeof subtask.title === 'string'
    && typeof subtask.completed === 'boolean'
    && isValidDate(subtask.createdAt)
    && isValidDate(subtask.updatedAt));
}

function validateCategory(value: unknown): value is ICategory {
  return isRecord(value)
    && typeof value.id === 'number'
    && typeof value.name === 'string'
    && typeof value.orderId === 'number';
}

export function validateBackup(value: unknown): BackupFile {
  if (!isRecord(value) || value.format !== BACKUP_FORMAT) {
    throw new Error('Файл не является резервной копией TODOS daily.');
  }
  if (value.version !== BACKUP_VERSION) {
    throw new Error('Версия резервной копии не поддерживается.');
  }
  if (!isValidDate(value.exportedAt) || typeof value.appVersion !== 'string' || !isRecord(value.data)) {
    throw new Error('Файл содержит повреждённые метаданные.');
  }
  if (!Array.isArray(value.data.categories) || !value.data.categories.every(validateCategory)) {
    throw new Error('Файл содержит повреждённые категории.');
  }
  if (!Array.isArray(value.data.tasks) || !value.data.tasks.every(validateTask)) {
    throw new Error('Файл содержит повреждённые задачи.');
  }

  return value as unknown as BackupFile;
}

export function getBackupSummary(backup: BackupFile): BackupSummary {
  return {
    categories: backup.data.categories.length,
    tasks: backup.data.tasks.length,
    subtasks: backup.data.tasks.reduce((count, task) => count + task.subtasks.length, 0),
  };
}

export async function createBackup(): Promise<BackupFile> {
  const [categories, tasks] = await Promise.all([
    db.categories.orderBy('orderId').toArray(),
    db.todos.toArray(),
  ]);

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion,
    data: { categories, tasks },
  };
}

export function downloadBackup(backup: BackupFile): void {
  const date = backup.exportedAt.slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `todos-daily-backup-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function normalizeCategoryName(name: string): string {
  return name.trim().toLocaleLowerCase('ru');
}

function toNewTask(task: ITask, categoryId: number, status: ITask['status']): Omit<ITask, 'id'> {
  return {
    title: task.title,
    description: task.description,
    categoryId,
    priority: task.priority,
    dueDate: task.dueDate,
    status,
    subtasks: task.subtasks.map((subtask) => ({ ...subtask, id: crypto.randomUUID() })),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export async function importBackup(backup: BackupFile, mode: ImportMode): Promise<ImportResult> {
  const summary = getBackupSummary(backup);

  return db.transaction('rw', db.categories, db.todos, async () => {
    if (mode === 'replace') {
      await db.todos.clear();
      await db.categories.clear();
    }

    const existingCategories = await db.categories.toArray();
    const categoryMap = new Map<number, number>();
    const categoriesByName = new Map(existingCategories.map((category) => [normalizeCategoryName(category.name), category]));

    for (const importedCategory of backup.data.categories) {
      const matchingCategory = mode === 'merge' ? categoriesByName.get(normalizeCategoryName(importedCategory.name)) : undefined;
      if (matchingCategory) {
        categoryMap.set(importedCategory.id, matchingCategory.id);
        continue;
      }

      const id = await db.categories.add({ name: importedCategory.name.trim(), orderId: 0 } as ICategory);
      categoryMap.set(importedCategory.id, id);
      categoriesByName.set(normalizeCategoryName(importedCategory.name), { ...importedCategory, id });
    }

    const allCategories = await db.categories.toArray();
    await db.categories.bulkPut(allCategories
      .sort((first, second) => first.orderId - second.orderId)
      .map((category, index) => ({ ...category, orderId: index })));

    const inProgressByCategory = new Map<number, number>();
    if (mode === 'merge') {
      const inProgressTasks = await db.todos.where('status').equals(TaskStatus.IN_PROGRESS).toArray();
      inProgressTasks.forEach((task) => inProgressByCategory.set(task.categoryId, (inProgressByCategory.get(task.categoryId) ?? 0) + 1));
    }

    const tasksToAdd: Omit<ITask, 'id'>[] = [];
    let movedToNew = 0;
    for (const task of backup.data.tasks) {
      const categoryId = categoryMap.get(task.categoryId) ?? 0;
      let status = task.status;
      if (status === TaskStatus.IN_PROGRESS) {
        const count = inProgressByCategory.get(categoryId) ?? 0;
        if (count >= 3) {
          status = TaskStatus.NEW;
          movedToNew += 1;
        } else {
          inProgressByCategory.set(categoryId, count + 1);
        }
      }
      tasksToAdd.push(toNewTask(task, categoryId, status));
    }

    await db.todos.bulkAdd(tasksToAdd as ITask[]);
    return { ...summary, movedToNew };
  });
}
