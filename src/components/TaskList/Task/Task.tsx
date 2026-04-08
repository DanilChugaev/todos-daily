import './task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { Button } from '../../Button/Button.tsx';
import { TrashIcon } from '../../Icon/TrashIcon.tsx';
import type { ITask } from '../../../utils/db/db.ts';

interface TaskProps {
  item: ITask;
  onClick:  (item: ITask) => void;
  onRemove?:  (id: string) => void;
  onComplete:  (id: string) => void;
}

export function Task({
  item,
  onClick,
  onRemove,
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
        {item.title}
      </div>

      <div className="task__actions">
        {onRemove && <Button icon onClick={() => onRemove(item.id!)}>
          <TrashIcon />
        </Button>}
      </div>
    </li>
  );
}