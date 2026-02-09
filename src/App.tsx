import { useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TodoList } from './components/TodoList/TodoList.tsx';
import { Week } from './components/Calendar/Week/Week.tsx';
import { ModalDialog } from './components/ModalDialog/ModalDialog.tsx';
import { Filters } from './components/Filters/Filters.tsx';
import { Input } from './components/Input/Input.tsx';

function App() {
  const [items] = useState(['первая таска', '2 task', '3 таск']);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  // function addItem() {
  //   // todo при клике вызывать модалку, в которой заполнить инфу по задаче
  //   // setItems([...items, `new item - ${items.length + 1}`]);
  // }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <>
      <Header />

      <Week />

      <Filters/>

      <TodoList items={items} onAddItem={() => setIsOpen(true)} />

      <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Input
          label="Название"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Введите название задачи"
        />
      </ModalDialog>
    </>
  );
}

export default App;
