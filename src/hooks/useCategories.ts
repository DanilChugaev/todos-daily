import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useMemo } from 'react';
import { db } from '../utils/db/db.ts';
import type { ICategory } from '../types.ts';

// Создаем карту категорий для быстрого поиска по ID
const cMap = new Map<number, string>();

export const useCategories = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categories = useLiveQuery(() => db.categories.orderBy('orderId').toArray(), []) ?? [];

  // Вычисляем и кэшируем массив отдельно
  const stableCategories = useMemo(() => categories, [categories]);

  const categoriesMap = useMemo(() => {
    cMap.clear();

    stableCategories.forEach(category => cMap.set(category.id, category.name));

    return cMap;
  }, [stableCategories]);

  // ========== CRUD ==========

  const addCategory = useCallback(async (name: ICategory['name']) => {
    try {
      const lastCategoryByOrder = stableCategories.at(-1);

      const newCategory: Omit<ICategory, 'id'> = {
        name,
        orderId: ++lastCategoryByOrder!.orderId,
      };

      const id = await db.categories.add(newCategory as ICategory);
      return { ...newCategory, id };
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  }, [stableCategories]);

  const updateCategory = useCallback(async (id: number, name: ICategory['name']) => {
    try {
      await db.categories.update(id, { name });
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await db.categories.delete(id);
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  }, []);

  const bulkUpdateCategories = useCallback(async (categoriesList: ICategory[]) => {
    try {
      await db.categories.bulkPut(categoriesList);
    } catch (error) {
      console.error('Failed to bulk update categories:', error);
      throw error;
    }
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