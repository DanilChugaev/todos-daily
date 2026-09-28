import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header/Header.tsx';
import { TaskList } from './components/TaskList/TaskList.tsx';
import { Categories } from './components/Categories/Categories.tsx';
import { PlusIcon } from './components/Icon/PlusIcon.tsx';
import { Button } from './components/Button/Button.tsx';
import { TaskEditorModal } from './components/TaskEditorModal/TaskEditorModal.tsx';
import './styles/App.pcss';
import { useTasks } from './hooks/useTasks';
import { useCategories } from './hooks/useCategories.ts';
import type { ITask } from './types.ts';
import { TaskToolbar } from './components/TaskToolbar/TaskToolbar.tsx';
import { DailySummary } from './components/DailySummary/DailySummary.tsx';
import { CategoryProgress } from './components/CategoryProgress/CategoryProgress.tsx';
import { filterTasksByScope, getTodayDate, matchesSearch, sortTasks, type SortOption } from './utils/tasks.ts';

const SORT_BY_KEY = 'tasks-sort-by';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<ITask> | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const savedSort = localStorage.getItem(SORT_BY_KEY);
    return savedSort === 'dueDate' || savedSort === 'createdAt' ? savedSort : 'priority';
  });

  const { tasks, selectedCategoryId, setSelectedCategoryId, toggleComplete, deleteTask, duplicateTask } = useTasks();
  const { categories } = useCategories();

  const scopedTasks = useMemo(() => filterTasksByScope(tasks, selectedCategoryId), [selectedCategoryId, tasks]);
  const filteredTasks = useMemo(() => sortTasks(scopedTasks.filter((task) => matchesSearch(task, query)), sortBy), [query, scopedTasks, sortBy]);
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const categoryCompletedCount = scopedTasks.filter((task) => task.completed).length;
  const todayActiveCount = tasks.filter((task) => task.dueDate === getTodayDate() && !task.completed).length;

  useEffect(() => {
    localStorage.setItem(SORT_BY_KEY, sortBy);
  }, [sortBy]);

  function handleChangeCategory(id: typeof selectedCategoryId) {
    setSelectedCategoryId(id);
    setActiveOpen(true);
    setCompletedOpen(false);
  }

  function openAddModal() {
    setEditingTask({
      categoryId: typeof selectedCategoryId === 'number' ? selectedCategoryId : 0,
      dueDate: selectedCategoryId === 'today' ? getTodayDate() : undefined,
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

  async function handleDeleteTask(task: ITask) {
    if (window.confirm(`Удалить задачу «${task.title}»?\n\nЭто действие нельзя отменить.`)) {
      await deleteTask(task.id);
    }
  }

  async function handleDuplicateTask(task: ITask) {
    await duplicateTask(task);
  }

  return (
    <>
      <Header/>

      <Categories selected={selectedCategoryId} items={categories} todayActiveCount={todayActiveCount} onSelect={handleChangeCategory}/>

      <main style={{ marginBottom: '40px' }}>
        {selectedCategoryId === 'today' && <DailySummary activeCount={scopedTasks.filter((task) => !task.completed).length} completedCount={categoryCompletedCount} />}
        {selectedCategoryId !== 'today' && <CategoryProgress completedCount={categoryCompletedCount} totalCount={scopedTasks.length} />}
        <TaskToolbar query={query} sortBy={sortBy} onQueryChange={setQuery} onSortChange={setSortBy} />
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
                      selectedCategoryId={selectedCategoryId}
                      isOpen={activeOpen}
                      onClick={openEditModal}
                      onComplete={toggleComplete}
                      onDelete={handleDeleteTask}
                      onDuplicate={handleDuplicateTask}
                      onToggleView={() => setActiveOpen(!activeOpen)}
                    />
                  ) : ''
                }

                {
                  completedTasks.length ? (
                    <TaskList
                      title={`Готовые (${completedTasks.length})`}
                      items={completedTasks}
                      selectedCategoryId={selectedCategoryId}
                      isOpen={completedOpen}
                      onClick={openEditModal}
                      onComplete={toggleComplete}
                      onDelete={handleDeleteTask}
                      onDuplicate={handleDuplicateTask}
                      onToggleView={() => setCompletedOpen(!completedOpen)}
                    />
                  ) : ''
                }
              </>
            )
            : (
              <section className="empty-list" aria-live="polite">
                <h1 className="empty-list__title">{query ? 'Ничего не найдено' : selectedCategoryId === 'today' ? 'На сегодня задач нет' : 'Здесь пока нет задач'}</h1>
                <p className="empty-list__description">{query ? 'Попробуйте изменить запрос.' : selectedCategoryId === 'today' ? 'Запланируйте важную задачу и сфокусируйтесь на текущем дне.' : 'Добавьте первую задачу и держите важное под контролем.'}</p>
                {!query && <Button onClick={openAddModal}><PlusIcon/>Добавить задачу</Button>}
              </section>
            )
        }
      </main>

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
