import './todo-list.pcss';
import { Button } from '../Button/Button.tsx';
import { ICON_SIZE } from '../../constants.ts';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TodoItem } from './TodoItem/TodoItem.tsx';
import { Filters } from '../Filters/Filters.tsx';

export function TodoList({ items, onAddItem }: { items: any[], onAddItem: () => void }) {
  return (
    <div className="todo-list">
      <div className="todo-list__content">
        <Filters/>

        <ul className="todo-list__items">
          {items.map((item: any) => (
            <TodoItem key={item} item={item} />
          ))}
        </ul>
      </div>

      <Button className="todo-list__add-btn" onClick={onAddItem}>
        <PlusIcon width={ICON_SIZE} height={ICON_SIZE} />

        Добавить
      </Button>
    </div>
  );
}