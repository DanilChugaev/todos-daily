import './todo-item.pcss';

export type TTodoItemPriority = 'high' | 'medium' | 'low' | 'other';

export interface ITodoItem {
  id: number;
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
      {item.name}
    </li>
  );
}