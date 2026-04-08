import { useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TaskList } from './components/TaskList/TaskList.tsx';
import { Categories } from './components/Categories/Categories.tsx';
import { PlusIcon } from './components/Icon/PlusIcon.tsx';
import { Button } from './components/Button/Button.tsx';
import { TaskEditorModal } from './components/TaskEditorModal/TaskEditorModal.tsx';
import './styles/App.pcss';
import { useTasks } from './hooks/useTasks';
import type { ITask } from './utils/db/db.ts';

function App() {
  // const [items, setItems] = useState<ITask[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');

  function clearFields() {
    // setName('');
    // setDescription('');
  }

  function saveTask(newTask: ITask) {
    addTask(newTask);

    clearFields();
    closeTaskEditorModal();
  }

  function editTask() {
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

  return (
    <>
      <Header/>

      <Categories items={[]} onSelect={handleSelectCategory}/>

      {
        tasks.length
          ? <TaskList
              items={tasks}
              onClick={editTask}
              onComplete={toggleComplete}
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
        onSave={saveTask}
        onClose={closeTaskEditorModal}
      />
    </>
  );
}

export default App;
