import { type ChangeEvent, useState } from 'react';
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
    
    setItems([...items, {
      id: items[items.length - 1]?.id ?? 0,
      name,
      description,
    }]);

    clearFields();
    setIsOpen(false);
  }

  return (
    <>
      <Header />

      <Week />

      <Filters/>

      <TodoList items={items} onAddItem={() => setIsOpen(true)} />

      <ModalDialog
        title="Добавить задачу"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Input
          inverted
          id="task-name"
          label="Название"
          type="text"
          placeholder="Введите название задачи"
          value={name}
          onChange={handleNameChange}
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
          <PlusIcon />

          Добавить
        </Button>
      </ModalDialog>
    </>
  );
}

export default App;
