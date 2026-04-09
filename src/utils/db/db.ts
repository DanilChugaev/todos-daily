import Dexie, { type Table } from 'dexie';

export type PriorityType = 'low' | 'medium' | 'high' | 'other';

export interface ITask {
  id: string;
  title: string;
  description?: string;
  category: string;              // например: "Работа", "Личное" и т.д.
  priority: PriorityType;
  dueDate?: string;              // ISO-строка (например: "2026-04-15T18:00:00.000Z")
  completed: boolean;
  subtasks: string[];            // массив текстовых подзадач
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

export interface ICategory {
  id: number;          // авто-инкремент от Dexie
  name: string;
}

// Для удобства — константы (будут использоваться в модалке)
export const PRIORITIES = [
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
  { value: 'other', label: 'Другое' },
];

export const DEFAULT_CATEGORIES = [
  'Работа',
  'Дом',
  'Покупки',
  'Другое',
];

class TodosDB extends Dexie {
  tasks!: Table<ITask, string>;
  categories!: Table<ICategory, number>;

  constructor() {
    super('TodosDailyDB');

    // Схема + индексы для быстрых фильтров
    this.version(1).stores({
      tasks: 'id, title, completed, category, priority, dueDate, createdAt, updatedAt',
    });

    // Версия 2 — новая схема + миграция
    this.version(2).stores({
      tasks: 'id, title, completed, category, priority, dueDate, createdAt, updatedAt',
      categories: '++id, name', // ++id = авто-инкремент
    });

    // Миграция данных при обновлении до версии 2
    this.version(2).upgrade(async (transaction) => {
      console.log('Запущена миграция БД до версии 2...');

      // 1. Всем текущим задачам ставим priority = 'other'
      const taskTable = transaction.table<ITask>('tasks');
      await taskTable.toCollection().modify((task) => {
        task.priority = 'other';
        task.category = '';
        task.updatedAt = new Date().toISOString();
      });

      console.log('Всем задачам установлен приоритет "other"');

      // 2. Создаём таблицу категорий и заполняем дефолтными значениями
      const categoryTable = transaction.table<ICategory>('categories');
      const count = await categoryTable.count();

      if (count === 0) {
        await categoryTable.bulkAdd(DEFAULT_CATEGORIES.map((item, index) => ({
          id: index + 1,
          name: item,
        })));

        console.log('Добавлены дефолтные категории');
      }
    });

    // Заполнение при ПЕРВОМ создании БД
    this.on('populate', async () => {
      console.log('Первый запуск БД — заполняем категории');

      const categoryTable = this.table<ICategory>('categories');
      await categoryTable.bulkAdd(DEFAULT_CATEGORIES.map((item, index) => ({
        id: index + 1,
        name: item,
      })));

      console.log('Добавлены дефолтные категории через populate');
    });
  }
}

export const db = new TodosDB();