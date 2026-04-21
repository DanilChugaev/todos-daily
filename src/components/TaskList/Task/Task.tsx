import './task.pcss';
import { type KeyboardEventHandler, memo } from 'react';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { DocIcon } from '../../Icon/DocIcon.tsx';
import { PriorityIcon } from '../../Icon/PriorityIcon.tsx';
import { PRIORITIES_COLOR_MAP, PRIORITY } from '../../../constants.ts';
import { type ITask, PriorityEnum } from '../../../types.ts';

interface TaskProps {
  item: ITask;
  categoryName: string;
  onClick:  (item: ITask) => void;
  onComplete:  (id: string) => void;
}

export const Task = memo(({
  item,
  categoryName,
  onClick,
  onComplete,
}: TaskProps) => {
  // Выносим обработчики, чтобы избежать лишних замыканий в JSX
  const handleTaskClick = () => onClick(item);
  const handleComplete = () => onComplete(item.id);
  const handleKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => e.key === 'Enter' && handleTaskClick();

  return (
    <li
      className="task"
      role="button"
      tabIndex={0}
      onClick={handleTaskClick}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        id={item.id}
        checked={item.completed}
        onChange={handleComplete}
      />

      <div className="task__content">
        <span>
          {item.title}
        </span>

        <div className="task__info">
          {categoryName && (
            <span className="task__category">{categoryName}</span>
          )}

          {item.description && <DocIcon width="0.8rem" height="0.8rem"/>}
        </div>

        {item.priority !== PriorityEnum.OTHER && (
          <PriorityIcon
            className="task__priority"
            title={PRIORITY[item.priority]}
            width="0.6rem"
            height="0.6rem"
            fill={PRIORITIES_COLOR_MAP[item.priority]}
          />
        )}
      </div>
    </li>
  );
});

Task.displayName = 'Task';