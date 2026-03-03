import './task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import type { ITask } from './types.ts';
import { Button } from '../../Button/Button.tsx';
import { TrashIcon } from '../../Icon/TrashIcon.tsx';

interface TaskProps {
  item: ITask;
  onClick:  (item: ITask) => void;
  onRemove?:  (id: string) => void;
}

export function Task({ item, onClick, onRemove }: TaskProps) {
  return (
    <li className="task" onClick={() => onClick(item)}>
      <Checkbox id={item.id!}/>

      <div className="task__content">
        {item.name}
      </div>

      <div className="task__actions">
        {onRemove && <Button icon onClick={() => onRemove(item.id!)}>
          <TrashIcon />
        </Button>}
      </div>
    </li>
  );
}