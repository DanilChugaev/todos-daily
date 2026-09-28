import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';

export const v8Migration: MigrationConfig = {
  version: 8,
  stores: {
    todos: '++id, title, status, categoryId, [categoryId+status], priority, dueDate, createdAt, updatedAt',
    categories: '++id, name, orderId',
  },
  upgrade: async (tx: Transaction) => {
    await tx.table('todos').toCollection().modify((task) => {
      task.status = task.completed ? 'completed' : 'new';
      delete task.completed;
    });
  },
};
