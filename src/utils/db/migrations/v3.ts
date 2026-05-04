import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';

// Версия 3 — новая схема + миграция - замена поля category на categoryId
export const v3Migration: MigrationConfig = {
  version: 3,
  stores: {
    tasks: 'id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name',
  },
  upgrade: async (tx: Transaction) => {
    console.log('Запущена миграция БД до версии 3...');

    const taskTable = tx.table<any>('tasks');
    await taskTable.toCollection().modify((task) => {
      // @ts-ignore
      delete task.category;

      task.categoryId = 0;
      task.updatedAt = new Date().toISOString();
    });

    console.log('Всем задачам установлен categoryId');
  },
};