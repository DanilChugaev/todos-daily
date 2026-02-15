import './todo-item.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';

export type TTodoItemPriority = 'high' | 'medium' | 'low' | 'other';

export interface ITodoItem {
  id: string;
  name: string;
  parentId?: number;
  description?: string;
  date?: Date;
  priority?: TTodoItemPriority;
  subItems?: ITodoItem[];
}

interface TodoItemProps {
  item: ITodoItem;
}

export function TodoItem({ item }: TodoItemProps) {
  return (
    <li className="todo-item">
      <Checkbox id={item.id}/>

      <div className="todo-item__content">
        {item.name}
      </div>

      <div className="todo-item__actions">
        act
      </div>
    </li>
  );
}