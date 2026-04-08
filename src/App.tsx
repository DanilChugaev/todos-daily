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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>(undefined);

  const { tasks, toggleComplete } = useTasks();

  // function clearFields() {}

  function selectCategory() {}

  function openAddModal() {
    setEditingTask(undefined);
    setModalOpen(true);
  }

  function openEditModal(task: ITask) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(undefined);
  }

  return (
    <>
      <Header/>

      <Categories items={[]} onSelect={selectCategory}/>

      {
        tasks.length
          ? <TaskList
              items={tasks}
              onClick={openEditModal}
              onComplete={toggleComplete}
            />
          : <div className="empty-list">Новых задач нет</div>
      }

      <Button className="new-task" onClick={openAddModal}>
        <PlusIcon/>

        Добавить
      </Button>

      <TaskEditorModal
        task={editingTask}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </>
  );
}

export default App;
