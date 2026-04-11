import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db, type ICategory } from '../utils/db/db.ts';

export const useCategories = () => {
  const categories = useLiveQuery(() => db.categories.orderBy('orderId').toArray(), []) ?? [];

  // ========== CRUD ==========

  const addCategory = useCallback(async (name: ICategory['name']) => {
      const lastCategory = await db.categories.orderBy('id').last();

      const newCategory: ICategory = {
        id: ++lastCategory!.id,
        name,
        orderId: ++lastCategory!.orderId,
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
    addCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
  };
};