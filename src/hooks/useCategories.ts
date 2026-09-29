import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useMemo } from 'react';
import { db } from '../utils/db/db.ts';
import type { ICategory } from '../types.ts';

const EMPTY_CATEGORIES: ICategory[] = [];

export const useCategories = () => {
  const categoriesResult = useLiveQuery(() => db.categories.orderBy('orderId').toArray(), []);
  const categories = categoriesResult ?? EMPTY_CATEGORIES;
  const isLoading = categoriesResult === undefined;

  const categoriesMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  // ========== CRUD ==========

  const addCategory = useCallback(async (name: ICategory['name']) => {
    try {
      const newCategory: Omit<ICategory, 'id'> = {
        name,
        orderId: (categories.at(-1)?.orderId ?? -1) + 1,
      };

      const id = await db.categories.add(newCategory as ICategory);
      return { ...newCategory, id };
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  }, [categories]);

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
    isLoading,
    categoriesMap,
    addCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
  };
};
