import './task-editor-modal.pcss';
import { Input } from '../Form/Input/Input.tsx';
import { Textarea } from '../Form/Textarea/Textarea.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useTasks } from '../../hooks/useTasks.ts';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import { Select } from '../Form/Select/Select.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { type ISubtask, type ITask, PriorityEnum, TaskStatus, type TaskStatus as TaskStatusType } from '../../types.ts';
import { PRIORITIES_OPTIONS, TASK_STATUS_OPTIONS } from '../../constants.ts';
import { Subtask } from '../TaskList/Subtask/Subtask.tsx';
import { getTodayDate } from '../../utils/tasks.ts';

interface TaskEditorModalProps {
  task?: Partial<ITask>;
  isOpen: boolean;
  onClose: () => void;
  onExited: () => void;
}

interface TaskForm {
  title: string;
  description: string;
  categoryId: number;
  priority: PriorityEnum;
  status: TaskStatusType;
  dueDate: string;
  subtasks: ISubtask[];
}

const createInitialForm = (task?: Partial<ITask>): TaskForm => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  categoryId: task?.categoryId ?? 0,
  priority: task?.priority ?? PriorityEnum.OTHER,
  status: task?.status ?? TaskStatus.NEW,
  dueDate: task?.dueDate ?? '',
  subtasks: task?.subtasks?.map((subtask) => ({ ...subtask })) ?? [],
});

const serializeForm = (form: TaskForm) => JSON.stringify({
  ...form,
  title: form.title.trim(),
  description: form.description.trim(),
  subtasks: form.subtasks.map(({ id, title, completed }) => ({ id, title: title.trim(), completed })),
});

export function TaskEditorModal({
  task,
  isOpen,
  onClose,
  onExited,
}: TaskEditorModalProps) {
  const { addTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const { categories } = useCategories();

  const initialForm = useMemo(() => createInitialForm(task), [task]);
  const [form, setForm] = useState<TaskForm>(initialForm);

  const [newSubtask, setNewSubtask] = useState('');
  const [isWipLimitOpen, setIsWipLimitOpen] = useState(false);
  const isEditMode = Boolean(task?.id);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
      setNewSubtask('');
      setIsWipLimitOpen(false);
    }
  }, [initialForm, isOpen]);

  async function handleSubmit() {
    if (!form.title.trim()) {
      alert('Название задачи обязательно!');
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      categoryId: form.categoryId,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      subtasks: form.subtasks,
    };

    if (isEditMode && task?.id) {
      const statusResult = await updateTaskStatus(task.id, form.status);
      if (!statusResult?.success) {
        setIsWipLimitOpen(true);
        return;
      }
      await updateTask(task.id, taskData);
    } else {
      const addResult = await addTask(taskData);
      if (!addResult.success) {
        setIsWipLimitOpen(true);
        return;
      }
    }

    handleBeforeClose();
  }

  async function handleDelete() {
    if (!task) return;

    const confirmed = window.confirm('Точно удалить задачу?\n\nЭто действие нельзя отменить.');

    if (confirmed) {
      await deleteTask(task.id!);

      handleBeforeClose();
    }
  }

  function handleBeforeClose() {
    onClose();
  }

  /* region Подзадачи */
  function handleAddSubtask() {
    if (newSubtask.trim()) {
      setForm((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          title: newSubtask.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      }));
      setNewSubtask('');
    }
  };

  function handleRemoveSubtask(id: string) {
    const confirmed = window.confirm('Точно удалить?');

    if (confirmed) {
      setForm((prev) => ({
        ...prev,
        subtasks: prev.subtasks.filter((item) => item.id !== id),
      }));
    }
  };

  function handleUpdateSubtask(id: string, title: string, completed: boolean) {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title,
            completed,
            updatedAt: new Date().toISOString(),
          };
        }

        return item;
      }),
    }));
  }
  /* endregion Подзадачи */

  const showConfirmOnClose = serializeForm(form) !== serializeForm(initialForm);

  return (
    <ModalDialog
      title={task?.title ? 'Редактировать задачу' : 'Добавить задачу'}
      isOpen={isOpen}
      onClose={handleBeforeClose}
      onExited={onExited}
      hasUnsavedChanges={showConfirmOnClose}
    >
      <Input
        modalAutoFocus
        id="task-name"
        type="text"
        placeholder="Название*"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        onEnter={handleSubmit}
      />

      <Textarea
        id="task-description"
        placeholder="Описание"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <div className="task-editor-modal__selects">
        <Select
          id="task-category"
          placeholder="Категория"
          value={form.categoryId}
          onChange={(categoryId) => setForm({ ...form, categoryId })}
          options={categories}
        />

        <Select
          id="task-priority"
          placeholder="Приоритет"
          value={form.priority}
          onChange={(priority) => setForm({ ...form, priority })}
          options={PRIORITIES_OPTIONS}
        />

        <Select
          id="task-status"
          placeholder="Статус"
          value={form.status}
          onChange={(status) => setForm({ ...form, status })}
          options={TASK_STATUS_OPTIONS}
        />
      </div>

      <Input
        id="task-due-date"
        type="date"
        min={getTodayDate()}
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />
      <Button
        className="task-editor-modal__today-button"
        size="small"
        inverted
        onClick={() => setForm({ ...form, dueDate: getTodayDate() })}
      >
        Сегодня
      </Button>

      {form.subtasks.length > 0 && (
        <div className="task-editor-modal__subtasks-list">
          {form.subtasks.map((subtask) => (
              <Subtask
                key={subtask.id}
                subtask={subtask}
                onDelete={handleRemoveSubtask}
                onChange={handleUpdateSubtask}
              />
            ))}
        </div>)
      }

      <div className="task-editor-modal__new-subtask">
        <Input
          id="add-subtask"
          type="text"
          placeholder="Добавить подзадачу"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onEnter={handleAddSubtask}
        />

        <Button icon ariaLabel="Добавить подзадачу" onClick={handleAddSubtask}>
          <PlusIcon/>
        </Button>
      </div>


      <div className="task-editor-modal__actions">
        <Button className="task-editor-modal__create-btn" onClick={handleSubmit}>
          <PlusIcon/>

          {task?.title ? ' Сохранить' : 'Добавить'}
        </Button>

        {isEditMode && (
          <Button icon ariaLabel="Удалить задачу" onClick={handleDelete}>
            <TrashIcon/>
          </Button>
        )}
      </div>

      {isWipLimitOpen && (
        <div className="task-editor-modal__limit-alert" role="alert">
          <strong>Лимит задач в работе</strong>
          <span>В этой категории уже 3 задачи в работе. Завершите одну или верните её в новые, чтобы освободить место.</span>
          <Button size="small" onClick={() => setIsWipLimitOpen(false)}>Понятно</Button>
        </div>
      )}
    </ModalDialog>
  );
}
