import './task-list.pcss';
import { Task } from './Task/Task.tsx';
import type { ITask } from '../../utils/db/db.ts';
import { useState } from 'react';
import { ArrowIcon } from '../Icon/ArrowIcon.tsx';

interface TaskListProps {
  title: string;
  items: ITask[];
  isOpen?: boolean;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export function TaskList({
  title,
  items,
  isOpen = false,
  onClick,
  onComplete,
}: TaskListProps) {
  const [isOpened, setIsOpened] = useState(isOpen);

  return (
    <div className={`task-list ${isOpened ? 'task-list--active': ''} `}>
      <p className="task-list__title" onClick={() => setIsOpened(!isOpened)}>
        <span>{title}</span>

        <ArrowIcon className="task-list__toggle-icon" />
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