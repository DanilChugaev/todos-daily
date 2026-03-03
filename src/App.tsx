import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TaskList } from './components/TaskList/TaskList.tsx';
import { Categories } from './components/Categories/Categories.tsx';
import { PlusIcon } from './components/Icon/PlusIcon.tsx';
import { Button } from './components/Button/Button.tsx';
import { getTodos, saveTaskToStorage } from './utils/storage.ts';
import type { ITask } from './components/TaskList/Task/types.ts';
import { TaskEditorModal } from './components/TaskEditorModal/TaskEditorModal.tsx';
import './styles/App.pcss';

function App() {
  const [items, setItems] = useState<ITask[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');

  function clearFields() {
    // setName('');
    // setDescription('');
  }

  // function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
  //   setName(event.target.value);
  // }
  //
  // function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
  //   setDescription(event.target.value);
  // }

  function handleSaveTask(newTask: ITask) {
    saveTaskToStorage(newTask);
    // после сохранения получаем обновленный список с id
    setItems([...items, newTask]);

    clearFields();
    closeTaskEditorModal();
  }

  function handleEditTask() {
    // Implement edit functionality
    // Open modal with ITask object
  }

  // function handleRemoveTask() {
  //   // Implement remove functionality
  //   // Remove item from items array
  // }

  function handleSelectCategory() {

  }

  function openTaskEditorModal() {
    setIsOpen(true);
  }

  function closeTaskEditorModal() {
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

      <Categories items={[]} onSelect={handleSelectCategory}/>

      {
        items.length
          ? <TaskList
              items={items}
              onClick={handleEditTask}
            />
          : <div className="empty-list">Новых задач нет</div>
      }

      <Button className="new-task" onClick={openTaskEditorModal}>
        <PlusIcon/>

        Добавить
      </Button>

      <TaskEditorModal
        task={{}}
        isOpen={isOpen}
        onSave={handleSaveTask}
        onClose={closeTaskEditorModal}
      />
    </>
  );
}

export default App;
