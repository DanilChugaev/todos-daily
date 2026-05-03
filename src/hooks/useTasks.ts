import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState } from 'react';
import { db } from '../utils/db/db.ts';
import type { ITask } from '../types.ts';

export const useTasks = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Реактивный список задач (обновляется автоматически при любых изменениях в БД)
  const tasks = useLiveQuery(() => {
    if (!selectedCategoryId) {
      return db.todos.orderBy('priority').toArray();
    }

    return db.todos
      .where('categoryId') // Фильтрация по индексированному полю ID
      .equals(selectedCategoryId)
      .sortBy('priority');
  }, [selectedCategoryId]) ?? [];

  // ========== CRUD ==========

  const addTask = useCallback(async (taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    try {
      const newTask: Omit<ITask, 'id'> = {
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.todos.add(newTask as ITask);
      return newTask;
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

  const toggleComplete = useCallback(async (id: number) => {
    try {
      await db.todos.update(id, (task) => {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      });
    } catch (error) {
      console.error(`Failed to toggle task complete ${id}:`, error);
      throw error;
    }
  }, []);

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
    selectedCategoryId,
    setSelectedCategoryId,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reassignCategory,
  };
};