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
import { useCategories } from './hooks/useCategories.ts';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<ITask> | undefined>(undefined);

  const { tasks, categoryIdFilter, setCategoryIdFilter, toggleComplete } = useTasks();
  const { categories } = useCategories();

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  function openAddModal() {
    setEditingTask({
      category: {
        id: categoryIdFilter,
        name: '',
        orderId: 0,
      },
    });
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

      <Categories selected={categoryIdFilter} items={categories} onSelect={setCategoryIdFilter}/>

      <div style={{ marginBottom: '40px' }}>
        {
          activeTasks.length ||
          completedTasks.length
            ? (
              <>
                {
                  activeTasks.length ? (
                    <TaskList
                      title={`Активные (${activeTasks.length})`}
                      items={activeTasks}
                      isOpen
                      onClick={openEditModal}
                      onComplete={toggleComplete}
                    />
                  ) : ''
                }

                {
                  completedTasks.length ? (
                    <TaskList
                      title={`Готовые (${completedTasks.length})`}
                      items={completedTasks}
                      onClick={openEditModal}
                      onComplete={toggleComplete}
                    />
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
