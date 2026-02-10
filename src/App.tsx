import { type ChangeEvent, useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TodoList } from './components/TodoList/TodoList.tsx';
import { Week } from './components/Calendar/Week/Week.tsx';
import { ModalDialog } from './components/ModalDialog/ModalDialog.tsx';
import { Filters } from './components/Filters/Filters.tsx';
import { Input } from './components/Form/Input/Input.tsx';
import { Textarea } from './components/Form/Textarea/Textarea.tsx';
import { PlusIcon } from './components/Icon/PlusIcon.tsx';
import { ICON_SIZE } from './constants.ts';
import { Button } from './components/Button/Button.tsx';

function App() {
  const [items] = useState(['первая таска', '2 task', '3 таск']);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // function addItem() {
  //   // setItems([...items, `new item - ${items.length + 1}`]);
  // }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value);
  }

  return (
    <>
      <Header />

      <Week />

      <Filters/>

      <TodoList items={items} onAddItem={() => setIsOpen(true)} />

      <ModalDialog title="Добавить задачу" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Input
          id="task-name"
          label="Название"
          type="text"
          placeholder="Введите название задачи"
          value={name}
          onChange={handleNameChange}
        />

        <Textarea
          id="task-name"
          label="Описание"
          placeholder="Введите описание задачи"
          value={description}
          onChange={handleDescriptionChange}
        />

        <Button onClick={() => setIsOpen(false)}>
          <PlusIcon width={ICON_SIZE} height={ICON_SIZE}/>

          Добавить
        </Button>
      </ModalDialog>
    </>
  );
}

export default App;
