import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import { useEffect, useState } from 'react';
import { ArrowIcon } from '../Icon/ArrowIcon.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import type { ITask } from '../../types.ts';
import { Button } from '../Button/Button.tsx';

interface TaskListProps {
  title: string;
  items: ITask[];
  categoryIdFilter: number;
  isOpen: boolean;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
  onToggleView: () => void;
}

export function TaskList({
  title,
  items,
  categoryIdFilter,
  isOpen,
  onClick,
  onComplete,
  onToggleView,
}: TaskListProps) {
  const [currentCategoryId, setCurrentCategoryId] = useState(0);

  const { categoriesMap } = useCategories();

  useEffect(() => {
    setCurrentCategoryId(categoryIdFilter);
  }, [categoryIdFilter]);

  return (
    <div className={`task-list${isOpen ? ' task-list--active' : ''}`}>
      <Button
        className="task-list__title"
        transparent
        onClick={onToggleView}
      >
        <span>{title}</span>

        <ArrowIcon className="task-list__toggle-icon" />
      </Button>

      <ul className="task-list__items">
        {items.map((item: ITask) => (
          <Task
            key={item.id}
            item={item}
            categoryName={(currentCategoryId != item.categoryId) && categoriesMap ? categoriesMap.get(item.categoryId) : ''}
            onClick={onClick}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </div>
  );
}