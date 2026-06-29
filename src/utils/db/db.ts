import Dexie, { type Table } from 'dexie';
import { type ICategory, type ITask } from '../../types.ts';
import { DEFAULT_CATEGORIES } from '../../constants.ts';
import { MIGRATIONS } from './migrations';

// Запрашиваем у браузера не удалять данные автоматически
async function persistStorage(): Promise<void> {
  if ('storage' in navigator && typeof (navigator as any).storage?.persist === 'function') {
    const persisted = await (navigator as any).storage.persist();
    if (persisted) {
      console.log('Хранилище защищено от автоматической очистки');
    } else {
      console.warn('Не удалось защитить хранилище от автоматической очистки');
    }
  }
}

class TodosDB extends Dexie {
  categories!: Table<ICategory, number>;
  todos!: Table<ITask, number>; // Новая таблица с автоинкрементными number ID

  constructor() {
    super('TodosDailyDB');

    // Динамическое применение всех миграций
    for (const { version, stores, upgrade } of MIGRATIONS) {
      this.version(version).stores(stores).upgrade(upgrade!);
    }

    // Заполнение при ПЕРВОМ создании БД
    this.on('populate', async () => {
      console.log('Первый запуск БД — заполняем категории');

      const categoryTable = this.table<ICategory>('categories');
      await categoryTable.bulkAdd(DEFAULT_CATEGORIES.map((item, index) => ({
        id: index + 1,
        name: item,
        orderId: index,
      })));

      console.log('Добавлены дефолтные категории через populate');
    });
  }
}

export const db = new TodosDB();

// Инициализируем защиту хранилища при загрузке
persistStorage().catch((err) => console.error('Ошибка persist storage:', err));
