import type { ITask } from '../components/TaskList/Task/types.ts';

const KEY = 'todos';

export function saveTaskToStorage(todo: ITask) {
  const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  const todos = getTodos();

  localStorage.setItem(KEY, JSON.stringify([...todos, {
    ...todo,
    id: uniqueID,
  }]));
}

export function saveTaskListToStorage(todos: ITask[]) {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

export function getTodos(): ITask[] {
  const storage = localStorage.getItem(KEY);
  return storage ? JSON.parse(storage) : [];
}

// export function getTodoById(id: ITask['id']) {
//
// }

export function removeTodoById(id: ITask['id']) {
  const todos = getTodos();
  const newTodos = todos.filter(item => item.id !== id);
  saveTaskListToStorage(newTodos);
}