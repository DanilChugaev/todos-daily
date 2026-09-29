import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';
import { db } from '../utils/db/db.ts';
import { TaskStatus, type ITask, type TaskStatus as TaskStatusType } from '../types.ts';
import type { TaskFilterId } from '../utils/tasks.ts';

const EMPTY_TASKS: ITask[] = [];

export const useTasks = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<TaskFilterId>('today');

  const tasksResult = useLiveQuery(() => db.todos.toArray(), []);
  const tasks = tasksResult ?? EMPTY_TASKS;
  const isLoading = tasksResult === undefined;

  // ========== CRUD ==========

  const addTask = useCallback(async (taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await db.transaction('rw', db.todos, async () => {
        const status = taskData.status ?? TaskStatus.NEW;
        if (status === TaskStatus.IN_PROGRESS) {
          const inProgressCount = await db.todos
            .where('[categoryId+status]')
            .equals([taskData.categoryId, TaskStatus.IN_PROGRESS])
            .count();

          if (inProgressCount >= 3) return { success: false as const };
        }

        const newTask: Omit<ITask, 'id'> = {
          ...taskData,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await db.todos.add(newTask as ITask);
        return { success: true as const, task: newTask };
      });
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: number, updates: Partial<Omit<ITask, 'id' | 'createdAt'>>) => {
    try {
      await db.todos.update(id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to update task ${id}:`, error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await db.todos.delete(id);
    } catch (error) {
      console.error(`Failed to delete task ${id}:`, error);
      throw error;
    }
  }, []);

  const duplicateTask = useCallback(async (task: ITask) => {
    try {
      const now = new Date().toISOString();
      const copy: Omit<ITask, 'id'> = {
        title: `${task.title} (копия)`,
        description: task.description,
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate,
        status: TaskStatus.NEW,
        subtasks: task.subtasks.map((subtask) => ({
          ...subtask,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: now,
          updatedAt: now,
        })),
        createdAt: now,
        updatedAt: now,
      };

      return db.todos.add(copy as ITask);
    } catch (error) {
      console.error(`Failed to duplicate task ${task.id}:`, error);
      throw error;
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: number, status: TaskStatusType) => {
    try {
      await db.transaction('rw', db.todos, async () => {
        const task = await db.todos.get(id);
        if (!task) throw new Error(`Task ${id} not found`);

        if (status === TaskStatus.IN_PROGRESS && task.status !== TaskStatus.IN_PROGRESS) {
          const inProgressCount = await db.todos
            .where('[categoryId+status]')
            .equals([task.categoryId, TaskStatus.IN_PROGRESS])
            .count();

          if (inProgressCount >= 3) {
            throw new Error('WIP_LIMIT_REACHED');
          }
        }

        await db.todos.update(id, { status, updatedAt: new Date().toISOString() });
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'WIP_LIMIT_REACHED') return { success: false as const };
      console.error(`Failed to update task ${id} status:`, error);
      throw error;
    }
    return { success: true as const };
  }, []);

  const toggleComplete = useCallback(async (id: number) => {
    const task = await db.todos.get(id);
    if (!task) return;
    return updateTaskStatus(id, task.status === TaskStatus.COMPLETED ? TaskStatus.NEW : TaskStatus.COMPLETED);
  }, [updateTaskStatus]);

  const reassignCategory = useCallback((oldCategoryId: number, newCategoryId: number) => {
    if (oldCategoryId === newCategoryId) return;

    return db.todos
      .where('categoryId')
      .equals(oldCategoryId)
      .modify({
        categoryId: newCategoryId,
        updatedAt: new Date().toISOString(),
      });
  }, []);

  return {
    tasks,
    isLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleComplete,
    updateTaskStatus,
    reassignCategory,
  };
};
