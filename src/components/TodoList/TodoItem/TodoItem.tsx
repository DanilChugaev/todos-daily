import type { ReactNode } from 'react';
import './todo-item.pcss';

export function TodoItem({ item }: { item: ReactNode }) {
  return (
    <li className="todo-item">
      {item}
    </li>
  );
}