import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import type { ITask } from '../../utils/db/db.ts';

interface TaskListProps {
  items: ITask[];
  onClick:  (item: ITask) => void;
  onRemove?:  (id: string) => void;
  onComplete:  (id: string) => void;
}

export function TaskList({
  items,
  onClick,
  onRemove,
  onComplete,
}: TaskListProps) {
  return (
    <div className="task-list">
      <ul className="task-list__items">
        {items.map((item: ITask) => (
          <Task
            key={item.id}
            item={item}
            onClick={onClick}
            onRemove={onRemove}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </div>
  );
}