import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';
import { PriorityEnum } from '../../../types.ts';

// Версия 5 — priority стал числом
export const v5Migration: MigrationConfig = {
  version: 5,
  stores: {
    tasks: 'id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name, orderId',
  },
  upgrade: async (tx: Transaction) => {
    console.log('Запущена миграция БД до версии 5...');

    // Всем текущим задачам ставим priority = 4 - не определен
    const taskTable = tx.table<any>('tasks');
    await taskTable.toCollection().modify((task) => {
      task.priority = PriorityEnum.OTHER;
      task.updatedAt = new Date().toISOString();
    });

    console.log('Всем задачам установлен приоритет 4 - не определен');
  },
};