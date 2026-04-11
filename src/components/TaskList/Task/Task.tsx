import './task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import type { ITask } from '../../../utils/db/db.ts';

interface TaskProps {
  item: ITask;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export function Task({
  item,
  onClick,
  onComplete,
}: TaskProps) {
  return (
    <li className="task" onClick={() => onClick(item)}>
      <Checkbox
        id={item.id!}
        checked={item.completed}
        onChange={() => onComplete(item.id!)}
      />

      <div className="task__content">
        <span>
          {item.title}
        </span>


        <div className="task__info">
          {item.category?.name && (
            <span className="task__category">{item.category?.name}</span>
          )}
        </div>
      </div>
    </li>
  );
}