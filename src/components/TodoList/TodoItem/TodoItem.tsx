import './todo-item.pcss';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';

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
  onClick:  (id: string) => void;
}

export function TodoItem({ item, onClick }: TodoItemProps) {
  return (
    <li className="todo-item" onClick={() => onClick(item.id)}>
      <Checkbox id={item.id}/>

      <div className="todo-item__content">
        {item.name}
      </div>
    </li>
  );
}