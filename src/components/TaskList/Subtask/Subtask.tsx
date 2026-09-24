import './sub-task.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import type { ISubtask } from '../../../types.ts';
import { Button } from '../../Button/Button.tsx';
import { TrashIcon } from '../../Icon/TrashIcon.tsx';

interface SubtaskProps {
  subtask: ISubtask;
  onChange: (id: string, title: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function Subtask({
  subtask,
  onChange,
  onDelete,
}: SubtaskProps) {
  function handleComplete() {
    onChange(subtask.id, subtask.title, !subtask.completed);
  }

  function handleChangeTitle(value: string) {
    onChange(subtask.id, value, subtask.completed);
  }

  return (
    <li className="sub-task">
      <Checkbox
        id={subtask.id}
        className="sub-task__checkbox"
        width="18px"
        height="18px"
        checked={subtask.completed}
        onChange={handleComplete}
      />

      <input
        type="text"
        className="sub-task__input"
        value={subtask.title}
        onChange={(e) => handleChangeTitle(e.target.value)}
      />

      <Button icon onClick={() => onDelete(subtask.id)}>
        <TrashIcon width="18px" height="18px"/>
      </Button>
    </li>
  );
}
