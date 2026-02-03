import './todo-list.pcss';
// @ts-ignore
import PlusIcon from '../../icons/plus.svg?react';
import { Button } from '../Button/Button.tsx';
import { ICON_SIZE } from '../../constants.ts';

export function TodoList() {
  return (
    <div className="todo-list">
      <Button className="todo-list__add-btn" onClick={() => console.log('click')}>
        <PlusIcon width={ICON_SIZE} height={ICON_SIZE} />

        Добавить
      </Button>
    </div>
  );
}