import './task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { DocIcon } from '../../Icon/DocIcon.tsx';
import { PriorityIcon } from '../../Icon/PriorityIcon.tsx';
import { PRIORITIES_COLOR_MAP, PRIORITY } from '../../../constants.ts';
import type { ITask } from '../../../types.ts';

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
          {item.priority !== 4 && (
            <PriorityIcon
              className="task__priority"
              title={PRIORITY[item.priority]}
              width="0.6rem"
              height="0.6rem"
              fill={PRIORITIES_COLOR_MAP[item.priority]}
            />
          )}

          {categoryName && (
            <span className="task__category">{categoryName}</span>
          )}

          {item.description && <DocIcon width="18px" height="18px"/>}
        </div>
      </div>
    </li>
  );
}