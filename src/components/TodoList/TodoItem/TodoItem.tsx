import './todo-item.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { Button } from '../../Button/Button.tsx';
import { removeTodoById } from '../../../utils/storage.ts';

export type TTodoItemPriority = 'high' | 'medium' | 'low' | 'other';

export interface ITodoItem {
  id: string;
  name: string;
  done: boolean;
  parentId?: number;
  description?: string;
  date?: Date;
  priority?: TTodoItemPriority;
  subItems?: ITodoItem[];
}

interface TodoItemProps {
  item: ITodoItem;
  onRemoveTodo:  () => void;
}

export function TodoItem({ item, onRemoveTodo }: TodoItemProps) {
  function handleRemoveTodo() {
    removeTodoById(item.id);
    onRemoveTodo();
  }

  return (
    <li className="todo-item">
      <Checkbox id={item.id}/>

      <div className="todo-item__content">
        {item.name}
      </div>

      <div className="todo-item__actions">
        <Button onClick={handleRemoveTodo}>
          x
        </Button>
      </div>
    </li>
  );
}