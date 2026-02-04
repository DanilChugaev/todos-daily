import { useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TodoList } from './components/TodoList/TodoList.tsx';

function App() {
  const [items, setItems] = useState(['первая таска', '2 task', '3 таск']);

  function addItem() {
    // todo при клике вызывать модалку, в которой заполнить инфу по задаче
    setItems([...items, `new item - ${items.length + 1}`]);
  }

  return (
    <>
      <Header />

      <TodoList items={items} onAddItem={addItem}/>
    </>
  );
}

export default App;
