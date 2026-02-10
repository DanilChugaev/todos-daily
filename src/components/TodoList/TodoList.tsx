import './todo-list.pcss';
import { Button } from '../Button/Button.tsx';
import { ICON_SIZE } from '../../constants.ts';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TodoItem } from './TodoItem/TodoItem.tsx';

export function TodoList({ items, onAddItem }: { items: string[], onAddItem: () => void }) {
  return (
    <div className="todo-list">
      <ul className="todo-list__items">
        {items.map((item: string) => (
          <TodoItem key={item} item={item}/>
        ))}
      </ul>

      <Button className="todo-list__add-btn" onClick={onAddItem}>
        <PlusIcon width={ICON_SIZE} height={ICON_SIZE}/>

        Добавить
      </Button>
    </div>
  );
}