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

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

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
    setEditingTask(undefined);
    setModalOpen(false);
  }

  return (
    <>
      <Header/>

      <Categories items={[]} onSelect={selectCategory}/>

      <div style={{ marginBottom: '40px' }}>
        {
          activeTasks.length ||
          completedTasks.length
            ? (
              <>
                {
                  activeTasks.length ? (
                    <>
                      <p style={{ padding: '0 var(--spacer-d)' }}>Активные</p>

                      <TaskList
                        items={activeTasks}
                        onClick={openEditModal}
                        onComplete={toggleComplete}
                      />
                    </>
                  ) : ''
                }

                {
                  completedTasks.length ? (
                    <>
                      <p style={{ padding: '0 var(--spacer-d)' }}>Готовые</p>

                      <TaskList
                        items={completedTasks}
                        onClick={openEditModal}
                        onComplete={toggleComplete}
                      />
                    </>
                  ) : ''
                }
              </>
            )
            : <div className="empty-list">Новых задач нет</div>
        }
      </div>

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
