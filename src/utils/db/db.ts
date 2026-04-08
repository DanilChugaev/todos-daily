import Dexie, { type Table } from 'dexie';

export interface ITask {
  id: string;
  title: string;
  description?: string;
  category: string;              // например: "Работа", "Личное" и т.д.
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;              // ISO-строка (например: "2026-04-15T18:00:00.000Z")
  completed: boolean;
  subtasks: string[];            // массив текстовых подзадач
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

// Для удобства — константы (будут использоваться в модалке)
export const PRIORITIES = [
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
  { value: 'other', label: 'Другое' },
] as const;

export const DEFAULT_CATEGORIES = [
  'Работа',
  'Личное',
  'Здоровье',
  'Покупки',
  'Учёба',
  'Дом',
  'Другое',
] as const;

class TodosDB extends Dexie {
  tasks!: Table<ITask, string>;

  constructor() {
    super('TodosDailyDB');

    // Схема + индексы для быстрых фильтров
    this.version(1).stores({
      tasks:
        'id, title, completed, category, priority, dueDate, createdAt, updatedAt',
    });

    // Индексы для сортировки и поиска
    // this.version(1).upgrade((_) => {
    //   // Если нужно будет добавить миграции позже — сюда
    // });
  }
}

export const db = new TodosDB();