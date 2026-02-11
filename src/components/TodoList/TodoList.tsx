import './todo-list.pcss';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { type ITodoItem, TodoItem } from './TodoItem/TodoItem.tsx';

interface TodoListProps {
  items: ITodoItem[];
  onAddItem: () => void;
}

export function TodoList({ items, onAddItem }: TodoListProps) {
  return (
    <div className="todo-list">
      <ul className="todo-list__items">
        {items.map((item: ITodoItem) => (
          <TodoItem key={item.id} item={item}/>
        ))}
      </ul>

      <Button className="todo-list__add-btn" onClick={onAddItem}>
        <PlusIcon />

        Добавить
      </Button>
    </div>
  );
}