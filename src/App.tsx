import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TodoList } from './components/TodoList/TodoList.tsx';
import { Week } from './components/Calendar/Week/Week.tsx';
import { ModalDialog } from './components/ModalDialog/ModalDialog.tsx';
import { Filters } from './components/Filters/Filters.tsx';
import { Input } from './components/Form/Input/Input.tsx';
import { Textarea } from './components/Form/Textarea/Textarea.tsx';
import { PlusIcon } from './components/Icon/PlusIcon.tsx';
import { Button } from './components/Button/Button.tsx';
import type { ITodoItem } from './components/TodoList/TodoItem/TodoItem.tsx';
import { getTodos, saveTodo } from './utils/storage.ts';

function App() {
  const [items, setItems] = useState<ITodoItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function clearFields() {
    setName('');
    setDescription('');
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value);
  }

  function handleAddItem() {
    if (!name) return;

    const newItem = {
      id: '',
      done: false,
      name,
      description,
    };
    saveTodo(newItem);
    setItems([...items, newItem]);

    clearFields();
    setIsOpen(false);
  }

  const updateTodos = useCallback(() => {
    setItems(getTodos());
  }, [setItems]);

  useEffect(() => {
    setTimeout(updateTodos, 0);
  }, [updateTodos]);

  return (
    <>
      <Header/>

      <Week/>

      <Filters/>

      <TodoList
        items={items}
        onAddTodo={() => setIsOpen(true)}
        onRemoveTodo={updateTodos}
      />

      <ModalDialog
        title="Добавить задачу"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Input
          focus
          inverted
          id="task-name"
          label="Название"
          type="text"
          placeholder="Введите название задачи"
          value={name}
          onChange={handleNameChange}
          onEnter={handleAddItem}
        />

        <Textarea
          inverted
          id="task-name"
          label="Описание"
          placeholder="Введите описание задачи"
          value={description}
          onChange={handleDescriptionChange}
        />

        <Button inverted onClick={handleAddItem}>
          <PlusIcon/>

          Добавить
        </Button>
      </ModalDialog>
    </>
  );
}

export default App;
