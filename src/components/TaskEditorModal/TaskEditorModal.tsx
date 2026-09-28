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
import { type ISubtask, type ITask, PriorityEnum } from '../../types.ts';
import { PRIORITIES_OPTIONS } from '../../constants.ts';
import { Subtask } from '../TaskList/Subtask/Subtask.tsx';
import { getTodayDate } from '../../utils/tasks.ts';

interface TaskEditorModalProps {
  task?: Partial<ITask>;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskForm {
  title: string;
  description: string;
  categoryId: number;
  priority: PriorityEnum;
  dueDate: string;
  subtasks: ISubtask[];
}

const createInitialForm = (task?: Partial<ITask>): TaskForm => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  categoryId: task?.categoryId ?? 0,
  priority: task?.priority ?? PriorityEnum.OTHER,
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
}: TaskEditorModalProps) {
  const { addTask, updateTask, deleteTask } = useTasks();
  const { categories } = useCategories();

  const initialForm = useMemo(() => createInitialForm(task), [task]);
  const [form, setForm] = useState<TaskForm>(initialForm);

  const [newSubtask, setNewSubtask] = useState('');
  const isEditMode = Boolean(task?.id);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
      setNewSubtask('');
    }
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

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
      dueDate: form.dueDate || undefined,
      subtasks: form.subtasks,
    };

    if (isEditMode && task?.id) {
      await updateTask(task.id, taskData);
    } else {
      await addTask(taskData);
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
      hasUnsavedChanges={showConfirmOnClose}
    >
      <Input
        focus
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
      </div>

      <Input
        id="task-due-date"
        type="date"
        min={getTodayDate()}
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />

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
    </ModalDialog>
  );
}
