import { useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TodoList } from './components/TodoList/TodoList.tsx';
import { Week } from './components/Calendar/Week/Week.tsx';
import { ModalDialog } from './components/ModalDialog/ModalDialog.tsx';

function App() {
  const [items] = useState(['первая таска', '2 task', '3 таск']);
  const [isOpen, setIsOpen] = useState(false);

  // function addItem() {
  //   // todo при клике вызывать модалку, в которой заполнить инфу по задаче
  //   // setItems([...items, `new item - ${items.length + 1}`]);
  // }

  return (
    <>
      <Header />

      <Week />

      <TodoList items={items} onAddItem={() => setIsOpen(true)} />

      <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>тест</ModalDialog>
    </>
  );
}

export default App;
