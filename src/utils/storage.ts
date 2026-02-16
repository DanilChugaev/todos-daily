import type { ITodoItem } from '../components/TodoList/TodoItem/TodoItem.tsx';

const KEY = 'todos';

export function saveTodo(todo: ITodoItem) {
  const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  const todos = getTodos();

  localStorage.setItem(KEY, JSON.stringify([...todos, {
    ...todo,
    id: uniqueID,
  }]));
}

export function saveTodos(todos: ITodoItem[]) {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

export function getTodos(): ITodoItem[] {
  const storage = localStorage.getItem(KEY);
  return storage ? JSON.parse(storage) : [];
}

// export function getTodoById(id: ITodoItem['id']) {
//
// }

export function removeTodoById(id: ITodoItem['id']) {
  const todos = getTodos();
  const newTodos = todos.filter(item => item.id !== id);
  saveTodos(newTodos);
}