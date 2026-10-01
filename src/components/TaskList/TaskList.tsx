import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import { ArrowIcon } from '../Icon/ArrowIcon.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import type { ITask } from '../../types.ts';
import { Button } from '../Button/Button.tsx';
import type { TaskFilterId } from '../../utils/tasks.ts';

interface TaskListProps {
  title: string;
  items: ITask[];
  selectedCategoryId: TaskFilterId;
  isOpen: boolean;
  onClick:  (item: ITask) => void;
  onComplete:  (id: number) => void;
  onDelete: (item: ITask) => void;
  onDuplicate: (item: ITask) => void;
  onStart: (item: ITask) => Promise<void>;
  onToggleView: () => void;
}

const getCategoryName = ({
  selectedCategoryId,
  categoryId,
  categoriesMap,
}: {
  selectedCategoryId: TaskFilterId;
  categoryId?: number;
  categoriesMap?: Map<number, string>
}): string => {
  if (selectedCategoryId === categoryId || selectedCategoryId === 'today' || selectedCategoryId === 'overdue') return '';
  if (categoriesMap) return categoriesMap.get(categoryId ?? 0) ?? '';
  return '';
};

export function TaskList({
  title,
  items,
  selectedCategoryId,
  isOpen,
  onClick,
  onComplete,
  onDelete,
  onDuplicate,
  onStart,
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
              selectedCategoryId,
              categoryId: item.categoryId,
              categoriesMap,
            })}
            onClick={onClick}
            onComplete={onComplete}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onStart={onStart}
          />
        ))}
      </ul>
    </div>
  );
}
