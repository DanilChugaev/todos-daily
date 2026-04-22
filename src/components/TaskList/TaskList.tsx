import './task-list.pcss';
import { Task } from './Task/Task.tsx';
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

const getCategoryName = ({
  categoryIdFilter,
  categoryId,
  categoriesMap,
}: {
  categoryIdFilter: number;
  categoryId?: number;
  categoriesMap?: Map<number, string>
}): string => {
  if (categoryIdFilter === categoryId) return '';
  if (categoriesMap) return categoriesMap.get(categoryId ?? 0) ?? '';
  return '';
};

export function TaskList({
  title,
  items,
  categoryIdFilter,
  isOpen,
  onClick,
  onComplete,
  onToggleView,
}: TaskListProps) {
  const { categoriesMap } = useCategories();

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
            categoryName={getCategoryName({
              categoryIdFilter,
              categoryId: item.categoryId,
              categoriesMap,
            })}
            onClick={onClick}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </div>
  );
}