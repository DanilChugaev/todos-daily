import type { MigrationConfig } from './types';

// Схема + индексы для быстрых фильтров
export const v1Migration: MigrationConfig = {
  version: 1,
  stores: {
    tasks: 'id, title, completed, category, priority, dueDate, createdAt, updatedAt',
  },
  upgrade: async () => console.log('Инициализация БД...'),
};