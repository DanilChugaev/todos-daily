import './todo-list.pcss';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { type ITodoItem, TodoItem } from './TodoItem/TodoItem.tsx';

interface TodoListProps {
  items: ITodoItem[];
  onAddTodo: () => void;
  onRemoveTodo: () => void;
}

export function TodoList({ items, onAddTodo, onRemoveTodo }: TodoListProps) {
  return (
    <div className="todo-list">
      {
        items.length
          ? <ul className="todo-list__items">
              {items.map((item: ITodoItem) => (
                <TodoItem key={item.id} item={item} onRemoveTodo={onRemoveTodo}/>
              ))}
            </ul>
          : <div className="todo-list__empty">Новых тасок нет</div>}

      <Button className="todo-list__add-btn" onClick={onAddTodo}>
        <PlusIcon/>

        Добавить
      </Button>
    </div>
  );
}