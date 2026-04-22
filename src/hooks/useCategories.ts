import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../utils/db/db.ts';
import type { ICategory } from '../types.ts';

export const useCategories = () => {
  const categories = useLiveQuery(() => db.categories.orderBy('orderId').toArray(), []) ?? [];
  const categoriesMap = useLiveQuery(async () => {
    // Получаем информацию о категориях
    const categories = await db.categories.toArray();

    // Создаем карту категорий для быстрого поиска по ID
    const cMap = new Map<number, string>();

    categories.forEach(category => {
      cMap.set(category.id, category.name);
    });

    return cMap;
  });

  // ========== CRUD ==========

  const addCategory = useCallback(async (name: ICategory['name']) => {
      const lastCategoryById = await db.categories.orderBy('id').last();
      const lastCategoryByOrder = await db.categories.orderBy('orderId').last();

      const newCategory: ICategory = {
        id: ++lastCategoryById!.id,
        name,
        orderId: ++lastCategoryByOrder!.orderId,
      };
  
      await db.categories.add(newCategory);
      return newCategory;
    }, []);

  const updateCategory = useCallback(async (id: number, name: ICategory['name']) => {
      await db.categories.update(id, {
        name: name,
      });
    }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await db.categories.delete(id);
  }, []);

  const bulkUpdateCategories = useCallback(async (categories: ICategory[]) => {
    await db.categories.bulkPut(categories);
  }, []);

  return {
    categories,
    categoriesMap,
    addCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
  };
};