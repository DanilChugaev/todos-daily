import './todo-item.pcss';

export function TodoItem({ item }: { item: any }) {
  return (
    <li className="todo-item">
      {item}
    </li>
  );
}