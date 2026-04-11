import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';
import { db, type ICategory, type ITaskDB } from '../utils/db/db.ts';
import type { ITask } from '../utils/db/db.ts';

export const useTasks = () => {
  const [categoryIdFilter, setCategoryIdFilter] = useState<number>(0);

  // Реактивный список задач (обновляется автоматически при любых изменениях в БД)
  const tasks = useLiveQuery(async () => {
    // Получаем информацию о категориях
    const categories = await db.categories.toArray();

    // Создаем карту категорий для быстрого поиска по ID
    const categoryMap = new Map<number, ICategory>();
    categories.forEach(category => {
      categoryMap.set(category.id, category);
    });

    if (!categoryIdFilter) {
      const dbTasks = await db.tasks.toArray();

      return dbTasks.map(task => ({
        ...task,
        category: categoryMap.get(task.categoryId) || undefined,
      }));
    }

    return await db.tasks
      .where('categoryId') // Фильтрация по индексированному полю ID
      .equals(categoryIdFilter)
      .toArray();
  }, [categoryIdFilter]) ?? [];

  // ========== CRUD ==========

  const addTask = useCallback(async (taskData: Omit<ITaskDB, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    const newTask: ITaskDB = {
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

  const reassignCategory = useCallback((oldCategoryId: number, newCategoryId: number) => {
    if (oldCategoryId === newCategoryId) return;

    return db.tasks
      .where('categoryId')
      .equals(oldCategoryId)
      .modify({
        categoryId: newCategoryId,
        updatedAt: new Date().toISOString(),
      });
  }, []);

  return {
    tasks,
    categoryIdFilter,
    setCategoryIdFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTaskById,
    clearAll,
    reassignCategory,
  };
};