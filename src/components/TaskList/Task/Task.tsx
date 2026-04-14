import './task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import type { ITask } from '../../../utils/db/db.ts';
import { DocIcon } from '../../Icon/DocIcon.tsx';

interface TaskProps {
  item: ITask;
  categoryName: string;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export function Task({
  item,
  categoryName,
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
          {categoryName && (
            <span className="task__category">{categoryName}</span>
          )}

          {item.description && <DocIcon width="18px" height="18px"/>}
        </div>
      </div>
    </li>
  );
}