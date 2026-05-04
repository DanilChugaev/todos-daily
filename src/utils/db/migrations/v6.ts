import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';

// Версия 6 — добавлена новая таблица todos с автоинкрементными number ID
export const v6Migration: MigrationConfig = {
  version: 6,
  stores: {
    tasks: 'id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    todos: '++id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name, orderId',
  },
  upgrade: async (tx: Transaction) => {
    console.log('Миграция v6: замена string ID на автоинкрементные number ID');

    const taskTable = tx.table<any>('tasks');
    const tasks = await taskTable.toArray();
    const todosTable = tx.table<any>('todos');

    console.log(`Найдено ${tasks.length} задач. Начинаем перенос ID...`);

    // 1. Подготавливаем данные с новыми числовыми ID
    const updatedTasks = tasks.map((task, index) => ({
      ...task,
      id: index + 1,
    }));

    // 2. Массово добавляем обновленные записи
    await todosTable.bulkAdd(updatedTasks);

    console.log(`Миграция завершена. Новых ID: ${tasks.length}`);
  },
};