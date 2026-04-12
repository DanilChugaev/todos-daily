import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import type { ITask } from '../../utils/db/db.ts';
import { useCallback, useEffect, useState } from 'react';
import { ArrowIcon } from '../Icon/ArrowIcon.tsx';
import { useCategories } from '../../hooks/useCategories.ts';

interface TaskListProps {
  title: string;
  items: ITask[];
  categoryIdFilter: number;
  isOpen?: boolean;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export function TaskList({
  title,
  items,
  categoryIdFilter,
  isOpen = false,
  onClick,
  onComplete,
}: TaskListProps) {
  const [isOpened, setIsOpened] = useState(isOpen);
  const [currentCategoryId, setCurrentCategoryId] = useState(0);

  const { categoriesMap } = useCategories();

  const getCategoryName = useCallback((categoryId: number) => {
    if (currentCategoryId === categoryId) return '';

    return categoriesMap?.get(categoryId)?.name ?? '';
  }, [categoriesMap, currentCategoryId]);

  useEffect(() => {
    setCurrentCategoryId(categoryIdFilter);
  }, [categoryIdFilter]);

  return (
    <div className={`task-list${isOpened ? ' task-list--active' : ''}`}>
      <p className="task-list__title" onClick={() => setIsOpened(!isOpened)}>
        <span>{title}</span>

        <ArrowIcon className="task-list__toggle-icon" />
      </p>

      <ul className="task-list__items">
        {items.map((item: ITask) => (
          <Task
            key={item.id}
            item={item}
            categoryName={getCategoryName(item.categoryId)}
            onClick={onClick}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </div>
  );
}