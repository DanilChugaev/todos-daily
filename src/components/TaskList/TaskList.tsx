import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import type { ITask } from '../../utils/db/db.ts';

interface TaskListProps {
  title: string;
  items: ITask[];
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export function TaskList({
  title,
  items,
  onClick,
  onComplete,
}: TaskListProps) {
  return (
    <div className="task-list">
      <p className="task-list__title">
        {title}
      </p>

      <ul className="task-list__items">
        {items.map((item: ITask) => (
          <Task
            key={item.id}
            item={item}
            onClick={onClick}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </div>
  );
}