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
import { TaskStatus, type ITask } from './types.ts';
import { TaskToolbar } from './components/TaskToolbar/TaskToolbar.tsx';
import { DailySummary } from './components/DailySummary/DailySummary.tsx';
import { CategoryProgress } from './components/CategoryProgress/CategoryProgress.tsx';
import { AppLoader } from './components/AppLoader/AppLoader.tsx';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog.tsx';
import { filterTasksByScope, getTodayDate, isTaskOverdue, matchesSearch, sortTasks, type SortOption } from './utils/tasks.ts';

const SORT_BY_KEY = 'tasks-sort-by';
const APP_LOADER_MIN_DURATION_MS = 1_800;

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(true);
  const [newOpen, setNewOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<ITask> | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [isLoaderDelayElapsed, setIsLoaderDelayElapsed] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  const [isWipLimitDialogOpen, setIsWipLimitDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const savedSort = localStorage.getItem(SORT_BY_KEY);
    return savedSort === 'dueDate' || savedSort === 'createdAt' ? savedSort : 'priority';
  });

  const { tasks, isLoading: isTasksLoading, selectedCategoryId, setSelectedCategoryId, toggleComplete, deleteTask, duplicateTask, updateTaskStatus } = useTasks();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const scopedTasks = useMemo(() => filterTasksByScope(tasks, selectedCategoryId), [selectedCategoryId, tasks]);
  const filteredTasks = useMemo(() => sortTasks(scopedTasks.filter((task) => matchesSearch(task, query)), sortBy), [query, scopedTasks, sortBy]);
  const inProgressTasks = filteredTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const newTasks = filteredTasks.filter((task) => task.status === TaskStatus.NEW);
  const completedTasks = filteredTasks.filter((task) => task.status === TaskStatus.COMPLETED);
  const categoryCompletedCount = scopedTasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  const todayActiveCount = tasks.filter((task) => task.dueDate === getTodayDate() && task.status !== TaskStatus.COMPLETED).length;
  const overdueActiveCount = tasks.filter(isTaskOverdue).length;
  const hasActiveTasksInCategory = scopedTasks.some((task) => task.status !== TaskStatus.COMPLETED);

  useEffect(() => {
    localStorage.setItem(SORT_BY_KEY, sortBy);
  }, [sortBy]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaderDelayElapsed(true), APP_LOADER_MIN_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function handleChangeCategory(id: typeof selectedCategoryId) {
    setSelectedCategoryId(id);
    setActiveOpen(true);
    setNewOpen(true);
    setCompletedOpen(false);
  }

  function openAddModal() {
    setEditingTask({
      categoryId: typeof selectedCategoryId === 'number' ? selectedCategoryId : 0,
      dueDate: selectedCategoryId === 'today' ? getTodayDate() : undefined,
      status: TaskStatus.NEW,
    });
    setModalOpen(true);
  }

  function openEditModal(task: ITask) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleModalExited() {
    setEditingTask(undefined);
  }

  function handleDeleteTask(task: ITask) {
    setTaskToDelete(task);
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete.id);
    setTaskToDelete(null);
  }

  async function handleDuplicateTask(task: ITask) {
    await duplicateTask(task);
  }

  async function handleStartTask(task: ITask) {
    const result = await updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);
    if (!result.success) {
      setIsWipLimitDialogOpen(true);
    }
  }

  const hasTasks = inProgressTasks.length || newTasks.length || completedTasks.length;

  if (isTasksLoading || isCategoriesLoading || !isLoaderDelayElapsed) return <AppLoader />;

  return (
    <>
      <Header/>
      <Categories selected={selectedCategoryId} items={categories} todayActiveCount={todayActiveCount} overdueActiveCount={overdueActiveCount} onSelect={handleChangeCategory}/>

      <main style={{ marginBottom: '40px' }}>
        {selectedCategoryId === 'today' && (
          <DailySummary
            activeCount={scopedTasks.filter((task) => task.status !== TaskStatus.COMPLETED).length}
            completedCount={categoryCompletedCount}
            inProgressCount={scopedTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length}
          />
        )}
        {selectedCategoryId !== 'today' && selectedCategoryId !== 'overdue' && <CategoryProgress completedCount={categoryCompletedCount} totalCount={scopedTasks.length} />}
        <TaskToolbar query={query} sortBy={sortBy} onQueryChange={setQuery} onSortChange={setSortBy} />

        {hasTasks ? (
          <>
            {inProgressTasks.length > 0 && (
              <TaskList
                title={typeof selectedCategoryId === 'number' && selectedCategoryId !== 0 ? `В работе · ${inProgressTasks.length} из 3` : `В работе (${inProgressTasks.length})`}
                items={inProgressTasks}
                selectedCategoryId={selectedCategoryId}
                isOpen={activeOpen}
                onClick={openEditModal}
                onComplete={toggleComplete}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onStart={handleStartTask}
                onToggleView={() => setActiveOpen(!activeOpen)}
              />
            )}
            {newTasks.length > 0 && (
              <TaskList
                title={`Новые (${newTasks.length})`}
                items={newTasks}
                selectedCategoryId={selectedCategoryId}
                isOpen={newOpen}
                onClick={openEditModal}
                onComplete={toggleComplete}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onStart={handleStartTask}
                onToggleView={() => setNewOpen(!newOpen)}
              />
            )}
            {!hasActiveTasksInCategory && completedTasks.length > 0 && !query && (
              <section className="empty-list empty-list--compact" aria-live="polite">
                <h1 className="empty-list__title">Здесь нет задач в работе или новых задач</h1>
                <p className="empty-list__description">Добавьте новую задачу, чтобы запланировать следующий шаг.</p>
                <Button onClick={openAddModal}><PlusIcon/>Добавить задачу</Button>
              </section>
            )}
            {completedTasks.length > 0 && (
              <TaskList
                title={`Готовые (${completedTasks.length})`}
                items={completedTasks}
                selectedCategoryId={selectedCategoryId}
                isOpen={completedOpen}
                onClick={openEditModal}
                onComplete={toggleComplete}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onStart={handleStartTask}
                onToggleView={() => setCompletedOpen(!completedOpen)}
              />
            )}
          </>
        ) : (
          <section className={`empty-list${query ? '' : ' empty-list--compact'}`} aria-live="polite">
            <h1 className="empty-list__title">{query ? 'Ничего не найдено' : selectedCategoryId === 'today' ? 'На сегодня задач нет' : selectedCategoryId === 'overdue' ? 'Просроченных задач нет' : 'Здесь пока нет задач'}</h1>
            <p className="empty-list__description">{query ? 'Попробуйте изменить запрос.' : selectedCategoryId === 'today' ? 'Запланируйте важную задачу и сфокусируйтесь на текущем дне.' : selectedCategoryId === 'overdue' ? 'Все задачи с прошедшим сроком уже завершены.' : 'Добавьте первую задачу и держите важное под контролем.'}</p>
            {!query && <Button onClick={openAddModal}><PlusIcon/>Добавить задачу</Button>}
          </section>
        )}
      </main>

      <Button className="new-task" onClick={openAddModal}><PlusIcon/>Добавить</Button>

      <TaskEditorModal task={editingTask} isOpen={modalOpen} onClose={closeModal} onExited={handleModalExited} />
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Удалить задачу?"
        description={`Задача «${taskToDelete?.title ?? ''}» будет удалена без возможности восстановления.`}
        confirmLabel="Удалить"
        destructive
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
      <ConfirmDialog
        isOpen={isWipLimitDialogOpen}
        title="Лимит задач в работе"
        description="В этой категории уже 3 задачи в работе. Завершите одну или верните её в новые, чтобы освободить место."
        confirmLabel="Понятно"
        hideCancel
        onConfirm={() => setIsWipLimitDialogOpen(false)}
        onCancel={() => setIsWipLimitDialogOpen(false)}
      />
    </>
  );
}

export default App;
