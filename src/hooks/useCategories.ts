import { useLiveQuery } from 'dexie-react-hooks';
// import { useCallback } from 'react';
import { db } from '../utils/db/db.ts';
// import type { ICategory } from '../utils/db/db.ts';

export const useCategories = () => {
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];

  return {
    categories,
  };
};