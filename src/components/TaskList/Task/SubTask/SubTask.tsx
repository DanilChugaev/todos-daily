import './sub-task.pcss';
import { Checkbox } from '../../../Checkbox/Checkbox.tsx';
import type { ISubTask } from '../../../../types.ts';
import { Button } from '../../../Button/Button.tsx';
import { TrashIcon } from '../../../Icon/TrashIcon.tsx';

interface SubTaskProps {
  subtask: ISubTask;
  onComplete: (id: string) => void;
  onChange: (title: string) => void;
  onDelete: () => void;
}

export function SubTask({
  subtask,
  onComplete,
  onChange,
  onDelete,
}: SubTaskProps) {
  return (
    <li className="sub-task">
      <Checkbox
        id={subtask.id!}
        className="sub-task__checkbox"
        width="18px"
        height="18px"
        checked={subtask.completed}
        onChange={() => onComplete(subtask.id!)}
      />

      <input
        type="text"
        className="sub-task__input"
        value={subtask.title}
        onChange={(e) => onChange(e.target.value)}
      />

      <Button icon onClick={onDelete}>
        <TrashIcon width="18px"
                   height="18px"/>
      </Button>
    </li>
  );
}