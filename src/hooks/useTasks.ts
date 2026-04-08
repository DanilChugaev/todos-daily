import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../utils/db/db.ts';
import type { ITask } from '../utils/db/db.ts';

export const useTasks = () => {
  // Реактивный список задач (обновляется автоматически при любых изменениях в БД)
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  // ========== CRUD ==========

  const addTask = useCallback(async (taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    const newTask: ITask = {
      ...taskData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2), // тот же стиль, что был в storage.ts
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.tasks.add(newTask);
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<ITask, 'id' | 'createdAt'>>) => {
    await db.tasks.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await db.tasks.delete(id);
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const task = await db.tasks.get(id);
    if (!task) return;

    await db.tasks.update(id, {
      completed: !task.completed,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  // Дополнительно: получить одну задачу по id
  const getTaskById = useCallback(async (id: string) => {
    return await db.tasks.get(id);
  }, []);

  // Очистка всех задач (полезно для отладки)
  const clearAll = useCallback(async () => {
    await db.tasks.clear();
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTaskById,
    clearAll,
  };
};