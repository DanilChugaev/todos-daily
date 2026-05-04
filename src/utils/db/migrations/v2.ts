import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';
import { DEFAULT_CATEGORIES } from '../../../constants.ts';

// Версия 2 — новая схема + миграция
export const v2Migration: MigrationConfig = {
  version: 2,
  stores: {
    tasks: 'id, title, completed, category, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name', // ++id = авто-инкремент
  },
  upgrade: async (tx: Transaction) => {
    console.log('Запущена миграция БД до версии 2...');

    const taskTable = tx.table<any>('tasks');
    await taskTable.toCollection().modify((task: any) => {
      task.priority = 'other';
      task.category = undefined;
      task.updatedAt = new Date().toISOString();
    });
    console.log('Всем задачам установлен приоритет "other"');

    const categoryTable = tx.table<any>('categories');
    const count = await categoryTable.count();
    if (count === 0) {
      await categoryTable.bulkAdd(
        DEFAULT_CATEGORIES.map((name, i) => ({ id: i + 1, name })),
      );
      console.log('Добавлены дефолтные категории');
    }
  },
};