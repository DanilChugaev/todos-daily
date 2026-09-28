import './task.pcss';
import { type KeyboardEventHandler, memo } from 'react';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { DocIcon } from '../../Icon/DocIcon.tsx';
import { PriorityIcon } from '../../Icon/PriorityIcon.tsx';
import { PRIORITIES_COLOR_MAP, PRIORITY } from '../../../constants.ts';
import { type ITask, PriorityEnum } from '../../../types.ts';
import { BranchIcon } from '../../Icon/BranchIcon.tsx';
import { Button } from '../../Button/Button.tsx';
import { TrashIcon } from '../../Icon/TrashIcon.tsx';
import { CopyIcon } from '../../Icon/CopyIcon.tsx';
import { getCompletedSubtasksCount, getDueDateLabel } from '../../../utils/tasks.ts';

interface TaskProps {
  item: ITask;
  categoryName?: string;
  onClick:  (item: ITask) => void;
  onComplete:  (id: number) => void;
  onDelete: (item: ITask) => void;
  onDuplicate: (item: ITask) => void;
}

export const Task = memo(({
  item,
  categoryName = '',
  onClick,
  onComplete,
  onDelete,
  onDuplicate,
}: TaskProps) => {
  const handleTaskClick = () => onClick(item);
  const handleComplete = () => onComplete(item.id);
  const handleKeyDown: KeyboardEventHandler<HTMLLIElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTaskClick();
    }
  };
  const dueDate = getDueDateLabel(item.dueDate, item.completed);
  const completedSubtasks = getCompletedSubtasksCount(item);
  const subtaskProgress = item.subtasks.length ? (completedSubtasks / item.subtasks.length) * 100 : 0;
  const canCompleteFromSubtasks = !item.completed && item.subtasks.length > 0 && completedSubtasks === item.subtasks.length;

  return (
    <li
      className="task"
      role="button"
      tabIndex={0}
      onClick={handleTaskClick}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        id={item.id.toString()}
        checked={item.completed}
        onChange={handleComplete}
      />

      <div className="task__content">
        <span className="task__title">
          {item.title}
        </span>

        <div className="task__info">
          {categoryName && (
            <span className="task__category">{categoryName}</span>
          )}

          {item.description && <DocIcon width="0.8rem" height="0.8rem"/>}

          {dueDate && <span className={`task__due-date task__due-date--${dueDate.status}`}>{dueDate.label}</span>}

          {item.subtasks.length > 0 && (
            <span className="task__subtasks-progress" title={`Выполнено подзадач: ${completedSubtasks} из ${item.subtasks.length}`}>
              <BranchIcon width="0.8rem" height="0.8rem"/>
              {completedSubtasks}/{item.subtasks.length}
            </span>
          )}
        </div>

        {item.subtasks.length > 0 && (
          <div className="task__progress" aria-label={`Подзадачи: выполнено ${completedSubtasks} из ${item.subtasks.length}`}>
            <div className="task__progress-value" style={{ width: `${subtaskProgress}%` }} />
          </div>
        )}

        {canCompleteFromSubtasks && (
          <div className="task__completion-hint" onClick={(event) => event.stopPropagation()}>
            <span>Все подзадачи выполнены</span>
            <Button transparent onClick={handleComplete}>Завершить задачу</Button>
          </div>
        )}

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

      <div className="task__actions" onClick={(event) => event.stopPropagation()}>
        <Button icon ariaLabel="Создать копию задачи" onClick={() => onDuplicate(item)}><CopyIcon width={20} height={20} /></Button>
        <Button icon ariaLabel="Удалить задачу" onClick={() => onDelete(item)}><TrashIcon width={20} height={20} /></Button>
      </div>
    </li>
  );
});

Task.displayName = 'Task';
