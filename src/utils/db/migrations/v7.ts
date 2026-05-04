import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';

// Версия 7 — удалена старая таблица tasks со string ID
export const v7Migration: MigrationConfig = {
  version: 7,
  stores: {
    todos: '++id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name, orderId',
  },
  upgrade: async (tx: Transaction) => {
    console.log('Миграция v7: явное удаление таблицы tasks');
    const tasksTable = tx.table<any>('tasks');
    await tasksTable.clear();
    console.log('Таблица tasks очищена. Схема будет обновлена без неё.');
  },
};