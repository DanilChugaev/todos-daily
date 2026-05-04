import type { Transaction } from 'dexie';
import type { MigrationConfig } from './types';

// Версия 4 — добавлен orderId
export const v4Migration: MigrationConfig = {
  version: 4,
  stores: {
    tasks: 'id, title, completed, categoryId, priority, dueDate, createdAt, updatedAt',
    categories: '++id, name, orderId',
  },
  upgrade: async (tx: Transaction) => {
    console.log('Миграция БД v4: добавляем orderId категориям');
    const categoriesTable = tx.table<any>('categories');
    const allCategories = await categoriesTable.toArray();

    // Присваиваем порядок по текущему порядку в таблице
    for (let i = 0; i < allCategories.length; i++) {
      await categoriesTable.update(allCategories[i].id, { orderId: i });
    }

    console.log(`orderId проставлен для ${allCategories.length} категорий`);
  },
};